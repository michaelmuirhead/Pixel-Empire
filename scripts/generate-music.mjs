// Generates the game's ambient music: four era-flavored chiptune loops,
// composed procedurally and encoded to MP3 in public/music/.
//
//   node scripts/generate-music.mjs
//
// Tracks are deterministic (seeded RNG), so re-running reproduces the same
// files. Each composition eases in and decays at the loop point so the small
// MP3 encoder gap is inaudible when the game loops the buffer.

import { mkdirSync, writeFileSync } from "node:fs";
import { Mp3Encoder } from "@breezystack/lamejs";

const SR = 44100;
const OUT_DIR = new URL("../public/music/", import.meta.url).pathname;

// ---------- tiny deterministic RNG ----------
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- synthesis ----------
const midiHz = m => 440 * Math.pow(2, (m - 69) / 12);

// Harmonic recipes stand in for classic waveforms, pre-softened for ambience.
const SQUARE = [[1, 1], [3, 0.33], [5, 0.2], [7, 0.14], [9, 0.1]];
const SAW    = [[1, 1], [2, 0.5], [3, 0.33], [4, 0.25], [5, 0.2], [6, 0.16]];
const TRI    = [[1, 1], [3, 0.111], [5, 0.04]];
const SINE   = [[1, 1], [2, 0.07]];

// Adds one note into the loop buffer. Indexing wraps, so release tails that
// run past the end land at the start — the loop has no seam of its own.
function tone(buf, tSec, durSec, midi, gain, o = {}) {
  const N = buf.length;
  const harm = o.harm || SINE;
  const att = Math.max(0.004, o.attack ?? 0.012);
  const rel = Math.max(0.03, o.release ?? Math.min(0.35, durSec * 0.5));
  const hz = midiHz(midi);
  const n = Math.round((durSec + rel) * SR);
  const start = Math.round(tSec * SR);
  const vibD = o.vibDepth ?? 0, vibR = o.vibRate ?? 5;
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = t < att ? t / att : t < durSec ? 1 : Math.max(0, 1 - (t - durSec) / rel);
    const f = hz * (1 + vibD * Math.sin(2 * Math.PI * vibR * t));
    phase += (2 * Math.PI * f) / SR;
    let v = 0;
    for (const [m, a] of harm) v += a * Math.sin(phase * m);
    buf[(start + i) % N] += v * gain * env * env;
  }
}

function toneEcho(buf, tSec, durSec, midi, gain, o = {}, delay = 0.35, times = 2) {
  tone(buf, tSec, durSec, midi, gain, o);
  for (let e = 1; e <= times; e++) tone(buf, tSec + delay * e, durSec, midi, gain * Math.pow(0.42, e), o);
}

// ---------- compositions ----------
// Each returns { buf } — a mono Float64Array exactly one loop long.

function compose({ seed, bpm, bars, chords, styles }) {
  const rng = mulberry32(seed);
  const beat = 60 / bpm;
  const barSec = beat * 4;
  const buf = new Float64Array(Math.round(bars * barSec * SR));
  for (let bar = 0; bar < bars; bar++) {
    const chord = chords[bar % chords.length];
    const t0 = bar * barSec;
    const fade = bar === bars - 1 ? 0.55 : 1; // decay into the loop point
    for (const style of styles) style({ buf, t0, beat, barSec, chord, bar, bars, rng, fade });
  }
  return buf;
}

// Reusable style layers ------------------------------------------------------
const pad = (harm, gain, attack, vib = 0) => ({ buf, t0, barSec, chord, fade }) => {
  for (const m of chord) tone(buf, t0, barSec * 0.96, m, gain * fade, { harm, attack, release: barSec * 0.4, vibDepth: vib, vibRate: 4.5 });
};

const bassHalf = (harm, gain) => ({ buf, t0, beat, chord, fade }) => {
  tone(buf, t0, beat * 1.6, chord[0] - 12, gain * fade, { harm, release: 0.25 });
  tone(buf, t0 + beat * 2, beat * 1.6, chord[0] - 12, gain * 0.85 * fade, { harm, release: 0.25 });
};

const bassPulse = (harm, gain) => ({ buf, t0, beat, chord, fade }) => {
  for (let i = 0; i < 8; i++) tone(buf, t0 + i * beat * 0.5, beat * 0.34, chord[0] - 12, gain * (i % 2 ? 0.7 : 1) * fade, { harm, release: 0.06 });
};

const arp8 = (harm, gain, oct = 12) => ({ buf, t0, beat, chord, bar, fade }) => {
  for (let i = 0; i < 8; i++) {
    const m = chord[(i + bar) % chord.length] + oct;
    tone(buf, t0 + i * beat * 0.5, beat * 0.42, m, gain * fade, { harm, release: 0.12 });
  }
};

const arpQuarter = (harm, gain, oct = 12) => ({ buf, t0, beat, chord, bar, fade }) => {
  for (let i = 0; i < 4; i++) {
    const m = chord[(i + bar * 2) % chord.length] + oct;
    tone(buf, t0 + i * beat, beat * 0.8, m, gain * fade, { harm, release: 0.3, vibDepth: 0.004, vibRate: 5.5 });
  }
};

const sparkle = (harm, gain, notes, chance = 0.5, echoDelay = 0.3) => ({ buf, t0, beat, rng, bar, bars, fade }) => {
  if (bar === bars - 1 || rng() > chance) return;
  const slot = 1 + Math.floor(rng() * 5);
  const m = notes[Math.floor(rng() * notes.length)];
  toneEcho(buf, t0 + slot * beat * 0.5, beat * 0.9, m, gain * fade, { harm, release: 0.4, vibDepth: 0.006, vibRate: 5 }, echoDelay);
};

const keysStab = (harm, gain) => ({ buf, t0, beat, chord, rng, fade }) => {
  for (const [when, g] of [[0, 1], [2.5, 0.75]]) {
    for (const m of chord) tone(buf, t0 + when * beat + rng() * 0.012, beat * 1.4, m, gain * g * fade, { harm, attack: 0.02, release: 0.8 });
  }
};

// A-minor pentatonic sparkles for the chip era; F#-minor for neon; etc.
const TRACKS = [
  {
    id: "chip-dreams", seed: 19840101, bpm: 92, bars: 16,
    chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], // Am F C G
    styles: [
      pad(SQUARE, 0.014, 0.5),
      bassHalf(TRI, 0.06),
      arp8(SQUARE, 0.03),
      sparkle(SQUARE, 0.026, [69, 72, 74, 76, 79], 0.55, 0.326),
    ],
  },
  {
    id: "neon-grid", seed: 19950909, bpm: 84, bars: 16,
    chords: [[54, 57, 61], [50, 54, 57], [57, 61, 64], [52, 56, 59]], // F#m D A E
    styles: [
      pad(SAW, 0.011, 0.9, 0.003),
      bassPulse(SAW, 0.042),
      arp8(TRI, 0.028),
      sparkle(SAW, 0.02, [66, 69, 71, 73, 78], 0.45, 0.357),
    ],
  },
  {
    id: "polygon-sunset", seed: 20060615, bpm: 66, bars: 12,
    chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], // Cmaj7 Am7 Fmaj7 G7
    styles: [
      pad(TRI, 0.026, 1.3, 0.004),
      bassHalf(SINE, 0.065),
      arpQuarter(SINE, 0.024),
      sparkle(TRI, 0.02, [72, 74, 76, 79, 81], 0.4, 0.45),
    ],
  },
  {
    id: "cloud-save", seed: 20160321, bpm: 72, bars: 16,
    chords: [[50, 53, 57, 60], [53, 57, 60, 64], [48, 52, 55, 59], [57, 60, 64, 67]], // Dm7 Fmaj7 Cmaj7 Am7
    styles: [
      pad(SINE, 0.03, 1.1, 0.005),
      bassHalf(SINE, 0.075),
      keysStab(TRI, 0.02),
      sparkle(SINE, 0.024, [69, 72, 74, 77, 81], 0.45, 0.417),
    ],
  },
];

// ---------- render + encode ----------
mkdirSync(OUT_DIR, { recursive: true });
for (const track of TRACKS) {
  const buf = compose(track);
  // normalize to a consistent, gentle level
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const scale = peak > 0 ? 0.45 / peak : 0;
  const pcm = new Int16Array(buf.length);
  for (let i = 0; i < buf.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(buf[i] * scale * 32767)));

  const enc = new Mp3Encoder(1, SR, 112);
  const chunks = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const d = enc.encodeBuffer(pcm.subarray(i, i + 1152));
    if (d.length) chunks.push(Buffer.from(d));
  }
  const end = enc.flush();
  if (end.length) chunks.push(Buffer.from(end));
  const out = Buffer.concat(chunks);
  writeFileSync(`${OUT_DIR}${track.id}.mp3`, out);
  console.log(`${track.id}.mp3  ${(buf.length / SR).toFixed(1)}s  ${(out.length / 1024).toFixed(0)} KB`);
}
