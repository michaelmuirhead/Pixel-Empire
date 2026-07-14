import React, { useState, useEffect, useRef } from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from "recharts";

/* ============================================================
   PIXEL EMPIRE — Game Studio Tycoon (iPad-first, turn-based)
   Aesthetic: 90s game-store shelf. Deep indigo carpet, plastic
   cartridge boxes, foil score stickers, arcade signage type.
   ============================================================ */

// ---------- STATIC DATA ----------

const GENRES = [
  { id: "action",     name: "Action",     w: { gameplay: 4, graphics: 3, story: 1, sound: 2 } },
  { id: "adventure",  name: "Adventure",  w: { gameplay: 2, graphics: 2, story: 4, sound: 2 } },
  { id: "rpg",        name: "RPG",        w: { gameplay: 3, graphics: 2, story: 4, sound: 1 } },
  { id: "strategy",   name: "Strategy",   w: { gameplay: 4, graphics: 1, story: 2, sound: 1 } },
  { id: "sim",        name: "Simulation", w: { gameplay: 4, graphics: 2, story: 1, sound: 1 } },
  { id: "puzzle",     name: "Puzzle",     w: { gameplay: 4, graphics: 1, story: 0, sound: 2 } },
  { id: "sports",     name: "Sports",     w: { gameplay: 4, graphics: 3, story: 0, sound: 1 } },
  { id: "racing",     name: "Racing",     w: { gameplay: 3, graphics: 4, story: 0, sound: 2 } },
  { id: "shooter",    name: "Shooter",    w: { gameplay: 4, graphics: 3, story: 1, sound: 2 } },
  { id: "platformer", name: "Platformer", w: { gameplay: 4, graphics: 2, story: 1, sound: 3 } },
];

// topic: unlock year, great genres, bad genres
const TOPICS = [
  // launch-year staples
  { id: "fantasy",   name: "Fantasy",          yr: 1984, great: ["rpg","adventure","strategy"],      bad: ["sports","racing"] },
  { id: "scifi",     name: "Sci-Fi",           yr: 1984, great: ["shooter","strategy","rpg"],        bad: ["sports"] },
  { id: "sport",     name: "Big League",       yr: 1984, great: ["sports","sim"],                    bad: ["rpg","adventure"] },
  { id: "war",       name: "War",              yr: 1984, great: ["strategy","shooter"],              bad: ["puzzle","sports"] },
  { id: "racingT",   name: "Motorsport",       yr: 1984, great: ["racing","sim"],                    bad: ["rpg","puzzle"] },
  { id: "space",     name: "Deep Space",       yr: 1984, great: ["shooter","sim","strategy"],        bad: ["sports"] },
  { id: "myth",      name: "Mythology",        yr: 1984, great: ["rpg","adventure","action"],        bad: ["sports"] },
  // the '80s
  { id: "detective", name: "Detective",        yr: 1985, great: ["adventure","puzzle"],              bad: ["racing","sports"] },
  { id: "spies",     name: "Espionage",        yr: 1985, great: ["action","shooter","adventure"],    bad: ["sim"] },
  { id: "martial",   name: "Martial Arts",     yr: 1985, great: ["action","platformer"],             bad: ["puzzle","sim"] },
  { id: "ninja",     name: "Ninjas",           yr: 1986, great: ["action","platformer"],             bad: ["sim","puzzle"] },
  { id: "mechs",     name: "Robots & Mechs",   yr: 1986, great: ["shooter","action","strategy"],     bad: ["sports"] },
  { id: "horror",    name: "Horror",           yr: 1987, great: ["adventure","shooter","action"],    bad: ["sports","puzzle"] },
  { id: "aviation",  name: "Aviation",         yr: 1987, great: ["sim","action"],                    bad: ["puzzle"] },
  { id: "pirates",   name: "Pirates",          yr: 1988, great: ["adventure","action","strategy"],   bad: ["sports"] },
  { id: "wrestling", name: "Pro Wrestling",    yr: 1988, great: ["sports","action"],                 bad: ["strategy","puzzle"] },
  { id: "city",      name: "City Builder",     yr: 1989, great: ["sim","strategy"],                  bad: ["shooter","platformer"] },
  { id: "invasion",  name: "Alien Invasion",   yr: 1989, great: ["shooter","strategy"],              bad: ["sports"] },
  // the '90s
  { id: "dino",      name: "Dinosaurs",        yr: 1990, great: ["action","adventure","platformer"], bad: ["strategy"] },
  { id: "dragons",   name: "Dragons",          yr: 1990, great: ["rpg","action","adventure"],        bad: ["sports"] },
  { id: "lostciv",   name: "Lost Civilizations", yr: 1991, great: ["adventure","puzzle"],            bad: ["racing"] },
  { id: "wildwest",  name: "Wild West",        yr: 1992, great: ["shooter","adventure"],             bad: ["puzzle"] },
  { id: "timetravel",name: "Time Travel",      yr: 1992, great: ["adventure","rpg","puzzle"],        bad: ["sports"] },
  { id: "medieval",  name: "Medieval Kingdoms", yr: 1993, great: ["strategy","rpg","sim"],           bad: ["racing"] },
  { id: "railways",  name: "Railways",         yr: 1993, great: ["sim","strategy"],                  bad: ["shooter"] },
  { id: "vampires",  name: "Vampires",         yr: 1993, great: ["action","rpg","adventure"],        bad: ["sports"] },
  { id: "kaiju",     name: "Giant Monsters",   yr: 1994, great: ["action","strategy"],               bad: ["puzzle","sports"] },
  { id: "fairytale", name: "Fairy Tales",      yr: 1994, great: ["adventure","platformer","rpg"],    bad: ["shooter"] },
  { id: "cyber",     name: "Cyberpunk",        yr: 1995, great: ["rpg","shooter","adventure"],       bad: ["sports"] },
  { id: "themepark", name: "Theme Park",       yr: 1995, great: ["sim","strategy"],                  bad: ["shooter"] },
  { id: "farm",      name: "Farm Life",        yr: 1996, great: ["sim","rpg"],                       bad: ["shooter","racing"] },
  { id: "samurai",   name: "Samurai",          yr: 1996, great: ["action","rpg","strategy"],         bad: ["puzzle"] },
  { id: "hospital",  name: "Hospital",         yr: 1997, great: ["sim"],                             bad: ["shooter","racing"] },
  { id: "superhero", name: "Superheroes",      yr: 1998, great: ["action","adventure"],              bad: ["sim","puzzle"] },
  { id: "rhythm",    name: "Music & Rhythm",   yr: 1998, great: ["action","puzzle"],                 bad: ["strategy"] },
  { id: "gladiator", name: "Gladiators",       yr: 1998, great: ["action","sports"],                 bad: ["puzzle"] },
  { id: "xtreme",    name: "Extreme Sports",   yr: 1999, great: ["sports","racing"],                 bad: ["strategy"] },
  // the 2000s
  { id: "pets",      name: "Pets",             yr: 2000, great: ["sim","puzzle"],                    bad: ["shooter"] },
  { id: "postapoc",  name: "Post-Apocalypse",  yr: 2002, great: ["rpg","shooter","adventure"],       bad: ["sports"] },
  { id: "zombie",    name: "Zombies",          yr: 2003, great: ["shooter","action","sim"],          bad: ["sports"] },
  { id: "heist",     name: "Heists",           yr: 2003, great: ["action","strategy","adventure"],   bad: ["platformer"] },
  { id: "cooking",   name: "Cooking",          yr: 2004, great: ["sim","puzzle"],                    bad: ["shooter","racing"] },
  { id: "underwater",name: "Underwater Worlds", yr: 2005, great: ["adventure","sim"],                bad: ["sports"] },
  { id: "steampunk", name: "Steampunk",        yr: 2006, great: ["adventure","rpg","strategy"],      bad: ["sports"] },
  { id: "norse",     name: "Norse Legends",    yr: 2008, great: ["action","rpg","strategy"],         bad: ["puzzle"] },
  // the 2010s and beyond
  { id: "candy",     name: "Candy Kingdom",    yr: 2010, great: ["puzzle","platformer"],             bad: ["shooter","strategy"] },
  { id: "survival",  name: "Survival Crafting", yr: 2011, great: ["sim","adventure","rpg"],          bad: ["sports","racing"] },
  { id: "intrigue",  name: "Court Intrigue",   yr: 2013, great: ["strategy","rpg","adventure"],      bad: ["racing"] },
  { id: "influencer",name: "Influencer Life",  yr: 2015, great: ["sim","puzzle"],                    bad: ["shooter"] },
  { id: "esports",   name: "Esports Drama",    yr: 2017, great: ["sports","sim","strategy"],         bad: ["platformer"] },
  { id: "battlearena",name: "Battle Arena",    yr: 2018, great: ["shooter","action"],                bad: ["puzzle","sim"] },
  { id: "eco",       name: "Eco Rebellion",    yr: 2020, great: ["sim","strategy","adventure"],      bad: ["racing"] },
];

const PLATFORMS = [
  { id: "pc",        name: "Home PC",           yr: 1984, end: 2100, share: 0.30, lic: 0,     tech: 1, holder: null,        blurb: "Always open, no license fee." },
  { id: "nes",       name: "NES",               yr: 1985, end: 1995, share: 0.50, lic: 2000,  tech: 1, holder: "Nintendo",  blurb: "The console that revived an industry." },
  { id: "sms",       name: "Master System",     yr: 1986, end: 1992, share: 0.25, lic: 1500,  tech: 1, holder: "Sega",      blurb: "Underdog at home, giant in Europe and Brazil." },
  { id: "gb",        name: "Game Boy",          yr: 1989, end: 2003, share: 0.40, lic: 2500,  tech: 1, holder: "Nintendo",  blurb: "Monochrome, indestructible, everywhere." },
  { id: "genesis",   name: "Sega Genesis",      yr: 1989, end: 1997, share: 0.45, lic: 4500,  tech: 2, holder: "Sega",      blurb: "Blast processing. Does what Nintendon't." },
  { id: "snes",      name: "Super Nintendo",    yr: 1991, end: 1998, share: 0.50, lic: 5000,  tech: 2, holder: "Nintendo",  blurb: "16-bit perfection, Mode 7 and all." },
  { id: "ps1",       name: "PlayStation",       yr: 1995, end: 2004, share: 0.55, lic: 9000,  tech: 3, holder: "Sony",      blurb: "CD-based 3D. The polygon era begins." },
  { id: "n64",       name: "Nintendo 64",       yr: 1996, end: 2002, share: 0.40, lic: 8000,  tech: 3, holder: "Nintendo",  blurb: "Cartridges, four controller ports, no load times." },
  { id: "dreamcast", name: "Dreamcast",         yr: 1999, end: 2002, share: 0.30, lic: 10000, tech: 4, holder: "Sega",      blurb: "Ahead of its time. Maybe too far ahead." },
  { id: "ps2",       name: "PlayStation 2",     yr: 2000, end: 2011, share: 0.60, lic: 14000, tech: 4, holder: "Sony",      blurb: "The best-selling console ever built." },
  { id: "gba",       name: "Game Boy Advance",  yr: 2001, end: 2008, share: 0.35, lic: 6000,  tech: 2, holder: "Nintendo",  blurb: "A SNES in your pocket." },
  { id: "xbox",      name: "Xbox",              yr: 2001, end: 2007, share: 0.35, lic: 13000, tech: 4, holder: "Microsoft", blurb: "A PC in a big black box. Online-first." },
  { id: "gamecube",  name: "GameCube",          yr: 2001, end: 2007, share: 0.35, lic: 12000, tech: 4, holder: "Nintendo",  blurb: "A lunchbox full of first-party magic." },
  { id: "ds",        name: "Nintendo DS",       yr: 2004, end: 2013, share: 0.50, lic: 9000,  tech: 3, holder: "Nintendo",  blurb: "Two screens, a stylus, and everyone's grandmother." },
  { id: "x360",      name: "Xbox 360",          yr: 2005, end: 2014, share: 0.50, lic: 18000, tech: 5, holder: "Microsoft", blurb: "Achievements, Live, and the HD era's head start." },
  { id: "ps3",       name: "PlayStation 3",     yr: 2006, end: 2015, share: 0.50, lic: 20000, tech: 5, holder: "Sony",      blurb: "1080p blockbusters and trophies." },
  { id: "wii",       name: "Wii",               yr: 2006, end: 2013, share: 0.50, lic: 12000, tech: 4, holder: "Nintendo",  blurb: "Motion controls bring in the whole family." },
  { id: "mobile",    name: "Smartphones",       yr: 2009, end: 2100, share: 0.60, lic: 500,   tech: 4, holder: null,        blurb: "Everyone owns one. Brutal discoverability." },
  { id: "ps4",       name: "PlayStation 4",     yr: 2013, end: 2020, share: 0.60, lic: 28000, tech: 6, holder: "Sony",      blurb: "4K-ish visuals, massive open worlds." },
  { id: "xbone",     name: "Xbox One",          yr: 2013, end: 2020, share: 0.45, lic: 26000, tech: 6, holder: "Microsoft", blurb: "It watched TV. Eventually it played games too." },
  { id: "switch",    name: "Nintendo Switch",   yr: 2017, end: 2100, share: 0.55, lic: 22000, tech: 6, holder: "Nintendo",  blurb: "Console at home, handheld on the go." },
  { id: "ps5",       name: "PlayStation 5",     yr: 2020, end: 2100, share: 0.60, lic: 40000, tech: 7, holder: "Sony",      blurb: "Instant loading, ray-traced everything." },
  { id: "xsx",       name: "Xbox Series X",     yr: 2020, end: 2100, share: 0.50, lic: 38000, tech: 7, holder: "Microsoft", blurb: "Game Pass and teraflops." },
];

// Old fictional-platform saves map onto the real timeline
const PLAT_MIGRATE = { vec8: "nes", pocket: "gb", mega: "genesis", nep32: "ps1", cubex: "ps2", wavii: "wii", nephd: "ps3", nep4k: "ps4", nomad: "switch", nep5: "ps5" };
const HOLDER_MIGRATE = { "Neptune": "Sony", "Cube Systems": "Nintendo", "Vectron Corp": "Nintendo", "MegaVision": "Sega" };

// ---------- PLATFORM LIFECYCLE & FORTUNE ----------
// Every console has a life: ramp (~2.5y), peak, then decline as its successor
// looms. And every run, the console war plays out differently.
function platFate(s, p) {
  return (s.platFate || {})[p.id] || { mult: 1, endShift: 0, verdict: "normal", revealed: true };
}
function platEnd(s, p) { return p.end + platFate(s, p).endShift; }
function platCurve(s, p, week) {
  const y = 1984 + week / 52;
  const age = y - p.yr;
  const life = platEnd(s, p) - p.yr;
  if (age < 0 || age > life) return 0;
  const declineStart = Math.max(2.5, life - 3);
  if (age < 2.5) return 0.35 + 0.65 * (age / 2.5);
  if (age < declineStart) return 1;
  const t = (age - declineStart) / Math.max(0.5, life - declineStart);
  return Math.max(0.12, 1 - 0.88 * t);
}
function platShareNow(s, p, week) {
  return p.share * platCurve(s, p, week) * platFate(s, p).mult;
}
function platPhase(s, p, week) {
  const age = 1984 + week / 52 - p.yr;
  const life = platEnd(s, p) - p.yr;
  if (age < 2.5) return "Rising";
  if (age < Math.max(2.5, life - 3)) return "Peak";
  return "Fading";
}
// Dev kits get cheap on a dying platform; holder loyalty knocks more off
function effLicense(s, p, week) {
  const c = platCurve(s, p, week);
  const rel = p.holder ? ((s.holders || {})[p.holder]?.rel ?? 50) : 50;
  return Math.round(p.lic * (c >= 0.9 ? 1 : c >= 0.5 ? 0.85 : 0.6) * (1 - Math.max(0, rel - 50) / 200));
}

const SIZES = [
  { id: "S", name: "Small",  weeks: 8,  minWeeks: 6,  cost: 300,  points: 16, mult: 1.0, minStaff: 1 },
  { id: "M", name: "Medium", weeks: 14, minWeeks: 10, cost: 700,  points: 20, mult: 1.9, minStaff: 3, techReq: 2 },
  { id: "L", name: "Large",  weeks: 22, minWeeks: 14, cost: 1400, points: 24, mult: 3.2, minStaff: 5, techReq: 4 },
];

// Bigger hardware = bigger games: total work scales with platform tech tier
const workScale = platTech => 1 + (platTech - 1) * 0.35;

const PRICE_TIERS = [
  { id: "budget",  name: "Budget",   rev: 0.85, fans: 1.35, blurb: "Impulse pricing — thin margins, big audience" },
  { id: "std",     name: "Standard", rev: 1.0,  fans: 1.0,  blurb: "The safe middle of the shelf" },
  { id: "premium", name: "Premium",  rev: 1.25, fans: 0.8,  blurb: "Big-box pricing — backfires below a 70 score" },
];

const TECH_TREE = [
  // Development
  { id: "agile",    cat: "Development", name: "Agile Workflow",   cost: 60, effect: "Projects finish ~15% faster" },
  { id: "devtools", cat: "Development", name: "Dev Tools Suite",  cost: 55, effect: "+10% team output on everything — projects and contracts" },
  { id: "writers",  cat: "Development", name: "Writers' Room",    cost: 45, effect: "+3 to Story on every project" },
  { id: "playtest", cat: "Development", name: "Playtest Lab",     cost: 50, effect: "+3 to Gameplay on every project" },
  // Quality
  { id: "qa",       cat: "Quality", name: "QA Department",   cost: 40,  effect: "Bugs accumulate 40% slower" },
  { id: "autotest", cat: "Quality", name: "Automated QA",    cost: 80,  req: "qa", effect: "Polish squashes bugs 50% faster" },
  { id: "focus",    cat: "Quality", name: "Focus Testing",   cost: 65,  effect: "See a predicted review band before you release" },
  { id: "patching", cat: "Quality", name: "Online Patching", cost: 100, yr: 2000, effect: "Shipping with bugs stings critics half as much" },
  // Marketing & Community
  { id: "mktdpt",  cat: "Marketing & Community", name: "Marketing Department", cost: 50,  effect: "Marketing pushes are 50% more effective" },
  { id: "pr",      cat: "Marketing & Community", name: "PR Agency",            cost: 70,  req: "mktdpt", effect: "Hype no longer decays during polish" },
  { id: "fanclub", cat: "Marketing & Community", name: "Official Fan Club",    cost: 55,  effect: "+50% fan gain from releases" },
  { id: "community", cat: "Marketing & Community", name: "Community Team",     cost: 75,  req: "fanclub", effect: "Fans grow a little every week, even between games" },
  { id: "mktres",  cat: "Marketing & Community", name: "Market Research",      cost: 85,  effect: "Trend-matching releases get +65% sales instead of +45%" },
  // Business
  { id: "mocap",     cat: "Business", name: "Sound Studio",       cost: 45,  effect: "+3 to Sound on every project" },
  { id: "artlab",    cat: "Business", name: "Art Lab",            cost: 45,  effect: "+3 to Graphics on every project" },
  { id: "talent",    cat: "Business", name: "Talent Network",     cost: 60,  effect: "Job ads, headhunters, and poaching cost 30% less" },
  { id: "merch",     cat: "Business", name: "Merchandising",      cost: 90,  effect: "Weekly income from your fanbase — plushies sell themselves" },
  { id: "iplaw",     cat: "Business", name: "IP Law Team",        cost: 95,  effect: "Sell IP with no broker fee; buy IP 5% cheaper" },
  { id: "storefront",cat: "Business", name: "Digital Storefront", cost: 140, yr: 2004, effect: "+15% sales on every release" },
  { id: "dlc",       cat: "Business", name: "DLC Pipeline",       cost: 120, yr: 2006, effect: "Released games keep selling 25% longer" },
];
const TECH_CATS = ["Development", "Quality", "Marketing & Community", "Business"];

// ---------- ENGINE TECHNOLOGY ----------
// Individual technologies are researched with RP, then built into engines.
// An engine's power = the best tech per category, summed — breadth matters.
const ENGINE_TECHS = [
  // Graphics
  { id: "gfx1", cat: "Graphics", name: "Sprite Renderer",     cost: 20,  yr: 1984, power: 4 },
  { id: "gfx2", cat: "Graphics", name: "Parallax Scrolling",  cost: 35,  yr: 1987, power: 7,  req: "gfx1" },
  { id: "gfx3", cat: "Graphics", name: "Polygon Renderer",    cost: 60,  yr: 1993, power: 12, req: "gfx2" },
  { id: "gfx4", cat: "Graphics", name: "Texture Mapping",     cost: 80,  yr: 1996, power: 16, req: "gfx3" },
  { id: "gfx5", cat: "Graphics", name: "Shader Pipeline",     cost: 120, yr: 2001, power: 22, req: "gfx4" },
  { id: "gfx6", cat: "Graphics", name: "HD Rendering",        cost: 160, yr: 2006, power: 28, req: "gfx5" },
  { id: "gfx7", cat: "Graphics", name: "Physically-Based Rendering", cost: 220, yr: 2013, power: 34, req: "gfx6" },
  { id: "gfx8", cat: "Graphics", name: "Ray Tracing",         cost: 300, yr: 2019, power: 42, req: "gfx7" },
  // Sound
  { id: "snd1", cat: "Sound", name: "Chiptune Synth",   cost: 15,  yr: 1984, power: 3 },
  { id: "snd2", cat: "Sound", name: "Sample Playback",  cost: 30,  yr: 1989, power: 6,  req: "snd1" },
  { id: "snd3", cat: "Sound", name: "CD Audio",         cost: 50,  yr: 1994, power: 10, req: "snd2" },
  { id: "snd4", cat: "Sound", name: "Surround Mix",     cost: 90,  yr: 2001, power: 15, req: "snd3" },
  { id: "snd5", cat: "Sound", name: "Adaptive Audio",   cost: 140, yr: 2010, power: 20, req: "snd4" },
  // Physics
  { id: "phy1", cat: "Physics", name: "Collision Grid",     cost: 20,  yr: 1985, power: 3 },
  { id: "phy2", cat: "Physics", name: "Rigid Body Physics", cost: 70,  yr: 1997, power: 10, req: "phy1" },
  { id: "phy3", cat: "Physics", name: "Ragdoll & Cloth",    cost: 120, yr: 2004, power: 16, req: "phy2" },
  { id: "phy4", cat: "Physics", name: "Destruction Sim",    cost: 180, yr: 2012, power: 22, req: "phy3" },
  // AI
  { id: "ai1", cat: "AI", name: "Pattern Scripts",       cost: 15,  yr: 1984, power: 3 },
  { id: "ai2", cat: "AI", name: "Pathfinding",           cost: 50,  yr: 1992, power: 8,  req: "ai1" },
  { id: "ai3", cat: "AI", name: "Behavior Trees",        cost: 110, yr: 2003, power: 14, req: "ai2" },
  { id: "ai4", cat: "AI", name: "Machine Learning NPCs", cost: 200, yr: 2016, power: 20, req: "ai3" },
  // Online
  { id: "net1", cat: "Online", name: "Local Multiplayer",   cost: 20,  yr: 1986, power: 3 },
  { id: "net2", cat: "Online", name: "LAN Play",            cost: 60,  yr: 1995, power: 8,  req: "net1" },
  { id: "net3", cat: "Online", name: "Online Matchmaking",  cost: 110, yr: 2002, power: 14, req: "net2" },
  { id: "net4", cat: "Online", name: "Cloud Services",      cost: 180, yr: 2014, power: 20, req: "net3" },
  // Tools
  { id: "tool1", cat: "Tools", name: "Level Editor",       cost: 30,  yr: 1988, power: 5 },
  { id: "tool2", cat: "Tools", name: "Scripting Language", cost: 60,  yr: 1994, power: 9,  req: "tool1" },
  { id: "tool3", cat: "Tools", name: "Visual Workflow",    cost: 110, yr: 2005, power: 14, req: "tool2" },
];
const ENGINE_CATS = ["Graphics", "Sound", "Physics", "AI", "Online", "Tools"];

function enginePowerFromParts(parts) {
  let total = 0;
  for (const cat of ENGINE_CATS) {
    let best = 0;
    for (const t of ENGINE_TECHS) {
      if (t.cat === cat && parts.includes(t.id)) best = Math.max(best, t.power);
    }
    total += best;
  }
  return total;
}

// What a competitive engine looks like in a given year
const eraPower = year => 8 + (year - 1984) * 3;

// proj.engine is an id string: own engine id, "lic:<id>" for a licensed one, or null
function resolveEngine(state, ref) {
  if (!ref) return null;
  if (ref.startsWith("lic:")) {
    const l = (state.licensedEngines || []).find(e => "lic:" + e.id === ref);
    return l ? { name: `${l.name} (licensed)`, power: l.power, perGame: l.perGame } : null;
  }
  const e = (state.engines || []).find(e => e.id === ref);
  return e ? { name: `${e.name} v${e.version}`, power: enginePowerFromParts(e.parts) } : null;
}

const OFFICES = [
  { name: "Garage",        cap: 3,  rent: 100,  cost: 0 },
  { name: "Strip-Mall Office", cap: 6,  rent: 400,  cost: 25000 },
  { name: "Downtown Studio",   cap: 10, rent: 1200, cost: 120000 },
  { name: "Campus HQ",         cap: 16, rent: 3500, cost: 600000 },
];

const FIRST = ["Alex","Sam","Jordan","Casey","Riley","Devon","Morgan","Quinn","Harper","Reese","Toni","Marco","Lena","Priya","Kofi","Ivy","Hank","Nadia","Owen","Tessa","Felix","Gwen","Ruben","Sadie","Miles","June","Cole","Dara","Ezra","Faye"];
const LAST = ["Nakamura","Ortiz","Fletcher","Kowalski","Bishop","Vance","Okafor","Delgado","Marsh","Ito","Reyes","Calloway","Strand","Boone","Havel","Muir","Pettit","Lang","Soto","Whitaker","Croft","Ames","Vega","Holt","Ferris"];
const ROLES = ["Programmer","Designer","Artist","Composer","All-Rounder"];

// Staff traits — roughly half of hires have one
const TRAITS = {
  prodigy:      { name: "Prodigy",      desc: "+50% XP gain" },
  nightowl:     { name: "Night Owl",    desc: "+10% output" },
  perfectionist:{ name: "Perfectionist",desc: "+1 review quality, −10% output" },
  crunchproof:  { name: "Crunch-proof", desc: "Loses energy half as fast" },
  mentor:       { name: "Mentor",       desc: "Whole team gains +20% XP" },
  bugmagnet:    { name: "Bug Magnet",   desc: "Projects accrue 10% more bugs" },
  fragile:      { name: "Fragile",      desc: "Loses energy 50% faster" },
};

// Adding devs to one project has diminishing returns — the 2nd pair of hands
// is worth less than the 1st, coordination eats the 8th. Two lean teams
// out-produce one bloated one.
function effTeamOutput(staff, team, dtMult) {
  const outs = staff
    .filter(m => (m.team || "A") === team)
    .map(m => memberOutput(m))
    .sort((a, b) => b - a);
  let total = 0;
  outs.forEach((o, i) => { total += o * Math.max(0.35, 1 - i * 0.12); });
  return total * dtMult;
}

function memberOutput(m) {
  if (m.resting) return 0;
  let out = (m.code + m.design + m.art + m.sound) / 14;
  if ((m.energy ?? 100) < 20) out *= 0.5; // burned out
  if (m.trait === "nightowl") out *= 1.1;
  if (m.trait === "perfectionist") out *= 0.9;
  return out;
}

const REVIEWERS = ["Joystick Weekly","GamePro Gazette","The Pixel Post","Cartridge Monthly"];

// Studio archetypes drive simulation behavior:
// skill = starting range · cadence = weeks between releases · ipUse = chance a
// release is an IP entry vs. original · list = 1/list weekly chance to sell an
// IP · bust = weekly bankruptcy chance once a decline sets in
const ARCHETYPES = {
  blockbuster: { label: "Blockbuster factory",      skill: [52, 70], cadence: [24, 44], ipUse: 0.70, list: 60,  bust: 1 / 110 },
  boutique:    { label: "Boutique auteur",          skill: [58, 76], cadence: [40, 70], ipUse: 0.35, list: 90,  bust: 1 / 100 },
  mill:        { label: "Budget mill",              skill: [30, 48], cadence: [10, 20], ipUse: 0.30, list: 30,  bust: 1 / 70 },
  annualizer:  { label: "Annual franchise machine", skill: [48, 64], cadence: [26, 34], ipUse: 0.90, list: 80,  bust: 1 / 120 },
  casualGiant: { label: "Casual & mobile giant",    skill: [44, 62], cadence: [14, 26], ipUse: 0.50, list: 55,  bust: 1 / 140 },
  indie:       { label: "Indie darling",            skill: [55, 78], cadence: [50, 90], ipUse: 0.25, list: 120, bust: 1 / 80 },
  liveService: { label: "Live-service titan",       skill: [50, 68], cadence: [30, 55], ipUse: 0.92, list: 150, bust: 1 / 130 },
  tech:        { label: "Tech pioneer",             skill: [50, 72], cadence: [30, 55], ipUse: 0.45, list: 70,  bust: 1 / 95 },
};

// The industry roster, era by era.
const RIVAL_SEED = [
  // 8-bit pioneers
  { name: "Titan Softworks",         founded: 1984, arch: "blockbuster", genres: ["action","shooter"],      blurb: "The big-box juggernaut. Loud, polished, everywhere." },
  { name: "Aurora Games",            founded: 1984, arch: "casualGiant", genres: ["platformer","puzzle"],   blurb: "Bright, friendly hits the whole family plays." },
  { name: "Redline Studios",         founded: 1984, arch: "annualizer",  genres: ["racing","sports"],       blurb: "A new number on the box every single year." },
  { name: "Pixelheart Workshop",     founded: 1984, arch: "boutique",    genres: ["adventure","rpg"],       blurb: "Small team, long silences, unforgettable games." },
  // late '80s
  { name: "Bitforge",                founded: 1986, arch: "tech",        genres: ["sim","strategy"],        blurb: "Engineers first, artists second. Engines for days." },
  { name: "Kudzu Interactive",       founded: 1987, arch: "mill",        genres: ["action","puzzle"],       blurb: "Quantity has a quality all its own. Allegedly." },
  { name: "Shogun Circuit",          founded: 1988, arch: "blockbuster", genres: ["action","platformer"],   blurb: "Arcade DNA, razor-sharp action imports." },
  // 16-bit / CD era
  { name: "Golden Gate Interactive", founded: 1991, arch: "boutique",    genres: ["adventure"],             blurb: "Cinematic storytellers of the CD-ROM age." },
  { name: "Ironclad Studios",        founded: 1992, arch: "tech",        genres: ["strategy","shooter"],    blurb: "War games with spreadsheets underneath." },
  { name: "Velvet Owl Games",        founded: 1994, arch: "boutique",    genres: ["rpg","adventure"],       blurb: "Hundred-hour epics with a literary streak." },
  // 3D era
  { name: "Nova Play",               founded: 1996, arch: "blockbuster", genres: ["platformer","racing"],   blurb: "Mascots, polygons, and pure momentum." },
  { name: "Blackwater Forge",        founded: 1999, arch: "blockbuster", genres: ["shooter","action"],      blurb: "Gritty, loud, and relentlessly commercial." },
  // HD / casual era
  { name: "Hexagon Entertainment",   founded: 2003, arch: "annualizer",  genres: ["sports","sim"],          blurb: "The roster update, monetized to perfection." },
  { name: "Petal Pop Games",         founded: 2007, arch: "casualGiant", genres: ["puzzle","sim"],          blurb: "A billion downloads and counting." },
  // indie / live-service era
  { name: "Foxfire Collective",      founded: 2011, arch: "indie",       genres: ["adventure","platformer"],blurb: "Twelve people, one game at a time, all heart." },
  { name: "Colossus Interactive",    founded: 2016, arch: "liveService", genres: ["shooter","rpg"],         blurb: "One game, forever. The season pass never ends." },
  // Expansion roster: a denser industry, era by era
  { name: "Vertigo Arcade",          founded: 1984, arch: "mill",        genres: ["action","shooter"],      blurb: "Coin-op ports by the crate. Quantity ships." },
  { name: "Homestead Software",      founded: 1984, arch: "tech",        genres: ["sim","strategy"],        blurb: "Garage engineers with spreadsheets and big ideas." },
  { name: "Silverline Studios",      founded: 1984, arch: "boutique",    genres: ["puzzle","adventure"],    blurb: "Quiet games with cult followings." },
  { name: "Bandit Games",            founded: 1984, arch: "mill",        genres: ["platformer","action"],   blurb: "Fast, cheap, occasionally brilliant." },
  { name: "Osaka Star Works",        founded: 1987, arch: "blockbuster", genres: ["platformer","shooter"],  blurb: "Import hits with impossible polish." },
  { name: "Crown & Castle",          founded: 1989, arch: "boutique",    genres: ["strategy","rpg"],        blurb: "Tabletop pedigree, digital ambitions." },
  { name: "Vortex Digital",          founded: 1993, arch: "tech",        genres: ["shooter","racing"],      blurb: "3D or die." },
  { name: "Meadowbrook Interactive", founded: 1995, arch: "casualGiant", genres: ["sim","puzzle"],          blurb: "Games your mom plays. Millions of moms." },
  { name: "Apex Horizon",            founded: 2004, arch: "blockbuster", genres: ["shooter","action"],      blurb: "Trailer-first development, and it works." },
  { name: "Lighthouse Nine",         founded: 2013, arch: "indie",       genres: ["adventure","puzzle"],    blurb: "Nine friends, one mortgage, all in." },
];
const LATE_RIVAL_NAMES = ["Cobalt Arcade","Wildline Games","Meteor Forge","Ninefold Studios","Paper Lantern Games","Quasar Digital","Driftwood Softworks","Emberline Studios","Copperhead Games","Solstice Works","Grim Harbor","Pixel Foundry","Ninth Wave Studios","Cinder Block Games","Halcyon Loop","Bright Cellar","Ironwood Digital","Static Horizon","Velvetine Games","Marrow & Bone"];
const QUOTES = {
  hi:  ["An instant classic.","We lost a whole weekend to this.","Sets a new bar for the genre.","Buy it. Today.","Pure magic on a cartridge."],
  mid: ["Solid, if unspectacular.","Fans of the genre will find plenty to like.","Good bones, rough edges.","A respectable effort.","Worth a rental first."],
  lo:  ["Buggy and bland.","We wanted to like this one.","Skip it.","A swing and a miss.","Back to the drawing board."],
};

const NAME_A = ["Shadow","Crystal","Turbo","Mega","Iron","Neon","Star","Blaze","Frost","Royal","Rogue","Echo","Storm","Ember","Lunar"];
const NAME_B = ["Quest","Raiders","Kingdom","Circuit","Legends","Command","Odyssey","Saga","Strike","Frontier","Vault","Chronicles","Rally","Dominion","Drift"];

const EVENTS = [
  { text: "A journalist wants an exclusive studio tour.", a: { label: "Welcome them in", fx: s => ({ ...s, fans: s.fans + 150 + Math.floor(s.fans * 0.05), log: pushLog(s, "The tour article ran — new fans found you.") }) }, b: { label: "Too busy — decline", fx: s => ({ ...s, log: pushLog(s, "You declined the studio tour. Heads stayed down.") }) } },
  { cond: s => (s.engines || []).length > 0, text: "A rival studio offers to buy a source license for your engine tech — quick cash, but they'll close the gap.", a: { label: "Sell ($8,000)", fx: s => ({ ...s, money: s.money + 8000, rp: Math.max(0, s.rp - 15), log: pushLog(s, "Sold an engine source license. Cash in, research momentum out.") }) }, b: { label: "Keep it in-house", fx: s => ({ ...s, rp: s.rp + 8, log: pushLog(s, "You kept your tech. The team doubled down on R&D.") }) } },
  { text: "The team asks for a pizza-and-crunch weekend to push the project.", a: { label: "Order the pizzas ($400)", fx: s => ({ ...s, money: s.money - 400, project: s.project ? { ...s.project, progress: s.project.progress + 1.5 } : null, log: pushLog(s, "Crunch weekend! Progress surged. Try not to make it a habit.") }) }, b: { label: "Protect the weekend", fx: s => ({ ...s, morale: Math.min(100, (s.morale ?? 80) + 5), log: pushLog(s, "The team rested. Morale is up.") }) } },
  { text: "A trade show invites you to demo on the floor.", a: { label: "Attend ($2,500)", fx: s => ({ ...s, money: s.money - 2500, project: s.project ? { ...s.project, hype: (s.project.hype || 0) + 25 } : s.project, fans: s.fans + 100, log: pushLog(s, "The demo booth drew a crowd. Hype is building.") }) }, b: { label: "Skip this year", fx: s => ({ ...s, log: pushLog(s, "You skipped the trade show.") }) } },
  { text: "A publisher offers a small contract gig between projects.", a: { label: "Take the gig", fx: s => ({ ...s, money: s.money + 3500, log: pushLog(s, "Contract work paid $3,500. Not glamorous, but it pays rent.") }) }, b: { label: "Stay focused", fx: s => ({ ...s, rp: s.rp + 5, log: pushLog(s, "You passed on the gig and prototyped instead. +5 RP.") }) } },
];

// ---------- HELPERS ----------

const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const money$ = n => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString();
const yearOf = wk => 1984 + Math.floor(wk / 52);
const weekOf = wk => (wk % 52) + 1;

function pushLog(s, msg) {
  return [{ wk: s.week, msg }, ...s.log].slice(0, 40);
}

function makeCandidate(year) {
  const role = pick(ROLES);
  const base = Math.min(9, 2 + Math.floor((year - 1984) / 8));
  const stat = bias => Math.max(1, Math.min(10, ri(base - 1, base + 2) + bias));
  const c = {
    id: Math.random().toString(36).slice(2),
    name: pick(FIRST) + " " + pick(LAST),
    role,
    code:   stat(role === "Programmer" ? 3 : role === "All-Rounder" ? 1 : 0),
    design: stat(role === "Designer"   ? 3 : role === "All-Rounder" ? 1 : 0),
    art:    stat(role === "Artist"     ? 3 : role === "All-Rounder" ? 1 : 0),
    sound:  stat(role === "Composer"   ? 3 : role === "All-Rounder" ? 1 : 0),
  };
  c.salary = 80 + (c.code + c.design + c.art + c.sound) * 22;
  c.xp = 0; c.level = 1; c.energy = 100; c.resting = false;
  c.trait = Math.random() < 0.5 ? pick(Object.keys(TRAITS)) : null;
  return c;
}

function freshState(studioName, founder) {
  const s = {
    screen: "game", tab: "studio",
    studioName,
    week: 0, money: 20000, fans: 0, rp: 0, morale: 80, rep: 50,
    office: 0,
    staff: [{ id: "founder", name: founder, role: "Founder", code: 4, design: 4, art: 3, sound: 3, salary: 0, xp: 0, level: 1, energy: 100, resting: false, trait: "mentor", team: "A" }],
    leadId: "founder",
    bidWar: null,
    loan: null, loanUsed: false, bankOffer: null,
    acqTalks: null, acqWar: null, buyoutOffer: null, soldOut: null,
    publishers: Object.fromEntries(PUBLISHERS.map(p => [p, { rel: 50 }])),
    pubIps: [],          // your franchises a publisher kept the rights to
    pitches: [],         // indie pitch board (once you're a label)
    nextPitchWeek: 0,
    pubProjects: [],     // indie games you've funded, in flight
    candidates: [],
    project: null,
    projectB: null,
    yearStats: { revenue: 0, lastRevenue: 0, fansStart: 0, repStart: 50, topRival: null },
    yearReview: null,
    released: [],
    ips: {},        // IP you own
    market: [],     // IP currently for sale
    rivals: seedRivals(0),
    rivalReleases: [], // rival games this year — awards competition
    awards: [],     // trophy cabinet
    history: [],    // periodic money/fans snapshots for analytics
    contracts: { offers: [], active: null },
    trend: null,               // { type: 'topic'|'genre', id, endWeek }
    nextTrendWeek: ri(10, 30), // when the first trend ignites
    platFate: {},              // per-run console-war fortunes
    realPlatforms: true,
    holders: {},               // platform holder relationships
    satGenre: {},              // rolling market saturation per genre
    satTopic: {},              // ...and per topic
    engineTechs: [],           // researched engine technologies
    engines: [],               // engines you've built
    licensedEngines: [],       // rival engines you're licensing
    engineMarket: [],          // rival engines available to license
    convention: null, // pending PixelCon decision
    awardsShow: null, // pending awards-night results modal
    tech: [],
    log: [],
    event: null,
    gameCount: 0,
    bestScore: 0,
  };
  s.log = [{ wk: 0, msg: `${studioName} founded in a garage. January 1984. $20,000 in the bank.` }];
  s.candidates = [makeCandidate(1984), makeCandidate(1984)]; // old colleagues who followed you
  s.contracts.offers = [makeContract(1984, []), makeContract(1984, [])];
  return s;
}

function topicById(id) { return TOPICS.find(t => t.id === id); }
function genreById(id) { return GENRES.find(g => g.id === id); }
function platById(id)  { return PLATFORMS.find(p => p.id === id); }

function matchBonus(genreId, topicId) {
  const t = topicById(topicId);
  if (!t) return 0;
  if (t.great.includes(genreId)) return 8;
  if (t.bad.includes(genreId)) return -10;
  return 0;
}

// ---------- SCORING ----------

function computeScore(state, proj) {
  const g = genreById(proj.genre);
  const plat = platById(proj.platform);
  const projTeam = proj.team || "A";
  const team = state.staff.filter(m => !m.resting && (m.team || "A") === projTeam);
  const roster = team.length ? team : state.staff.filter(m => (m.team || "A") === projTeam);
  const finalRoster = roster.length ? roster : state.staff;
  const avg = k => finalRoster.reduce((a, m) => a + m[k], 0) / finalRoster.length;
  const lead = state.staff.find(m => m.id === state.leadId && !m.resting && (m.team || "A") === projTeam);
  // The lead's hands are on everything: their skills weight the blend 30%
  const blend = k => lead ? avg(k) * 0.7 + lead[k] * 0.3 : avg(k);

  const skills = { gameplay: (blend("design") + blend("code")) / 2, graphics: blend("art"), story: blend("design"), sound: blend("sound") };
  if (state.tech.includes("mocap")) skills.sound += 3;
  if (state.tech.includes("artlab")) skills.graphics += 3;
  if (state.tech.includes("writers")) skills.story += 3;
  if (state.tech.includes("playtest")) skills.gameplay += 3;

  // How well allocation matches genre weights (0–1)
  const totalW = Object.values(g.w).reduce((a, b) => a + b, 0);
  let fit = 0, exec = 0;
  for (const k of ["gameplay", "graphics", "story", "sound"]) {
    const ideal = g.w[k] / totalW;
    const actual = proj.alloc[k] / proj.points;
    fit += 1 - Math.min(1, Math.abs(ideal - actual) * 2.2);
    exec += (proj.alloc[k] / proj.points) * skills[k];
  }
  fit /= 4;                       // 0–1
  exec = exec * 8;                // roughly 0–80 with elite team

  let engineQ = 0;
  const eng = resolveEngine(state, proj.engine);
  if (eng) {
    // Diminishing returns: power past the era benchmark earns 40% credit —
    // an over-built engine can't carry a game on its own
    const era = eraPower(yearOf(state.week));
    const effPower = eng.power <= era ? eng.power : era + (eng.power - era) * 0.4;
    engineQ = Math.round(effPower * 0.35);
  }

  const techGap = Math.max(0, plat.tech * 8 - (10 + engineQ)); // punished for weak engine on strong hardware
  const bugPen = Math.min(30, proj.bugs * 1.4) * (state.tech.includes("patching") ? 0.5 : 1);
  const size = SIZES.find(z => z.id === proj.size);

  let raw = 18 + exec * 0.55 + fit * 22 + engineQ * 0.7 + matchBonus(proj.genre, proj.topic) - techGap * 0.6 - bugPen + rnd(-4, 6);
  raw -= Math.min(6, (yearOf(state.week) - 1984) * 0.1); // standards rise as the medium matures
  raw += Math.min(3, state.staff.filter(m => m.trait === "perfectionist" && !m.resting && (m.team || "A") === projTeam).length); // perfectionists sweat the details
  raw *= (0.9 + 0.1 * (state.morale / 80));
  if (size.id === "L") raw += 3;
  raw += proj.vision || 0; // a strong pre-production pays off at review time
  if (proj.remakeOf) {
    raw += proj.remakeOf.mode === "remaster" ? 0 : 2;            // remakes build on a proven design
    if (proj.remakeOf.mode === "remaster") raw = Math.min(raw, proj.remakeOf.score + 6); // a facelift can't transcend the original
  }

  // IP entries: the team knows this world (+), but critics expect innovation
  // and audiences tire of back-to-back entries (−).
  if (proj.ip) {
    raw += 4;                                    // familiarity with the IP
    raw -= proj.ip.fatigue / 8;                  // IP fatigue
    raw -= Math.min(6, (proj.ip.entryNo - 2) * 1.5); // innovation drag grows per entry
  }
  return Math.max(5, Math.min(98, Math.round(raw)));
}

function launchSales(state, proj, score) {
  const plat = platById(proj.platform);
  const size = SIZES.find(z => z.id === proj.size);
  const hype = proj.hype || 0;
  let base =
    Math.pow(score / 10, 2.6) * 90 * size.mult * Math.max(0.06, platShareNow(state, plat, state.week)) *
    (1 + Math.min(2.5, state.fans / 4000)) * (1 + hype / 100);
  if (proj.ip) {
    base *= (1 + Math.min(2, proj.ip.fans / 2500));    // the IP faithful buy day one
    base *= (1 - Math.min(0.4, proj.ip.fatigue / 250)); // fatigue caps the ceiling
  }
  const priceTier = PRICE_TIERS.find(t => t.id === (proj.price || "std")) || PRICE_TIERS[1];
  base *= priceTier.id === "premium" && score < 70 ? 0.85 : priceTier.rev; // premium flops get shredded in the value reviews
  const trendy = matchesTrend(state.trend, proj.genre, proj.topic);
  if (trendy) base *= state.tech.includes("mktres") ? 1.65 : 1.45; // right game, right moment
  if (state.tech.includes("storefront")) base *= 1.15;
  const mkt = marketFactor(state, proj.genre, proj.topic); // crowded shelves split the money
  base *= mkt;
  if (proj.exclusive) base *= 1.25; // the platform holder's marketing machine
  const baseWeeks = score >= 80 ? 20 : score >= 60 ? 14 : 8;
  return {
    weeklyBase: base,
    trendy,
    mkt,
    weeksLeft: Math.round(baseWeeks * (state.tech.includes("dlc") ? 1.25 : 1)),
  };
}

// ---------- SAVE / LOAD ----------

const SAVE_KEY = "pixel-empire-save-v1";
async function saveGame(state) {
  try { await window.storage.set(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
}
async function loadGame() {
  try {
    const r = await window.storage.get(SAVE_KEY);
    if (!r) return null;
    const s = JSON.parse(r.value);
    // --- migrations ---
    if (!s.ips) s.ips = {};
    if (!s.market) s.market = [];
    if (!s.awards) s.awards = [];               // trophy cabinet
    if (!s.rivalReleases) s.rivalReleases = [];
    if (!s.history) s.history = [];
    if (!s.contracts) s.contracts = { offers: [], active: null };
    if (s.trend === undefined) { s.trend = null; s.nextTrendWeek = s.week + ri(4, 16); }
    if (s.rep === undefined) s.rep = Math.min(75, 50 + (s.awards?.length || 0) * 3);
    if (!s.engineTechs) {                       // migrate v2–v6 engine perks → real engine system
      s.engineTechs = []; s.engines = []; s.licensedEngines = []; s.engineMarket = [];
      const owned = ["eng2","eng3","eng4","eng5","eng6"].filter(id => (s.tech || []).includes(id));
      if (owned.length) {
        const grant = { eng2: ["gfx1","snd1"], eng3: ["phy1","ai1"], eng4: ["gfx2","tool1"], eng5: ["gfx3","snd2"], eng6: ["gfx4","phy2","net1","net2"] };
        const parts = new Set();
        for (const id of owned) for (const p of grant[id]) parts.add(p);
        s.engineTechs = [...parts];
        s.engines = [{ id: "legacy", name: "Legacy Engine", version: owned.length, parts: [...parts], builtWeek: s.week, licensed: false, licensees: 0 }];
        s.tech = s.tech.filter(t => !["eng2","eng3","eng4","eng5","eng6"].includes(t));
        s.log = pushLog(s, "🔧 Your engine research has been consolidated into the Legacy Engine. Visit R&D to research parts, update it, or license it out.");
      }
      if (s.project && s.project.engine === undefined) s.project.engine = s.engines[0]?.id || null;
    }
    if (s.bidWar === undefined) s.bidWar = null;
    if (s.loan === undefined) { s.loan = null; s.loanUsed = false; s.bankOffer = null; }
    if (s.acqTalks === undefined) { s.acqTalks = null; s.acqWar = null; s.buyoutOffer = null; s.soldOut = null; }
    if (!s.satGenre) { s.satGenre = {}; s.satTopic = {}; }
    if (!s.platFate) {
      s.platFate = {};
      // Platforms already on the market in an old save keep the script
      for (const p of PLATFORMS) if (yearOf(s.week) >= p.yr) s.platFate[p.id] = { mult: 1, endShift: 0, verdict: "normal", revealed: true };
      s.holders = {};
    }
    if (!s.realPlatforms) {
      // Convert fictional-hardware saves to the real timeline
      const mapId = id => PLAT_MIGRATE[id] || id;
      const mapHolder = h => HOLDER_MIGRATE[h] || h;
      for (const k of ["project", "projectB"]) {
        if (s[k]) s[k] = { ...s[k], platform: mapId(s[k].platform) };
      }
      s.released = (s.released || []).map(g => ({
        ...g,
        platform: mapId(g.platform),
        portedTo: (g.portedTo || []).map(mapId),
        exclusive: typeof g.exclusive === "string" ? mapHolder(g.exclusive) : g.exclusive,
      }));
      const holders = {};
      for (const [h, v] of Object.entries(s.holders || {})) {
        const nh = mapHolder(h);
        holders[nh] = { rel: Math.max(holders[nh]?.rel ?? 0, v.rel) };
      }
      s.holders = holders;
      const fate = {};
      for (const p of PLATFORMS) {
        const oldKey = Object.keys(PLAT_MIGRATE).find(k => PLAT_MIGRATE[k] === p.id);
        const carried = (s.platFate || {})[p.id] || (oldKey ? (s.platFate || {})[oldKey] : null);
        if (carried) fate[p.id] = carried;
        else if (yearOf(s.week) >= p.yr) fate[p.id] = { mult: 1, endShift: 0, verdict: "normal", revealed: true };
      }
      s.platFate = fate;
      s.realPlatforms = true;
      s.log = pushLog(s, "🎮 The industry's history books have been rewritten — your catalog now lives on the real console timeline.");
    }
    if (!s.publishers) {
      s.publishers = Object.fromEntries(PUBLISHERS.map(p => [p, { rel: 50 }]));
      s.pubIps = []; s.pitches = []; s.nextPitchWeek = s.week; s.pubProjects = [];
    }
    if (!s.leadId) s.leadId = s.staff[0]?.id || null;
    const patchStaff = m => (m.xp === undefined ? { ...m, xp: 0, level: 1, energy: 100, resting: false, trait: m.trait ?? (Math.random() < 0.4 ? pick(Object.keys(TRAITS)) : null) } : m);
    s.staff = s.staff.map(patchStaff);
    s.candidates = (s.candidates || []).map(patchStaff);
    if (s.project && !s.project.price) s.project.price = "std";
    if (s.projectB === undefined) s.projectB = null;
    for (const k of ["project", "projectB"]) {
      const p = s[k];
      if (p && p.maxWeekly === undefined) {
        const sz = SIZES.find(z => z.id === p.size) || SIZES[0];
        s[k] = { ...p, maxWeekly: p.totalWeeks / sz.minWeeks, vision: 0, crunch: false };
      }
    }
    if (!s.yearStats) s.yearStats = { revenue: 0, lastRevenue: 0, fansStart: s.fans, repStart: s.rep ?? 50, topRival: null };
    if (s.yearReview === undefined) s.yearReview = null;
    s.staff = s.staff.map(m => m.team ? m : { ...m, team: "A" });
    if (!s.rivals) {                             // migrate to persistent rival studios
      s.rivals = seedRivals(s.week);
      const act = Object.values(s.rivals).filter(r => r.active);
      for (const ip of Object.values(s.soldIps || {})) {
        const owner = act.find(r => r.name === ip.owner) || pick(act);
        owner.ips.push({ ...ip, formerYours: true, soldWeek: ip.soldWeek ?? s.week });
      }
      delete s.soldIps;
      s.market = s.market.map(m => {
        const seller = act.find(r => r.name === m.ip.owner);
        return seller ? { ...m, sellerId: seller.id } : m;
      });
    }
    // Roster expansion: add newly mapped studios missing from older saves,
    // and give pre-archetype rivals their identities.
    {
      const names = new Set(Object.values(s.rivals).map(r => r.name));
      for (const def of RIVAL_SEED) {
        if (names.has(def.name)) continue;
        const r = makeRival(def, s.week);
        if (yearOf(s.week) >= def.founded) r.active = true; else r.ips = [];
        s.rivals[r.id] = r;
      }
      for (const [id, r] of Object.entries(s.rivals)) {
        if (r.arch) continue;
        const def = RIVAL_SEED.find(d => d.name === r.name) || randomLateDef(r.name, r.founded);
        const arch = ARCHETYPES[def.arch];
        s.rivals[id] = {
          ...r, arch: def.arch, genres: def.genres, blurb: def.blurb,
          cadence: arch.cadence, ipUse: arch.ipUse, listDiv: arch.list, bust: arch.bust,
        };
      }
    }
    if (s.franchises) {                          // old franchise saves → IP system
      for (const [k, f] of Object.entries(s.franchises)) {
        s.ips[k] = {
          id: k, name: f.name, entries: f.entries, fans: f.fans, fatigue: f.fatigue,
          lastScore: f.lastScore, bestScore: f.bestScore || f.lastScore, lastWeek: f.lastWeek ?? s.week,
          hue: ri(0, 360),
        };
      }
      delete s.franchises;
      s.released = s.released.map(g => g.franchiseId ? { ...g, ipId: g.franchiseId } : g);
    }
    return s;
  } catch (e) { return null; }
}

// ---------- IP SYSTEM ----------
// Every original game registers as IP on release, whatever it scores.

// Star rating, 0–5 in half-star steps. Quality drives it; fans lift it;
// fatigue and years of dormancy drag it down.
function ipStars(ip, week) {
  const quality = (ip.lastScore * 0.6 + ip.bestScore * 0.4) / 20;      // 0–5
  const popularity = Math.min(1.25, ip.fans / 5000);
  const idleWeeks = ip.lastWeek != null ? Math.max(0, week - ip.lastWeek) : 0;
  const dormancy = idleWeeks > 208 ? Math.min(1.5, (idleWeeks - 208) / 260) : 0; // shine fades after ~4 idle years
  const fat = (ip.fatigue / 100) * 0.75;
  const raw = quality + popularity - dormancy - fat;
  return Math.max(0, Math.min(5, Math.round(raw * 2) / 2));
}

function ipValue(ip, week) {
  const stars = ipStars(ip, week);
  return Math.round(1500 + stars * stars * 3800 + ip.fans * 12 + ip.entries * 1600);
}

// What it costs to buy a studio whole: prestige, catalog, and trajectory.
// Declining studios come at a discount; rising ones demand a premium.
function acquisitionPrice(r, week) {
  const catalog = r.ips.reduce((a, ip) => a + ipValue(ip, week), 0);
  const trajMult = 1 + Math.max(-0.35, Math.min(0.35, r.momentum * 0.35));
  return Math.round((20000 + r.prestige * 4 + catalog * 0.9) * trajMult);
}

function ipInfo(ip) {
  return { ipId: ip.id, name: ip.name, entryNo: ip.entries + 1, fans: ip.fans, fatigue: ip.fatigue, expectation: ip.lastScore, hue: ip.hue };
}

function makeRivalIp(week) {
  const name = pick(NAME_A) + " " + pick(NAME_B);
  const last = ri(45, 88);
  const ip = {
    id: "riv-" + Math.random().toString(36).slice(2),
    name, entries: ri(1, 4), fans: ri(200, 6000),
    fatigue: ri(0, 30), lastScore: last, bestScore: Math.min(96, last + ri(0, 8)),
    lastWeek: week - ri(4, 80), hue: ri(0, 360),
  };
  return ip;
}

// ---------- RIVAL STUDIOS ----------

function makeRival(def, week) {
  const arch = ARCHETYPES[def.arch] || ARCHETYPES.blockbuster;
  return {
    id: "std-" + Math.random().toString(36).slice(2),
    name: def.name, founded: def.founded, hue: ri(0, 360),
    arch: def.arch, genres: def.genres || [], blurb: def.blurb || "",
    cadence: arch.cadence, ipUse: arch.ipUse, listDiv: arch.list, bust: arch.bust,
    active: false, defunct: false, defunctYear: null,
    skill: ri(arch.skill[0], arch.skill[1]),
    momentum: rnd(-0.3, 0.4),   // trajectory: rising / declining
    prestige: ri(500, 8000),
    ips: Array.from({ length: ri(1, 3) }, () => makeRivalIp(week)),
    lastRelease: null,
    awards: 0,
    nextRelease: week + ri(arch.cadence[0], arch.cadence[1]),
  };
}

function randomLateDef(name, founded) {
  const archKey = pick(Object.keys(ARCHETYPES));
  const genres = [pick(GENRES).id, pick(GENRES).id].filter((v, i, a) => a.indexOf(v) === i);
  return { name, founded, arch: archKey, genres, blurb: "A new face with something to prove." };
}

function seedRivals(week) {
  const rivals = {};
  const year = yearOf(week);
  for (const def of RIVAL_SEED) {
    const r = makeRival(def, week);
    if (year >= def.founded) { r.active = true; }
    else { r.ips = []; } // studios not yet founded own nothing
    rivals[r.id] = r;
  }
  return rivals;
}

function activeRivals(s) {
  return Object.values(s.rivals || {}).filter(r => r.active && !r.defunct);
}

// Rivals that act independently — excludes studios you own
function independentRivals(s) {
  return activeRivals(s).filter(r => !r.ownedByYou);
}

// What a rival would pay for YOUR studio when you're on the ropes
function studioValuation(s) {
  const catalog = Object.values(s.ips || {}).reduce((a, ip) => a + ipValue(ip, s.week), 0);
  return Math.max(30000, Math.round(s.fans * 8 + catalog * 0.8 + (s.awards?.length || 0) * 5000 + Math.max(0, s.money)));
}

function trajectoryOf(r) {
  if (r.defunct) return "defunct";
  return r.momentum > 0.25 ? "rising" : r.momentum < -0.25 ? "declining" : "steady";
}

// Weekly industry simulation: rival releases, portfolio growth, IP listings,
// bankruptcies, and new studios entering the market.
function simulateRivals(s, year) {
  const rivals = {};
  let market = [...(s.market || [])];
  const listedIds = () => new Set(market.map(m => m.ip.id));

  for (const [id, r0] of Object.entries(s.rivals || {})) {
    let r = { ...r0 };
    if (r.defunct) { rivals[id] = r; continue; }

    if (!r.active) {
      if (year >= r.founded) {
        r.active = true;
        r.ips = [makeRivalIp(s.week)];
        r.nextRelease = s.week + ri(r.cadence[0], r.cadence[1]);
        s.log = pushLog(s, `🏢 New studio: ${r.name} opens its doors — ${(ARCHETYPES[r.arch]?.label || "studio").toLowerCase()}.`);
      }
      rivals[id] = r;
      continue;
    }

    // Trajectory drift — fortunes turn slowly, then all at once
    r.momentum = Math.max(-1, Math.min(1, r.momentum + rnd(-0.05, 0.05)));
    r.skill = Math.max(25, Math.min(90, r.skill + r.momentum * 0.06 + rnd(-0.04, 0.04)));

    // Their IP fatigue cools like yours
    r.ips = r.ips.map(ip => ip.fatigue > 0 ? { ...ip, fatigue: Math.max(0, ip.fatigue - 0.6) } : ip);

    // Ship a game when one's due
    if (s.week >= r.nextRelease) {
      const score = Math.max(10, Math.min(97, Math.round(r.skill + rnd(-12, 12))));
      const genreId = r.genres.length && Math.random() < 0.75 ? pick(r.genres) : pick(GENRES).id;
      // Rivals pick a topic too — chasing the trend when there is one
      const topicId = s.trend?.type === "topic" && Math.random() < 0.35
        ? s.trend.id
        : pick(TOPICS.filter(t => t.yr <= year)).id;
      bumpSaturation(s, genreId, topicId);
      let useIp = r.ips.length && Math.random() < r.ipUse ? pick(r.ips) : null;
      if (r.orderedSequel && r.ips.length) {
        useIp = [...r.ips].sort((a, b) => ipStars(b, s.week) - ipStars(a, s.week))[0]; // you ordered a sequel in their best IP
        r.orderedSequel = false;
      }
      let title;
      if (useIp) {
        title = `${useIp.name} ${useIp.entries + 1}`;
        const upd = {
          ...useIp, entries: useIp.entries + 1,
          lastScore: score, bestScore: Math.max(useIp.bestScore, score), lastWeek: s.week,
          fatigue: Math.min(100, useIp.fatigue + 25),
          fans: score >= useIp.lastScore - 5
            ? useIp.fans + Math.round(Math.pow(score / 10, 2.2) * 30)
            : Math.round(useIp.fans * 0.75),
        };
        r.ips = r.ips.map(x => x.id === useIp.id ? upd : x);
        if (upd.formerYours) {
          s.log = pushLog(s, `${r.name} shipped "${title}" — your old IP scored ${score}/100 under their roof.`);
        } else if (score >= 80 || score <= 38) {
          s.log = pushLog(s, score >= 80 ? `🔥 ${r.name} shipped "${title}" — ${score}/100.` : `${r.name}'s "${title}" flopped at ${score}/100.`);
        }
      } else {
        title = rivalGameName();
        r.ips = [...r.ips, {
          id: "riv-" + Math.random().toString(36).slice(2),
          name: title, entries: 1, fans: Math.round(Math.pow(score / 10, 2.2) * 25),
          fatigue: 15, lastScore: score, bestScore: score, lastWeek: s.week, hue: ri(0, 360),
        }];
        if (score >= 80) s.log = pushLog(s, `🔥 ${r.name} launched a new IP, "${title}" — ${score}/100.`);
      }
      r.lastRelease = { name: title, score, year, genre: genreId };
      if (s.yearStats && (!s.yearStats.topRival || score > s.yearStats.topRival.score)) {
        s.yearStats = { ...s.yearStats, topRival: { studio: r.name, game: title, score } };
      }
      if (r.ownedByYou) {
        const payout = Math.round(Math.pow(score / 10, 2.4) * 150);
        s.money += payout;
        if (s.yearStats) s.yearStats = { ...s.yearStats, revenue: (s.yearStats.revenue || 0) + payout, subShips: [...(s.yearStats.subShips || []), score] };
        s.log = pushLog(s, `🏢 Your subsidiary ${r.name} shipped "${title}" (${score}/100) — ${money$(payout)} flows up to the parent company.`);
      }
      // Rivals chase trends too: genre trends match directly, topic trends 30% of the time
      const rTrendy = s.trend && (s.trend.type === "genre" ? s.trend.id === genreId : Math.random() < 0.3);
      r.prestige = Math.max(0, Math.round(r.prestige + (score - 55) * 8 * (rTrendy ? 2 : 1)));
      if (rTrendy && score >= 70) s.log = pushLog(s, `📈 ${r.name} rode the ${trendLabel(s.trend)} wave with "${title}" (${score}/100) — their stock is soaring.`);
      r.nextRelease = s.week + ri(r.cadence[0], r.cadence[1]);
      s.rivalReleases = [...(s.rivalReleases || []), { name: title, score, year, genre: genreId, rivalId: id, rivalName: r.name }].slice(-80);
    }

    // Subsidiaries keep their catalog in the family and can't go under on their own
    if (r.ownedByYou) { rivals[id] = r; continue; }

    // Buyback window: rivals shop your former IP around
    const fy = r.ips.find(ip => ip.formerYours && !listedIds().has(ip.id) && s.week - (ip.soldWeek || 0) > 26);
    if (fy && Math.random() < 1 / 70) {
      market.push({ ip: fy, price: Math.round(ipValue(fy, s.week) * 1.3), weeksLeft: 20, buyback: true, sellerId: id });
      s.log = pushLog(s, `💼 ${r.name} is shopping "${fy.name}" around. It's on the IP Market — buy it back before someone else does.`);
    } else if (r.ips.filter(ip => !ip.formerYours).length >= 2 && market.filter(m => !m.buyback).length < 3 && Math.random() < 1 / r.listDiv) {
      // Rivals occasionally sell off their weakest property
      const sellable = r.ips.filter(ip => !listedIds().has(ip.id) && !ip.formerYours);
      if (sellable.length) {
        const worst = [...sellable].sort((a, b) => ipStars(a, s.week) - ipStars(b, s.week))[0];
        market.push({ ip: worst, price: Math.round(ipValue(worst, s.week) * 1.15), weeksLeft: ri(14, 26), buyback: false, sellerId: id });
        s.log = pushLog(s, `💼 ${r.name} listed the "${worst.name}" IP on the market.`);
      }
    }

    // Bankruptcy: a long decline ends in a fire sale
    if (r.skill < 36 && r.momentum < 0 && Math.random() < (r.bust || 1 / 90)) {
      r.defunct = true;
      r.defunctYear = year;
      s.log = pushLog(s, `🏚 ${r.name} has shut down after ${year - r.founded} years. Its catalog hits the market at fire-sale prices.`);
      const already = listedIds();
      for (const ip of r.ips) {
        if (already.has(ip.id)) {
          market = market.map(m => m.ip.id === ip.id ? { ...m, price: Math.round(ipValue(ip, s.week) * 0.75), weeksLeft: Math.max(m.weeksLeft, 30) } : m);
        } else {
          market.push({ ip, price: Math.round(ipValue(ip, s.week) * 0.75), weeksLeft: 30, buyback: !!ip.formerYours, fireSale: true, sellerId: id });
        }
      }
    }

    rivals[id] = r;
  }

  // A fresh face enters the industry now and then — and the industry itself
  // grows with the decades: ~10 studios in the '80s, 20+ by the 2010s
  const industryCap = 10 + Math.floor((year - 1984) / 6) * 2;
  const activeCount = Object.values(rivals).filter(r => r.active && !r.defunct).length;
  if (activeCount < industryCap && Math.random() < 1 / 100) {
    const used = new Set(Object.values(rivals).map(r => r.name));
    const pool = LATE_RIVAL_NAMES.filter(n => !used.has(n));
    if (pool.length) {
      const nr = makeRival(randomLateDef(pick(pool), year), s.week);
      nr.active = true;
      rivals[nr.id] = nr;
      s.log = pushLog(s, `🏢 New studio: ${nr.name} enters the industry — ${(ARCHETYPES[nr.arch]?.label || "studio").toLowerCase()}.`);
    }
  }

  // Consolidation: a strong studio swallows a dying one now and then
  {
    const indep = Object.values(rivals).filter(r => r.active && !r.defunct && !r.ownedByYou);
    const prey = indep.filter(r => r.skill < 42 && r.momentum < -0.15);
    const predators = indep.filter(r => r.momentum > 0.1 && r.prestige > 4000);
    if (prey.length && predators.length && Math.random() < 1 / 120) {
      const target = pick(prey);
      const buyer = pick(predators.filter(p => p.id !== target.id));
      if (buyer) {
        const inherited = target.ips.map(ip => ({ ...ip }));
        const gotYours = inherited.some(ip => ip.formerYours);
        rivals[target.id] = { ...target, defunct: true, defunctYear: year, acquiredBy: buyer.name, ips: [] };
        rivals[buyer.id] = { ...buyer, ips: [...buyer.ips, ...inherited], prestige: Math.round(buyer.prestige + target.prestige * 0.5) };
        s.log = pushLog(s, `🏦 ${buyer.name} has acquired ${target.name}${inherited.length ? ` — ${inherited.length} IP${inherited.length > 1 ? "s" : ""} change hands` : ""}.${gotYours ? " Your former IP just got a new landlord." : ""}`);
      }
    }
  }

  // Rivals shop the market too — snooze on a listing and it's gone
  const buyers = Object.values(rivals).filter(r => r.active && !r.defunct && !r.ownedByYou);
  market = market.filter(m => {
    if (buyers.length && Math.random() < 1 / 45) {
      const buyer = pick(buyers.filter(b => b.id !== m.sellerId));
      if (buyer) {
        const seller = m.sellerId ? rivals[m.sellerId] : null;
        if (seller) rivals[m.sellerId] = { ...seller, ips: seller.ips.filter(x => x.id !== m.ip.id) };
        rivals[buyer.id] = { ...rivals[buyer.id], ips: [...rivals[buyer.id].ips, { ...m.ip }] };
        s.log = pushLog(s, m.buyback
          ? `😤 ${buyer.name} snapped up "${m.ip.name}" — your old IP has a new landlord.`
          : `${buyer.name} acquired the "${m.ip.name}" IP off the market.`);
        return false;
      }
    }
    return true;
  });

  s.rivals = rivals;
  s.market = market;
  return s;
}

// ---------- CONTRACTS ----------

const PUBLISHERS = ["Meridian Publishing", "Starcade Media", "Vantage Bros.", "Crescent Co."];

// Publisher reach: the fan floor their logo on the box buys you
const pubReach = rel => 18000 + rel * 100;

// Deal terms scale with your relationship
function pubDealTerms(pub, rel, devCost, keepIp) {
  const advance = Math.round(devCost * (0.8 + rel / 200) * (keepIp ? 0.5 : 1));
  return { name: pub, advance, share: 0.35, floor: pubReach(rel), ipRights: keepIp };
}

const INDIE_NAMES = ["Moonlight Attic", "Cardboard Rocket", "Two Brothers Basement", "Neon Possum", "Static Cling Games", "Paper Lantern", "Rust Belt Studio", "Midnight Waffle", "Glass Cannon Collective", "Tumbleweed Digital", "Fern & Pixel", "Broke Compass"];

function makePitch(week, year) {
  const genre = pick(GENRES);
  const topic = pick(TOPICS.filter(t => t.yr <= year));
  const safe = Math.random() < 0.5;
  const mid = ri(45, 78);
  const spread = safe ? ri(5, 9) : ri(14, 24);
  return {
    id: Math.random().toString(36).slice(2),
    studio: pick(INDIE_NAMES),
    concept: `a ${genre.name.toLowerCase()} about ${topic.name.toLowerCase()}`,
    ask: Math.round((4000 + mid * 120 + (safe ? 3000 : 0)) * (1 + (year - 1984) * 0.03)),
    weeks: ri(10, 22),
    scoreMin: Math.max(15, mid - spread),
    scoreMax: Math.min(96, mid + spread),
  };
}
const CONTRACT_JOBS = ["Port job", "QA sweep", "Prototype demo", "Licensed tie-in", "Localization pass", "Engine consulting"];
const CONTRACT_TIERS = [
  { tier: "Small",  work: 6,  pay: [1200, 2200],  rp: 3,  deadline: 10 },
  { tier: "Medium", work: 12, pay: [2800, 5200],  rp: 6,  deadline: 16 },
  { tier: "Large",  work: 22, pay: [6000, 11000], rp: 12, deadline: 26 },
];

function makeContract(year, rivalNames) {
  const t = pick(CONTRACT_TIERS);
  const infl = 1 + (year - 1984) * 0.07;
  const client = Math.random() < 0.5 && rivalNames.length ? pick(rivalNames) : pick(PUBLISHERS);
  return {
    id: Math.random().toString(36).slice(2),
    client, job: pick(CONTRACT_JOBS), tier: t.tier,
    work: t.work, progress: 0,
    pay: Math.round(rnd(t.pay[0], t.pay[1]) * infl),
    rp: t.rp, deadline: t.deadline,
  };
}

// Rescale a dev-focus allocation to a new point total, preserving ratios.
function normalizeAlloc(alloc, target) {
  const keys = ["gameplay", "graphics", "story", "sound"];
  const sum = keys.reduce((a, k) => a + (alloc[k] || 0), 0) || 1;
  const out = {};
  let acc = 0;
  for (const k of keys) { out[k] = Math.round(((alloc[k] || 0) / sum) * target); acc += out[k]; }
  const largest = [...keys].sort((a, b) => out[b] - out[a])[0];
  out[largest] = Math.max(0, out[largest] + (target - acc)); // absorb rounding drift
  return out;
}

// ---------- MARKET SATURATION ----------
// Every release (yours and rivals') crowds its genre and topic for about a
// year. Flooded markets pay less; starved ones pay a little extra.
function satFactor(count, threshold, k) {
  if (count < 1) return 1.1; // starved market — buyers are hungry
  return Math.max(0.55, 1 / (1 + Math.max(0, count - threshold) * k));
}
function marketFactor(s, genreId, topicId) {
  const g = satFactor((s.satGenre || {})[genreId] || 0, 3, 0.10);
  const t = satFactor((s.satTopic || {})[topicId] || 0, 2, 0.12);
  return Math.max(0.5, Math.min(1.15, g * t));
}
function bumpSaturation(s, genreId, topicId) {
  s.satGenre = { ...(s.satGenre || {}), [genreId]: ((s.satGenre || {})[genreId] || 0) + 1 };
  if (topicId) s.satTopic = { ...(s.satTopic || {}), [topicId]: ((s.satTopic || {})[topicId] || 0) + 1 };
}

// ---------- TRENDS ----------

function matchesTrend(trend, genre, topic) {
  if (!trend) return false;
  return trend.type === "topic" ? trend.id === topic : trend.id === genre;
}
function trendLabel(trend) {
  if (!trend) return "";
  return trend.type === "topic" ? (topicById(trend.id)?.name || trend.id) : (genreById(trend.id)?.name || trend.id);
}

// ---------- AWARDS ----------

const rivalGameName = () => pick(NAME_A) + " " + pick(NAME_B);

// Runs at week 52. Mutates a copy of state: applies effects and stores the
// awards-night results for the modal.
function runAwards(s, year) {
  const yearGames = s.released.filter(g => g.year === year && !g.port);
  if (!yearGames.length) {
    s.log = pushLog(s, `🏆 The ${year} Pixel Awards came and went. No nominations — you didn't release anything this year.`);
    s.rivalReleases = (s.rivalReleases || []).filter(rr => rr.year > year);
    return s;
  }
  const best = arr => arr.reduce((a, b) => (b.score > a.score ? b : a));
  const fame = ((s.rep ?? 50) - 50) / 12; // reputation sways juries, for and against — a little

  // The competition: what rival studios actually shipped this year.
  // Every category faces the year's best (or second-best) rival game.
  const rivalPool = (s.rivalReleases || []).filter(rr => rr.year === year).sort((a, b) => b.score - a.score);
  const pickRival = strongest => {
    if (rivalPool.length) return rivalPool[strongest ? 0 : Math.min(ri(0, 1), rivalPool.length - 1)];
    const fallbackName = activeRivals(s)[0]?.name || "an indie upstart";
    return { name: rivalGameName(), score: ri(70, 92), rivalName: fallbackName, rivalId: null };
  };

  // Nomination bar: the jury doesn't shortlist mediocre games
  const NOM_BAR = 65;
  const nominees = yearGames.filter(g => g.score >= NOM_BAR);

  // Craft channels: a game's category strength = its score weighted by where
  // the dev focus went. A story-heavy 82 can carry a 94 story reel.
  const chanScore = (g, k) => {
    const pts = Object.values(g.alloc || {}).reduce((a, b) => a + b, 0) || 16;
    const share = (g.alloc?.[k] ?? pts / 4) / pts;
    return Math.min(98, Math.round(g.score * (0.7 + share * 1.2)));
  };

  const defs = [
    { cat: "Game of the Year", pool: nominees, top: true,  val: g => g.score },
    { cat: "Best Gameplay",    pool: nominees, top: false, val: g => chanScore(g, "gameplay"), chan: true },
    { cat: "Best Story",       pool: nominees, top: false, val: g => chanScore(g, "story"),    chan: true },
    { cat: "Best Graphics",    pool: nominees, top: false, val: g => chanScore(g, "graphics"), chan: true },
    { cat: "Best Sound",       pool: nominees, top: false, val: g => chanScore(g, "sound"),    chan: true },
  ];

  const categories = [];
  let winsSoFar = 0;
  const judge = (cat, nomineeName, yourVal, rv, rivalVal, extra = {}) => {
    // Juries are fickle: margins shift the odds, but nothing is a lock —
    // and every trophy you take tonight makes them want to spread the love.
    const diff = yourVal + fame - rivalVal - winsSoFar * 5;
    const winChance = Math.max(0.06, Math.min(0.94, 0.5 + diff * 0.055));
    const won = Math.random() < winChance;
    if (won) winsSoFar++;
    categories.push({ cat, nominee: nomineeName, rival: rv.rival, rivalScore: Math.round(rivalVal), rivalId: rv.rivalId, yourScore: Math.round(yourVal), won, ...extra });
  };

  for (const d of defs) {
    if (!d.pool.length) continue;
    const nominee = [...d.pool].sort((a, b) => d.val(b) - d.val(a))[0];
    const rv = pickRival(d.top);
    // In craft categories, the rival's channel strength varies from their overall score
    const rivalVal = d.chan ? Math.max(20, Math.min(98, rv.score + ri(-6, 10))) : rv.score;
    judge(d.cat, nominee.name, d.val(nominee), { rival: `"${rv.name}" (${rv.rivalName})`, rivalId: rv.rivalId }, rivalVal, { nomineeId: nominee.id, ipId: nominee.ipId });
  }

  // ---- Studio awards ----
  // Group the year's rival releases by studio for the head-to-head
  const byStudio = {};
  for (const rr of rivalPool) {
    if (!byStudio[rr.rivalId]) byStudio[rr.rivalId] = { id: rr.rivalId, name: rr.rivalName, scores: [] };
    byStudio[rr.rivalId].scores.push(rr.score);
  }
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const studioRows = Object.values(byStudio).filter(x => x.id);

  // Developer of the Year: pure craft — your average review score this year
  if (yearGames.length && avg(yearGames.map(g => g.score)) >= 60) {
    const myDev = avg(yearGames.map(g => g.score)) + Math.min(6, (yearGames.length - 1) * 2);
    const rivalDevs = studioRows.map(x => ({ ...x, v: avg(x.scores) + Math.min(6, (x.scores.length - 1) * 2) })).sort((a, b) => b.v - a.v);
    const rd = rivalDevs[0] || { name: activeRivals(s)[0]?.name || "an indie upstart", id: null, v: ri(72, 90) };
    judge("Developer of the Year", s.studioName, myDev, { rival: `${rd.name} (studio)`, rivalId: rd.id }, rd.v);
  }

  // Production Company of the Year: breadth of the whole umbrella —
  // your games + your label's indies + your subsidiaries' releases
  const umbrella = [
    ...yearGames.map(g => g.score),
    ...((s.yearStats?.labelShips) || []),
    ...((s.yearStats?.subShips) || []),
  ];
  if (umbrella.length >= 2 && avg(umbrella) >= 60) {
    const myProd = avg(umbrella) + Math.min(12, umbrella.length * 3);
    const rivalProds = studioRows.map(x => ({ ...x, v: avg(x.scores) + Math.min(12, x.scores.length * 3) })).sort((a, b) => b.v - a.v);
    const rp = rivalProds[0] || { name: activeRivals(s)[0]?.name || "an indie upstart", id: null, v: ri(78, 94) };
    judge("Production Company of the Year", s.studioName, myProd, { rival: `${rp.name} (studio)`, rivalId: rp.id }, rp.v);
  }

  if (!categories.length) {
    s.log = pushLog(s, `🏆 The ${year} Pixel Awards came and went without a single nomination for you — nothing you shipped cleared the jury's bar (${NOM_BAR}+).`);
    s.rivalReleases = (s.rivalReleases || []).filter(rr => rr.year > year);
    return s;
  }

  let wins = 0;
  for (const c of categories) {
    if (!c.won) {
      // The rival takes the trophy — and the clout
      if (c.rivalId && s.rivals[c.rivalId]) {
        const r = s.rivals[c.rivalId];
        s.rivals = { ...s.rivals, [c.rivalId]: { ...r, awards: r.awards + 1, prestige: r.prestige + 800 } };
      }
      continue;
    }
    wins++;
    s.awards = [...s.awards, { year, cat: c.cat, game: c.nominee }];
    s.fans += Math.round(400 + s.fans * 0.06);
    s.rep = Math.min(100, (s.rep ?? 50) + 3);
    if (c.cat === "Game of the Year") {
      s.released = s.released.map(g => g.id === c.nomineeId ? { ...g, goty: true } : g);
    }
    if (c.ipId && s.ips[c.ipId]) {
      const ip = s.ips[c.ipId];
      s.ips = { ...s.ips, [c.ipId]: { ...ip, fans: Math.round(ip.fans * 1.15) } };
    }
  }
  s.morale = Math.min(100, s.morale + (wins ? wins * 6 : -3));
  s.awardsShow = { year, categories };
  s.rivalReleases = (s.rivalReleases || []).filter(rr => rr.year > year);
  s.log = pushLog(s, wins
    ? `🏆 The ${year} Pixel Awards: ${wins} win${wins > 1 ? "s" : ""}! The trophy cabinet grows.`
    : `🏆 The ${year} Pixel Awards: nominated, but the trophies went elsewhere this year.`);
  return s;
}

// ---------- CONVENTIONS ----------

function conTiers(year) {
  const infl = year - 1984;
  return [
    { id: "booth",   name: "Show-floor booth",  cost: 2500 + infl * 120,  hype: 20, fansPct: 0.02, fansFlat: 200,  rp: 5,  star: 0 },
    { id: "stage",   name: "Showcase stage",    cost: 8000 + infl * 350,  hype: 45, fansPct: 0.05, fansFlat: 600,  rp: 12, star: 0.5 },
    { id: "keynote", name: "Opening keynote",   cost: 18000 + infl * 600, hype: 70, fansPct: 0.10, fansFlat: 1500, rp: 25, star: 1, minFans: 20000 },
  ];
}
async function wipeSave() {
  try { await window.storage.delete(SAVE_KEY); } catch (e) {}
}

// ---------- WEEK TICK ----------

function tick(prev) {
  let s = { ...prev, week: prev.week + 1 };
  const year = yearOf(s.week);

  // Costs
  const salaries = s.staff.reduce((a, m) => a + m.salary, 0);
  const rent = OFFICES[s.office].rent;
  s.money -= salaries + rent;

  // Loan repayment
  if (s.loan) {
    s.money -= s.loan.weekly;
    const weeksLeft = s.loan.weeksLeft - 1;
    if (weeksLeft <= 0) {
      s.loan = null;
      s.log = pushLog(s, "🏦 Final loan payment made. You're square with the bank.");
    } else {
      s.loan = { ...s.loan, weeksLeft };
    }
  }

  // Team output: staff are assigned to Team A or B. Each team's output feeds
  // its own project slot; an active contract siphons ~35% of total output
  // while any game is in development (100% if the whole studio is idle).
  const dtMult = s.tech.includes("devtools") ? 1.1 : 1;
  const outA = effTeamOutput(s.staff, "A", dtMult), outB = effTeamOutput(s.staff, "B", dtMult);
  const projA = s.project && s.project.stage !== "done" ? s.project : null;
  const projB = s.projectB && s.projectB.stage !== "done" ? s.projectB : null;
  const hasProject = !!(projA || projB);
  const contractShare = s.contracts?.active ? (hasProject ? 0.35 : 1) : 0;
  const projectShare = 1 - (hasProject ? contractShare : 0);

  // Energy and experience
  const busy = hasProject || !!s.contracts?.active;
  const hasMentor = s.staff.some(m => m.trait === "mentor" && !m.resting);
  s.staff = s.staff.map(m => {
    let nm = { ...m };
    // energy
    if (nm.resting || !busy) {
      nm.energy = Math.min(100, (nm.energy ?? 100) + (nm.resting ? 8 : 4));
    } else {
      let drain = nm.trait === "crunchproof" ? 0.75 : nm.trait === "fragile" ? 2.2 : 1.5;
      const myProj = (nm.team || "A") === "B" ? projB : projA;
      if (myProj?.crunch) drain *= 2; // crunch burns people twice as fast
      nm.energy = Math.max(0, (nm.energy ?? 100) - drain);
    }
    // xp while working
    if (busy && !nm.resting) {
      let gain = rnd(1, 3);
      if (nm.trait === "prodigy") gain *= 1.5;
      if (hasMentor && nm.trait !== "mentor") gain *= 1.2;
      if (nm.id === s.leadId) gain *= 2;
      nm.xp = (nm.xp ?? 0) + gain;
      const newLevel = 1 + Math.floor(nm.xp / 100);
      if (newLevel > (nm.level ?? 1)) {
        nm.level = newLevel;
        const stat = pick(["code", "design", "art", "sound"]);
        nm[stat] = Math.min(10, nm[stat] + 1);
        nm.salary = Math.round(nm.salary * 1.1);
        s.log = pushLog(s, `⭐ ${nm.name} reached level ${newLevel} — +1 ${stat}, salary up 10%.`);
      }
    }
    return nm;
  });

  // Project progress (both team slots run through the same machinery)
  const advance = (p, teamOutput) => {
    const np = { ...p };
    const speed = (s.tech.includes("agile") ? 1.15 : 1) * (np.crunch ? 1.3 : 1);
    const crew = mm => (mm.team || "A") === (np.team || "A") && !mm.resting;
    // Weekly progress is capped — great teams ship *better*, not instantly
    const gainCap = np.maxWeekly ?? Infinity;
    if (np.stage === "pre") {
      // Pre-production: no bugs, and the team's design chops set the vision
      np.progress += Math.min(gainCap, teamOutput * projectShare * speed * rnd(0.85, 1.15));
      s.rp += rnd(0.3, 0.8);
      if (np.progress >= np.totalWeeks * 0.15) {
        const crewMembers = s.staff.filter(crew);
        const avgDesign = crewMembers.length ? crewMembers.reduce((a, m) => a + m.design, 0) / crewMembers.length : 4;
        np.vision = Math.max(0, Math.min(5, Math.round((avgDesign - 4) * 0.9)));
        np.stage = "dev";
        s.log = pushLog(s, `📐 Pre-production wrapped on "${np.name}" — the vision is locked in${np.vision ? ` (+${np.vision} quality)` : ""}. Full production begins.`);
      }
    } else if (np.stage === "dev") {
      np.progress += Math.min(gainCap, teamOutput * projectShare * speed * rnd(0.85, 1.15));
      const bugRate = (s.tech.includes("qa") ? 0.6 : 1)
        * (s.staff.some(m => m.trait === "bugmagnet" && crew(m)) ? 1.1 : 1)
        * (np.crunch ? 1.25 : 1);
      np.bugs += rnd(0.4, 1.3) * bugRate * (np.size === "L" ? 1.5 : np.size === "M" ? 1.15 : 1);
      s.rp += rnd(0.6, 1.4);
      if (np.progress >= np.totalWeeks) {
        np.stage = "polish";
        s.log = pushLog(s, `"${np.name}" hit content-complete. Now squash bugs and build hype.`);
      }
    } else if (np.stage === "polish") {
      np.bugs = Math.max(0, np.bugs - teamOutput * projectShare * 0.9 * (s.tech.includes("autotest") ? 1.5 : 1) * (np.crunch ? 1.3 : 1));
      if (!s.tech.includes("pr")) np.hype = Math.max(0, (np.hype || 0) - 1);
      s.rp += rnd(0.3, 0.8);
    }
    return np;
  };
  if (projA) s.project = advance(projA, outA);
  if (projB) s.projectB = advance(projB, outB);
  if (projA?.crunch || projB?.crunch) s.morale = Math.max(30, s.morale - 0.4);

  // Contract work
  if (s.contracts?.active) {
    const c = { ...s.contracts.active };
    c.progress += (outA + outB) * contractShare * rnd(0.85, 1.15);
    c.deadline -= 1;
    if (c.progress >= c.work) {
      const payMult = 1 + ((s.rep ?? 50) - 50) / 200; // reputation moves the invoice ±25%
      const paid = Math.round(c.pay * payMult);
      s.money += paid;
      s.rp += c.rp;
      s.rep = Math.min(100, (s.rep ?? 50) + 1);
      s.morale = Math.min(100, s.morale + 2);
      s.contracts = { ...s.contracts, active: null };
      s.log = pushLog(s, `📝 Contract complete: ${c.job.toLowerCase()} for ${c.client}. Paid ${money$(paid)}, +${c.rp} RP.`);
    } else if (c.deadline <= 0) {
      s.fans = Math.max(0, Math.round(s.fans * 0.98));
      s.rep = Math.max(0, (s.rep ?? 50) - 3);
      s.morale = Math.max(30, s.morale - 5);
      s.contracts = { ...s.contracts, active: null };
      s.log = pushLog(s, `📝 Missed the deadline on ${c.client}'s ${c.job.toLowerCase()}. No pay, and word gets around.`);
    } else {
      s.contracts = { ...s.contracts, active: c };
    }
  }

  // Sales on released games + live-service revenue
  let weekRevenue = 0;
  s.released = s.released.map(gm => {
    if (gm.live) {
      if ((gm.health ?? 0) <= 0) {
        if (!gm.sunset) {
          s.log = pushLog(s, `🌐 "${gm.name}" has gone dark — the player base finally moved on.`);
          return { ...gm, sunset: true, health: 0 };
        }
        return gm;
      }
      const rev = gm.weeklyBase * 0.45 * ((gm.health ?? 100) / 100) * rnd(0.85, 1.15);
      weekRevenue += rev;
      if (Math.random() < 0.3) s.fans += ri(1, 8);
      return { ...gm, health: Math.max(0, (gm.health ?? 100) - 1.2), salesTotal: gm.salesTotal + rev };
    }
    if (gm.weeksLeft <= 0) return gm;
    const decay = gm.weeksLeft / gm.weeksTotal;
    const rev = gm.weeklyBase * decay * rnd(0.8, 1.2);
    weekRevenue += rev;
    return { ...gm, weeksLeft: gm.weeksLeft - 1, salesTotal: gm.salesTotal + rev };
  });
  s.money += weekRevenue;
  if (s.yearStats) s.yearStats = { ...s.yearStats, revenue: (s.yearStats.revenue || 0) + weekRevenue };

  // Morale drift
  s.morale = Math.max(30, Math.min(100, s.morale + rnd(-1, 1)));

  // Merch keeps the lights on; the community team keeps the fans warm
  if (s.tech.includes("merch")) s.money += Math.round(s.fans * 0.02);
  if (s.tech.includes("community")) s.fans += Math.round(5 + s.fans * 0.001);

  // --- Engine licensing economy ---
  const era = eraPower(year);
  let royaltyTotal = 0;
  s.engines = (s.engines || []).map(e => {
    if (!e.licensed) return e;
    let eng = { ...e };
    const power = enginePowerFromParts(eng.parts);
    // Adoption: competitive engines pick up licensees
    if (eng.licensees < 6 && power >= era * 0.7 && Math.random() < 0.04 * Math.min(2, power / era)) {
      eng.licensees += 1;
      const adopter = pick(activeRivals(s))?.name || "An indie studio";
      s.rep = Math.min(100, (s.rep ?? 50) + 1);
      s.log = pushLog(s, `🔧 ${adopter} licensed ${eng.name} v${eng.version}. ${eng.licensees} studio${eng.licensees > 1 ? "s" : ""} now ship on your tech.`);
    }
    // Churn: engines that fall behind the era lose licensees
    if (eng.licensees > 0 && power < era * 0.55 && Math.random() < 0.06) {
      eng.licensees -= 1;
      s.log = pushLog(s, `${eng.name} is showing its age — a licensee jumped ship. Update it to stay competitive.`);
    }
    royaltyTotal += eng.licensees * (50 + power * 4);
    return eng;
  });
  if (royaltyTotal > 0) {
    s.money += royaltyTotal;
    if (s.yearStats) s.yearStats = { ...s.yearStats, revenue: (s.yearStats.revenue || 0) + royaltyTotal };
  }

  // Subsidiary dividends — healthy subs pay up; failing ones bleed you
  {
    let divTotal = 0;
    for (const r of Object.values(s.rivals || {})) {
      if (!r.ownedByYou || r.defunct || !r.active) continue;
      const failing = r.skill < 36 && r.momentum < 0;
      const div = failing ? -400 : Math.round(r.prestige * 0.003 + r.skill * 1.5);
      divTotal += div;
      if (failing && Math.random() < 0.08) s.log = pushLog(s, `⚠ ${r.name} is hemorrhaging money — inject capital, absorb it, or sell it off.`);
    }
    if (divTotal !== 0) {
      s.money += divTotal;
      if (divTotal > 0 && s.yearStats) s.yearStats = { ...s.yearStats, revenue: (s.yearStats.revenue || 0) + divTotal };
    }
  }

  // A wounded studio attracts predators: rivals may offer to buy YOU
  if (!s.buyoutOffer && !s.gameOver && !s.bankOffer && s.week > 52 && Math.random() < 1 / 40) {
    const wounded = s.loan || s.money < -5000 || (s.rep ?? 50) < 30;
    const suitors = independentRivals(s).filter(r => r.prestige > 5000);
    if (wounded && suitors.length) {
      const suitor = [...suitors].sort((a, b) => b.prestige - a.prestige)[0];
      s.buyoutOffer = { buyer: suitor.name, price: studioValuation(s) };
      s.log = pushLog(s, `🏦 ${suitor.name} smells blood — they've made an offer to acquire ${s.studioName}.`);
    }
  }

  // Publishing label: the pitch board refreshes; funded indies ship
  if (s.office >= 3 && (s.rep ?? 50) >= 60 && s.week >= (s.nextPitchWeek ?? 0)) {
    s.pitches = [makePitch(s.week, year), makePitch(s.week, year), makePitch(s.week, year)];
    s.nextPitchWeek = s.week + 16;
    if (!s.pitchBoardSeen) { s.pitchBoardSeen = true; s.log = pushLog(s, "📮 Word is out that you're funding indies — pitches are landing on your desk. Check the Studio tab."); }
  }
  if ((s.pubProjects || []).length) {
    const still = [];
    for (const pp of s.pubProjects) {
      if (s.week < pp.done) { still.push(pp); continue; }
      const score = ri(pp.scoreMin, pp.scoreMax);
      const revenue = Math.round(Math.pow(score / 10, 2.3) * 220 * 0.7);
      s.money += revenue;
      s.fans += score * 30;
      if (s.yearStats) s.yearStats = { ...s.yearStats, revenue: (s.yearStats.revenue || 0) + revenue, labelShips: [...(s.yearStats.labelShips || []), score] };
      let repD = 0;
      if (score >= 75) repD = 2; else if (score < 45) repD = -2;
      s.rep = Math.max(0, Math.min(100, (s.rep ?? 50) + repD));
      s.log = pushLog(s, score >= 75
        ? `📮 ${pp.studio}'s "${pp.title}" shipped under your label — ${score}/100! Your cut: ${money$(revenue)}. Publishing hits builds your name.`
        : score < 45
        ? `📮 ${pp.studio}'s "${pp.title}" shipped under your label at ${score}/100. Your cut: ${money$(revenue)} — but your logo was on that. (−2 rep)`
        : `📮 ${pp.studio}'s "${pp.title}" shipped under your label — ${score}/100. Your cut: ${money$(revenue)}.`);
    }
    s.pubProjects = still;
  }

  // Rival engines come up for license periodically
  if (s.week % 52 === 30 || (!s.engineMarket?.length && s.week % 13 === 0)) {
    const sellers = independentRivals(s).filter(r => r.arch === "tech" || r.arch === "blockbuster");
    const offer = () => {
      const seller = sellers.length ? pick(sellers) : { name: pick(PUBLISHERS), id: null, arch: "tech" };
      const power = Math.round(era * rnd(0.85, 1.2) * (seller.arch === "tech" ? 1.15 : 1));
      return {
        id: Math.random().toString(36).slice(2),
        name: pick(["Vertex","Onyx","Prism","Forge","Nimbus","Apex","Iron"]) + " " + pick(["Engine","Core","Works","Tech"]),
        owner: seller.name, power,
        upfront: power * 250, perGame: power * 40,
      };
    };
    s.engineMarket = [offer(), offer()];
  }

  // Analytics snapshot every 4 weeks
  if (s.week % 4 === 0) {
    s.history = [...(s.history || []), { w: s.week, money: Math.round(s.money), fans: s.fans }].slice(-450);
  }

  // Console launches: roll this run's fortune; reveal the verdict ~14 months in
  for (const p of PLATFORMS) {
    if (year >= p.yr && !(s.platFate || {})[p.id]) {
      const roll = Math.random();
      const fate = roll < 0.15 ? { mult: rnd(1.25, 1.45), endShift: 2,  verdict: "hit",  revealed: false }
                 : roll < 0.30 ? { mult: rnd(0.5, 0.7),   endShift: -3, verdict: "flop", revealed: false }
                 :               { mult: rnd(0.92, 1.08), endShift: 0,  verdict: "normal", revealed: true };
      s.platFate = { ...(s.platFate || {}), [p.id]: fate };
      s.log = pushLog(s, `🎮 ${p.holder ? p.holder + " launches" : "Enter"} the ${p.name}${p.lic ? ` — dev kits ${money$(p.lic)}` : ""}. The console war has a new front.`);
    }
    const f = (s.platFate || {})[p.id];
    if (f && !f.revealed && (1984 + s.week / 52 - p.yr) > 1.2) {
      f.revealed = true;
      s.platFate = { ...s.platFate, [p.id]: { ...f } };
      s.log = pushLog(s, f.verdict === "hit"
        ? `🎮 The ${p.name} is flying off shelves — it's this generation's winner. Games on it will sell.`
        : `🎮 The ${p.name} is officially a flop. Analysts expect an early exit — dev kits are already discounted.`);
    }
  }

  // Market saturation cools ~2%/week — a flooded genre recovers in about a year
  const coolSat = obj => {
    const o = {};
    for (const [k, v] of Object.entries(obj || {})) { const nv = v * 0.98; if (nv > 0.05) o[k] = nv; }
    return o;
  };
  s.satGenre = coolSat(s.satGenre);
  s.satTopic = coolSat(s.satTopic);

  // --- IP world ---
  // Your IP fatigue cools off over time
  const ips = {};
  for (const [k, ip] of Object.entries(s.ips || {})) {
    ips[k] = ip.fatigue > 0 ? { ...ip, fatigue: Math.max(0, ip.fatigue - 0.6) } : ip;
  }
  s.ips = ips;

  // The rest of the industry keeps moving
  s = simulateRivals(s, year);

  // Listings expire
  s.market = s.market.map(m => ({ ...m, weeksLeft: m.weeksLeft - 1 })).filter(m => {
    if (m.weeksLeft > 0) return true;
    if (m.buyback) s.log = pushLog(s, `The window closed — "${m.ip.name}" is off the market for now.`);
    return false;
  });

  // Fresh contract offers roll in periodically (applicants no longer appear
  // on their own — recruiting is a deliberate action on the Team tab)
  if (s.week % 10 === 0) {
    const rivalNames = activeRivals(s).map(r => r.name);
    const offers = [makeContract(year, rivalNames), makeContract(year, rivalNames)];
    if (Math.random() < 0.5) offers.push(makeContract(year, rivalNames));
    s.contracts = { ...s.contracts, offers };
  }

  // Random event
  if (!s.event && Math.random() < 0.07 && s.week > 6) {
    const eligible = EVENTS.filter(e => !e.cond || e.cond(s));
    if (eligible.length) s.event = pick(eligible);
  }

  // Trend cycles: something is always about to be the next big thing
  if (s.trend && s.week >= s.trend.endWeek) {
    s.log = pushLog(s, `📉 The ${trendLabel(s.trend)} craze has cooled off. Back to business as usual.`);
    s.trend = null;
    s.nextTrendWeek = s.week + ri(10, 26);
  }
  if (!s.trend && s.week >= (s.nextTrendWeek ?? 0)) {
    const type = Math.random() < 0.65 ? "topic" : "genre";
    const id = type === "topic" ? pick(TOPICS.filter(t => t.yr <= year)).id : pick(GENRES).id;
    s.trend = { type, id, endWeek: s.week + ri(52, 100) };
    s.log = pushLog(s, `📈 Trend alert: ${trendLabel(s.trend)} is blowing up. Matching releases will sell ~45% better while it lasts.`);
  }

  // New year: unlock notices + Year in Review
  const wkOfYear = s.week % 52; // 0-indexed
  if (wkOfYear === 0 && s.week > 0) {
    const fresh = TOPICS.filter(t => t.yr === year);
    if (fresh.length) {
      s.log = pushLog(s, `💡 New trends for ${year}: ${fresh.map(t => t.name).join(", ")} ${fresh.length > 1 ? "are" : "is"} now on the greenlight board.`);
    }
    const prevYear = year - 1;
    const ys = s.yearStats || { revenue: 0, fansStart: 0, repStart: 50, topRival: null, lastRevenue: 0 };
    const yearGames = s.released.filter(g => g.year === prevYear);
    const bestGame = yearGames.length ? yearGames.reduce((a, b) => (b.score > a.score ? b : a)) : null;
    s.yearReview = {
      year: prevYear,
      revenue: Math.round(ys.revenue || 0),
      lastRevenue: Math.round(ys.lastRevenue || 0),
      releases: yearGames.length,
      best: bestGame ? { name: bestGame.name, score: bestGame.score } : null,
      awardsWon: (s.awards || []).filter(a => a.year === prevYear).length,
      fansGained: s.fans - (ys.fansStart ?? s.fans),
      repDelta: Math.round((s.rep ?? 50) - (ys.repStart ?? 50)),
      topRival: ys.topRival || null,
    };
    s.yearStats = { revenue: 0, lastRevenue: ys.revenue || 0, fansStart: s.fans, repStart: s.rep ?? 50, topRival: null };
  }
  // PixelCon rolls into town mid-year
  if (wkOfYear === 25 && !s.convention) {
    s.convention = { year };
    s.log = pushLog(s, `🎪 PixelCon ${year} opens this week. Decide how big to go.`);
  }

  // Awards night closes out the year
  if (wkOfYear === 51) {
    s = runAwards({ ...s }, year);
  }

  // New platform announcements
  const arriving = PLATFORMS.find(p => p.yr === year && s.week % 52 === 0);
  if (arriving) s.log = pushLog(s, `📺 New hardware: the ${arriving.name} launches this year. ${arriving.blurb}`);

  // Bankruptcy: the leash scales with your payroll — a garage can limp along
  // at −$15K, a campus with a big payroll gets proportionally more rope.
  const debtLimit = -(15000 + (salaries + rent) * 8);
  if (s.money < debtLimit) {
    if (!s.loanUsed && !s.bankOffer) {
      const bail = Math.round(25000 + (salaries + rent) * 10);
      s.bankOffer = { bail, weekly: Math.round((bail * 1.4) / 52) };
      s.log = pushLog(s, "🏦 The bank called. One lifeline on the table — take it or close the doors.");
    } else if (s.loanUsed && !s.bankOffer) {
      s.gameOver = true;
      s.log = pushLog(s, "The bank called again. There is no second lifeline. The studio's doors are closed.");
    }
  }

  return s;
}

// ---------- UI PRIMITIVES ----------

const C = {
  bg: "#1A1633", panel: "#262047", panelHi: "#2F2857", line: "#3D3470",
  ink: "#EFEAF7", dim: "#9C93C4",
  mag: "#FF3E8A", cyan: "#37D6E0", gold: "#FFC53D", green: "#4ADE80", red: "#FF6B6B",
  box: "#DDD9D0", boxInk: "#26223B",
};

function Btn({ children, onClick, kind = "solid", color = C.mag, disabled, style, small }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        fontFamily: "'Rubik', sans-serif",
        fontWeight: 700,
        fontSize: small ? 15 : 17,
        padding: small ? "10px 16px" : "14px 22px",
        minHeight: small ? 40 : 52,
        borderRadius: 14,
        border: kind === "ghost" ? `2px solid ${C.line}` : "none",
        background: disabled ? C.line : kind === "ghost" ? "transparent" : color,
        color: disabled ? C.dim : kind === "ghost" ? C.ink : "#1A1633",
        cursor: disabled ? "default" : "pointer",
        touchAction: "manipulation",
        transition: "transform .08s",
        ...style,
      }}
      onPointerDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(.96)"; }}
      onPointerUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

function Panel({ children, style, title, accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18, ...style }}>
      {title && (
        <div style={{ fontFamily: "'Bungee', cursive", fontSize: 15, letterSpacing: 1, color: accent || C.cyan, marginBottom: 12 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center", minWidth: 90 }}>
      <div style={{ fontFamily: "'Bungee', cursive", fontSize: 19, color: color || C.ink, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ScoreSticker({ score, size = 54 }) {
  const col = score >= 80 ? C.gold : score >= 60 ? C.cyan : score >= 40 ? C.dim : C.red;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `radial-gradient(circle at 30% 30%, #fff8, transparent 60%), ${col}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Bungee', cursive", fontSize: size * 0.38, color: "#1A1633",
      boxShadow: "0 2px 6px #0006", border: "2px solid #ffffff55",
    }}>
      {score}
    </div>
  );
}

function Stars({ value, size = 20 }) {
  // value in 0–5, half-star steps
  return (
    <div style={{ display: "inline-flex", gap: 2 }} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, value - i)); // 0, .5, or 1
        return (
          <div key={i} style={{ position: "relative", width: size, height: size, fontSize: size, lineHeight: 1 }}>
            <span style={{ position: "absolute", inset: 0, color: "#4A4280" }}>★</span>
            <span style={{ position: "absolute", inset: 0, color: C.gold, overflow: "hidden", width: `${fill * 100}%` }}>★</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- MAIN COMPONENT ----------

export default function PixelEmpire() {
  const [s, setS] = useState(null);           // null = loading
  const [mode, setMode] = useState("boot");   // boot | title | setup | play
  const [setup, setSetup] = useState({ studio: "", founder: "" });
  const [launchCard, setLaunchCard] = useState(null); // release results modal
  const saveTimer = useRef(null);

  // Boot: check for save
  useEffect(() => {
    (async () => {
      const save = await loadGame();
      if (save) setS(save);
      setMode("title");
    })();
  }, []);

  // Autosave (debounced)
  useEffect(() => {
    if (mode !== "play" || !s) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveGame(s), 600);
  }, [s, mode]);

  const update = fn => setS(prev => fn(prev));

  // ---- actions ----
  const nextWeek = () => update(prev => tick(prev));

  const hire = cand => update(prev => {
    if (prev.staff.length >= OFFICES[prev.office].cap) return prev;
    const signing = cand.salary * 4;
    if (prev.money < signing) return prev;
    // New hires join the smaller team once Team B exists — no more everyone piling onto A
    let team = "A";
    if (prev.office >= 3) {
      const a = prev.staff.filter(m => (m.team || "A") === "A").length;
      const b = prev.staff.filter(m => m.team === "B").length;
      team = b < a ? "B" : "A";
    }
    return {
      ...prev,
      money: prev.money - signing,
      staff: [...prev.staff, { ...cand, team }],
      candidates: prev.candidates.filter(c => c.id !== cand.id),
      log: pushLog(prev, `Hired ${cand.name} (${cand.role}) — signing bonus ${money$(signing)}.${prev.office >= 3 ? ` Assigned to Team ${team}.` : ""}`),
    };
  });

  const fire = id => update(prev => ({
    ...prev,
    staff: prev.staff.filter(m => m.id !== id),
    leadId: prev.leadId === id ? "founder" : prev.leadId, // the founder steps back in as lead
    morale: Math.max(30, prev.morale - 8),
    log: pushLog(prev, prev.leadId === id
      ? "You let your lead go. The founder is running point again."
      : "You let a team member go. The office is quieter."),
  }));

  const buyTech = t => update(prev => {
    if (prev.rp < t.cost || prev.tech.includes(t.id)) return prev;
    if (t.req && !prev.tech.includes(t.req)) return prev;
    if (t.yr && yearOf(prev.week) < t.yr) return prev;
    return { ...prev, rp: prev.rp - t.cost, tech: [...prev.tech, t.id], log: pushLog(prev, `Research complete: ${t.name}.`) };
  });

  const upgradeOffice = () => update(prev => {
    const next = OFFICES[prev.office + 1];
    if (!next || prev.money < next.cost) return prev;
    return { ...prev, money: prev.money - next.cost, office: prev.office + 1, log: pushLog(prev, `Moved into the ${next.name}! Room for ${next.cap} people.`) };
  });

const slotOf = team => (team === "B" ? "projectB" : "project");

  const startProject = draft => update(prev => {
    const size = SIZES.find(z => z.id === draft.size);
    const plat = platById(draft.platform);
    const remakeDisc = draft.remakeOf ? (draft.remakeOf.mode === "remaster" ? 0.4 : 0.85) : 1;
    const engFee = draft.engine && draft.engine.startsWith("lic:") ? (resolveEngine(prev, draft.engine)?.perGame || 0) : 0;
    const cost = Math.round(size.cost * (draft.ip ? 0.75 : 1) * remakeDisc) + effLicense(prev, plat, prev.week) + engFee; // IP entries and remakes reuse assets
    const slot = slotOf(draft.team || "A");
    if (prev.money < cost || prev[slot]) return prev;
    const startHype = (draft.ip ? Math.min(40, Math.round(draft.ip.fans / 100)) : 0) + (draft.remakeOf ? 15 : 0);
    const advance = draft.pubDeal ? draft.pubDeal.advance : 0;
    const exclFund = draft.exclusive ? Math.round(size.cost * 0.5 * (1 + (((prev.holders || {})[plat.holder]?.rel ?? 50)) / 100)) : 0;
    return {
      ...prev,
      money: prev.money - cost + advance + exclFund,
      tab: "dev",
      [slot]: (() => {
        const totalWork = Math.round(size.weeks * workScale(plat.tech) * (draft.remakeOf?.mode === "remaster" ? 0.45 : 1));
        return {
          ...draft, team: draft.team || "A", points: size.points,
          progress: 0, totalWeeks: totalWork, maxWeekly: totalWork / size.minWeeks,
          bugs: 0, hype: Math.min(100, startHype), vision: 0, crunch: false, stage: "pre",
        };
      })(),
      log: pushLog(prev, draft.pubDeal
        ? `Development begins on "${draft.name}" — published by ${draft.pubDeal.name}. Advance: ${money$(draft.pubDeal.advance)}. They keep 65% of revenue${draft.pubDeal.ipRights ? "" : " — and the IP, if this becomes one"}.`
        : draft.remakeOf
        ? `Development begins on "${draft.name}" — a remake of the ${draft.remakeOf.year} classic, for ${plat.name}. Nostalgia is a double-edged sword.`
        : draft.ip
        ? `Development begins on "${draft.name}" — entry #${draft.ip.entryNo} under the ${draft.ip.name} IP, a ${genreById(draft.genre).name} for ${plat.name}.`
        : `Development begins on "${draft.name}" — ${genreById(draft.genre).name} / ${topicById(draft.topic).name} for ${plat.name}.`),
    };
  });

  const marketPush = (team = "A") => update(prev => {
    const slot = slotOf(team);
    if (!prev[slot] || prev.money < 1500) return prev;
    const boost = prev.tech.includes("mktdpt") ? 18 : 12;
    return {
      ...prev,
      money: prev.money - 1500,
      [slot]: { ...prev[slot], hype: Math.min(100, (prev[slot].hype || 0) + boost) },
      log: pushLog(prev, `Marketing push! Hype +${boost}.`),
    };
  });

  const setLive = (team, on) => update(prev => {
    const slot = slotOf(team);
    return prev[slot] ? { ...prev, [slot]: { ...prev[slot], live: on } } : prev;
  });

  const toggleCrunch = team => update(prev => {
    const slot = slotOf(team);
    if (!prev[slot]) return prev;
    const on = !prev[slot].crunch;
    return {
      ...prev,
      [slot]: { ...prev[slot], crunch: on },
      log: pushLog(prev, on ? `🔥 Crunch begins on "${prev[slot].name}". The pizza budget just tripled.` : `Crunch called off on "${prev[slot].name}". The team exhales.`),
    };
  });

  const releaseGame = (team = "A") => update(prev => {
    const slot = slotOf(team);
    const p = prev[slot];
    if (!p) return prev;
    const score = computeScore(prev, p);
    // A publisher's logo on the box is distribution: sales calculate as if you
    // had at least their reach in fans — but they keep 65% of revenue.
    const salesState = p.pubDeal ? { ...prev, fans: Math.max(prev.fans, p.pubDeal.floor) } : prev;
    let { weeklyBase, weeksLeft, trendy, mkt } = launchSales(salesState, p, score);
    if (p.pubDeal) weeklyBase *= p.pubDeal.share;
    const priceTier = PRICE_TIERS.find(t => t.id === (p.price || "std")) || PRICE_TIERS[1];
    const fanMult = (prev.tech.includes("fanclub") ? 1.5 : 1) * (trendy ? 1.25 : 1) * priceTier.fans;
    const fanGain = Math.round(Math.pow(score / 10, 2.4) * 6 * fanMult);
    // Reputation moves with quality
    let repDelta = score >= 85 ? 4 : score >= 70 ? 2 : score < 40 ? -4 : 0;
    if (p.bugs > 8) repDelta -= 2; // shipping broken gets remembered
    const reviews = REVIEWERS.map(r => ({
      outlet: r,
      score: Math.max(5, Math.min(99, score + ri(-6, 6))),
      quote: pick(score >= 75 ? QUOTES.hi : score >= 50 ? QUOTES.mid : QUOTES.lo),
    }));
    const eng = resolveEngine(prev, p.engine);
    const rec = {
      id: Math.random().toString(36).slice(2),
      name: p.name, genre: p.genre, topic: p.topic, platform: p.platform,
      alloc: { ...p.alloc }, size: p.size, // blueprint for future sequels
      trendy, reviews, engineName: eng ? eng.name : null, priceTier: p.price || "std",
      exclusive: p.exclusive ? platById(p.platform)?.holder || true : false,
      remake: !!p.remakeOf,
      score, salesTotal: 0, weeklyBase, weeksLeft, weeksTotal: weeksLeft,
      year: yearOf(prev.week),
      hue: ri(0, 360),
    };
    if (p.live) { rec.live = true; rec.health = 100; rec.weeksLeft = 0; rec.weeksTotal = 1; }
    // Remakes are judged against the legend, not the original
    let remakeLog = null;
    let remakeOutcome = null; // "triumph" | "solid" | "botched"
    if (p.remakeOf) {
      const kind = p.remakeOf.mode === "remaster" ? "remaster" : "remake";
      rec.remakeMode = kind;
      const bar = p.remakeOf.expectation ?? p.remakeOf.score;
      // Remasters get a gentler bar — fans just want the classic done right
      const effBar = kind === "remaster" ? bar - 5 : bar;
      if (score >= effBar) {
        remakeOutcome = "triumph";
        rec.weeklyBase = weeklyBase * (kind === "remaster" ? 1.25 : 1.5);
        remakeLog = `🎊 The "${p.remakeOf.name}" ${kind} lives up to the legend (${score} vs the ${bar} fans expected). ${kind === "remake" ? "This is how it's done." : "A classic, done right."}`;
      } else if (score >= effBar - 8) {
        remakeOutcome = "solid";
        rec.weeklyBase = weeklyBase * 1.15;
        remakeLog = `The "${p.remakeOf.name}" ${kind} is solid, if not the second coming fans hoped for (${score} vs ${bar} expected).`;
      } else {
        remakeOutcome = "botched";
        rec.weeklyBase = weeklyBase * 0.6;
        rec.weeksLeft = Math.max(3, Math.round(rec.weeksLeft * 0.6));
        rec.weeksTotal = rec.weeksLeft;
        remakeLog = `💣 The "${p.remakeOf.name}" ${kind} is getting review-bombed (${score} vs the ${bar} fans expected). "Cash grab" is trending.`;
      }
    }
    if (remakeOutcome === "triumph") repDelta += 2;
    if (remakeOutcome === "botched") repDelta -= 3;

    // IP bookkeeping
    let ips = { ...(prev.ips || {}) };
    let frLog = null;
    if (p.ip && ips[p.ip.ipId]) {
      const ip = ips[p.ip.ipId];
      rec.ipId = ip.id;
      rec.entryNo = ip.entries + 1;
      rec.hue = ip.hue; // entries share the IP's box color

      const expectation = ip.lastScore;
      const newFansEarned = Math.round(Math.pow(score / 10, 2.2) * 40);
      let fans = ip.fans;
      if (score >= expectation - 3) {
        fans += newFansEarned;
        frLog = score > expectation
          ? `"${rec.name}" outdid the last ${ip.name} game (${score} vs ${expectation}). The faithful are thrilled.`
          : `"${rec.name}" lived up to the ${ip.name} name.`;
      } else if (score < expectation - 8) {
        fans = Math.round(fans * 0.7);
        frLog = `"${rec.name}" fell short of ${ip.name} expectations (${score} vs ${expectation}). Some fans walked away.`;
      } else {
        fans += Math.round(newFansEarned * 0.4);
        frLog = `"${rec.name}" was a modest ${ip.name} entry.`;
      }
      ips[ip.id] = {
        ...ip,
        entries: ip.entries + 1, fans,
        fatigue: Math.min(100, ip.fatigue + 25),
        lastScore: score, bestScore: Math.max(ip.bestScore, score), lastWeek: prev.week,
      };
    } else if (!p.ip) {
      const ip = {
        id: rec.id, name: rec.name, entries: 1,
        fans: Math.round(Math.pow(score / 10, 2.2) * 25),
        fatigue: 15, lastScore: score, bestScore: score, lastWeek: prev.week, hue: rec.hue,
      };
      if (p.pubDeal && !p.pubDeal.ipRights) {
        // The classic knife: the publisher funded it, the publisher owns it
        frLog = `📜 "${rec.name}" is now a registered IP — and per your deal, ${p.pubDeal.name} owns it. Buying it back won't be cheap.`;
      } else {
        // Every original registers as new IP you own
        ips[ip.id] = ip;
        rec.ipId = ip.id;
        rec.entryNo = 1;
        frLog = `📜 "${rec.name}" is now a registered IP. Build on it in any genre — or sell it when the stars are high.`;
      }
      var pubKeptIp = p.pubDeal && !p.pubDeal.ipRights ? { ...ip, publisher: p.pubDeal.name } : null;
    }

    if (remakeOutcome && rec.ipId && ips[rec.ipId]) {
      const ip = ips[rec.ipId];
      if (remakeOutcome === "triumph") ips[rec.ipId] = { ...ip, fans: Math.round(ip.fans * 1.2) };
      if (remakeOutcome === "botched") ips[rec.ipId] = { ...ip, fans: Math.round(ip.fans * 0.8), fatigue: Math.min(100, ip.fatigue + 15) };
    }
    // Platform holder remembers who showed up — especially at launch
    let holders = prev.holders || {};
    let holderLog = null;
    const platObj = platById(p.platform);
    if (platObj?.holder) {
      const hRel0 = holders[platObj.holder]?.rel ?? 50;
      let hD = score >= 70 ? 2 : 1;
      if (p.exclusive) hD += score >= 70 ? 8 : 3;
      const platAge = 1984 + prev.week / 52 - platObj.yr;
      if (platAge <= 1 && hRel0 >= 60) {
        holderLog = `🎮 ${platObj.holder} paid a ${money$(8000)} launch-window bonus for supporting the ${platObj.name} early. Loyalty is remembered.`;
        hD += 4;
      }
      holders = { ...holders, [platObj.holder]: { rel: Math.max(0, Math.min(100, hRel0 + hD)) } };
    }
    const launchBonus = holderLog ? 8000 : 0;

    // Settle with the publisher: relationships remember everything
    let pubLog = null, clawback = 0, publishers = prev.publishers;
    if (p.pubDeal) {
      rec.pubName = p.pubDeal.name;
      const rel0 = publishers?.[p.pubDeal.name]?.rel ?? 50;
      let relD;
      if (score < 55) {
        clawback = Math.round(p.pubDeal.advance * 0.5);
        relD = -20;
        pubLog = `📮 "${rec.name}" missed ${p.pubDeal.name}'s score guarantee (${score} < 55). They clawed back ${money$(clawback)} of the advance — and they're furious.`;
      } else if (score >= 75) {
        relD = 10;
        pubLog = `📮 ${p.pubDeal.name} is thrilled with "${rec.name}" — expect a better advance next time.`;
      } else {
        relD = 3;
      }
      publishers = { ...publishers, [p.pubDeal.name]: { rel: Math.max(0, Math.min(100, rel0 + relD)) } };
    }
    setLaunchCard({ game: rec, reviews });
    // Your release crowds the market too
    const satS = { satGenre: prev.satGenre, satTopic: prev.satTopic };
    bumpSaturation(satS, p.genre, p.topic);
    let out = {
      ...prev,
      satGenre: satS.satGenre,
      satTopic: satS.satTopic,
      ips,
      publishers,
      pubIps: (typeof pubKeptIp !== "undefined" && pubKeptIp) ? [...(prev.pubIps || []), pubKeptIp] : (prev.pubIps || []),
      money: prev.money - clawback + launchBonus,
      holders,
      [slot]: null,
      released: [rec, ...prev.released],
      fans: prev.fans + fanGain,
      rep: Math.max(0, Math.min(100, (prev.rep ?? 50) + repDelta)),
      rp: prev.rp + Math.round(score / 8),
      gameCount: prev.gameCount + 1,
      bestScore: Math.max(prev.bestScore, score),
      morale: Math.max(30, Math.min(100, prev.morale + (score >= 70 ? 8 : score >= 50 ? 2 : -6) + (remakeOutcome === "botched" ? -5 : 0))),
      log: pushLog(prev, `🎉 "${p.name}" released! Critics: ${score}/100. +${fanGain.toLocaleString()} fans.${trendy ? ` 🔥 Launched right on the ${trendLabel(prev.trend)} wave — sales boosted.` : ""}`),
    };
    // A triumphant remake sends the original back up the charts
    if (remakeOutcome === "triumph") {
      out.released = out.released.map(g => {
        if (g.id !== p.remakeOf.id || g.live) return g;
        return { ...g, weeksLeft: 6, weeksTotal: 6, weeklyBase: g.weeklyBase * 0.25 };
      });
      out.log = pushLog(out, `📀 The original "${p.remakeOf.name}" is back on the charts — legacy sales incoming.`);
    }
    if (frLog) out.log = pushLog(out, frLog);
    if (remakeLog) out.log = pushLog(out, remakeLog);
    if (mkt <= 0.85) out.log = pushLog(out, `🥵 The market is flooded with ${genreById(p.genre).name.toLowerCase()} / ${topicById(p.topic).name.toLowerCase()} games right now — sales take a ${Math.round((1 - mkt) * 100)}% haircut.`);
    if (mkt >= 1.05) out.log = pushLog(out, `🌱 Nobody's been making ${genreById(p.genre).name.toLowerCase()} games — starved buyers pay a premium.`);
    if (rec.live) out.log = pushLog(out, `🌐 "${rec.name}" launched as a live-service game — weekly revenue as long as you keep it healthy.`);
    if (pubLog) out.log = pushLog(out, pubLog);
    if (holderLog) out.log = pushLog(out, holderLog);
    return out;
  });

  const attendConvention = tier => update(prev => {
    if (!prev.convention) return prev;
    if (!tier) {
      return { ...prev, convention: null, log: pushLog(prev, `You skipped PixelCon ${prev.convention.year}.`) };
    }
    if (prev.money < tier.cost) return prev;
    let next = {
      ...prev,
      convention: null,
      money: prev.money - tier.cost,
      fans: prev.fans + tier.fansFlat + Math.round(prev.fans * tier.fansPct),
      rp: prev.rp + tier.rp,
      rep: Math.min(100, (prev.rep ?? 50) + (tier.id === "keynote" ? 2 : 0)),
      morale: Math.min(100, prev.morale + 4),
    };
    if (next.project) next.project = { ...next.project, hype: Math.min(100, (next.project.hype || 0) + tier.hype) };
    let msg = `🎪 PixelCon ${prev.convention.year}: the ${tier.name.toLowerCase()} drew a crowd. +${tier.rp} RP` + (prev.project ? `, +${tier.hype} hype` : "") + ".";
    if (tier.star > 0 && Math.random() < tier.star) {
      const star = makeCandidate(yearOf(prev.week));
      star.code = Math.min(10, star.code + 2); star.design = Math.min(10, star.design + 2);
      star.art = Math.min(10, star.art + 2); star.sound = Math.min(10, star.sound + 2);
      star.salary = 80 + (star.code + star.design + star.art + star.sound) * 22;
      star.role = "Industry Veteran";
      next.candidates = [star, ...next.candidates].slice(0, 4);
      msg += ` A big name stopped by your booth — ${star.name} is in your applicant pool.`;
    }
    next.log = pushLog(next, msg);
    return next;
  });

  const acceptContract = offer => update(prev => {
    if (prev.contracts.active) return prev;
    return {
      ...prev,
      contracts: { offers: prev.contracts.offers.filter(o => o.id !== offer.id), active: offer },
      log: pushLog(prev, `📝 Signed on: ${offer.job.toLowerCase()} for ${offer.client} — ${money$(offer.pay)} on delivery, ${offer.deadline} weeks.`),
    };
  });

  const abandonContract = () => update(prev => {
    if (!prev.contracts.active) return prev;
    const c = prev.contracts.active;
    return {
      ...prev,
      morale: Math.max(30, prev.morale - 3),
      contracts: { ...prev.contracts, active: null },
      log: pushLog(prev, `Walked away from ${c.client}'s ${c.job.toLowerCase()}. They won't forget quickly.`),
    };
  });

  const recruitAd = () => update(prev => {
    const yr = yearOf(prev.week);
    const cost = Math.round(400 * (1 + (yr - 1984) * 0.06) * (prev.tech.includes("talent") ? 0.7 : 1));
    if (prev.money < cost) return prev;
    const glow = c => { // a strong reputation attracts better people
      if ((prev.rep ?? 50) < 70) return c;
      const k1 = pick(["code","design","art","sound"]), k2 = pick(["code","design","art","sound"]);
      return { ...c, [k1]: Math.min(10, c[k1] + 1), [k2]: Math.min(10, c[k2] + 1) };
    };
    const fresh = [makeCandidate(yr), makeCandidate(yr), makeCandidate(yr)].map(glow);
    return {
      ...prev,
      money: prev.money - cost,
      candidates: [...fresh, ...prev.candidates].slice(0, 6),
      log: pushLog(prev, `Posted a job ad (${money$(cost)}) — three applicants responded.`),
    };
  });

  const recruitHeadhunter = () => update(prev => {
    const yr = yearOf(prev.week);
    const cost = Math.round(2500 * (1 + (yr - 1984) * 0.06) * (prev.tech.includes("talent") ? 0.7 : 1));
    if (prev.money < cost) return prev;
    const senior = () => {
      const c = makeCandidate(yr);
      c.code = Math.min(10, c.code + ri(1, 3)); c.design = Math.min(10, c.design + ri(1, 3));
      c.art = Math.min(10, c.art + ri(1, 3)); c.sound = Math.min(10, c.sound + ri(1, 3));
      c.role = "Senior " + c.role;
      c.salary = Math.round((80 + (c.code + c.design + c.art + c.sound) * 22) * 1.15);
      return c;
    };
    return {
      ...prev,
      money: prev.money - cost,
      candidates: [senior(), senior(), ...prev.candidates].slice(0, 6),
      log: pushLog(prev, `The headhunter (${money$(cost)}) came back with two senior candidates.`),
    };
  });

  const poachRival = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r || r.defunct || !r.active) return prev;
    const cost = Math.round((1500 + r.prestige * 0.12 + r.skill * 40) * (prev.tech.includes("talent") ? 0.7 : 1));
    if (prev.money < cost) return prev;
    const base = Math.max(3, Math.min(10, Math.round(r.skill / 9)));
    const stat = () => Math.max(1, Math.min(10, ri(base - 1, base + 1)));
    const c = {
      id: Math.random().toString(36).slice(2),
      name: pick(FIRST) + " " + pick(LAST),
      role: `Ex-${r.name.split(" ")[0]} Veteran`,
      code: stat(), design: stat(), art: stat(), sound: stat(),
      xp: 0, level: 1, energy: 100, resting: false,
      trait: Math.random() < 0.5 ? pick(Object.keys(TRAITS)) : null,
    };
    c.salary = Math.round((80 + (c.code + c.design + c.art + c.sound) * 22) * 1.35);
    return {
      ...prev,
      money: prev.money - cost,
      candidates: [c, ...prev.candidates].slice(0, 6),
      rivals: { ...prev.rivals, [rivalId]: { ...r, prestige: Math.max(0, r.prestige - 150) } },
      log: pushLog(prev, `🕵 Poached ${c.name} out of ${r.name} for ${money$(cost)}. They're in your applicant pool — and ${r.name} noticed.`),
    };
  });

  const toggleRest = id => update(prev => ({
    ...prev,
    staff: prev.staff.map(m => m.id === id ? { ...m, resting: !m.resting } : m),
  }));

  const setLead = id => update(prev => ({ ...prev, leadId: id }));

  const setPrice = (team, tierId) => update(prev => {
    const slot = slotOf(team);
    return prev[slot] ? { ...prev, [slot]: { ...prev[slot], price: tierId } } : prev;
  });

  const assignTeam = id => update(prev => ({
    ...prev,
    staff: prev.staff.map(m => m.id === id ? { ...m, team: (m.team || "A") === "A" ? "B" : "A" } : m),
  }));

  const liveUpdate = gameId => update(prev => {
    const g = prev.released.find(x => x.id === gameId);
    const cost = Math.round(3000 * (1 + Math.max(0, yearOf(prev.week) - 2010) * 0.05));
    if (!g || !g.live || g.sunset || prev.money < cost) return prev;
    return {
      ...prev,
      money: prev.money - cost,
      released: prev.released.map(x => x.id === gameId ? { ...x, health: Math.min(100, (x.health ?? 0) + 30) } : x),
      log: pushLog(prev, `🌐 Content update shipped for "${g.name}" — the player base is buzzing again.`),
    };
  });

  const sunsetLive = gameId => update(prev => {
    const g = prev.released.find(x => x.id === gameId);
    if (!g || !g.live || g.sunset) return prev;
    return {
      ...prev,
      released: prev.released.map(x => x.id === gameId ? { ...x, sunset: true, health: 0 } : x),
      fans: prev.fans + 200,
      log: pushLog(prev, `🌐 "${g.name}" servers sunset with a farewell event. The community salutes.`),
    };
  });

  const portGame = (gameId, platId) => update(prev => {
    const g = prev.released.find(x => x.id === gameId);
    const target = platById(platId);
    if (!g || !target || g.live || g.port) return prev;
    if (g.exclusive) return prev; // exclusivity deals are forever
    if ((g.portedTo || []).includes(platId) || g.platform === platId) return prev;
    const year2 = yearOf(prev.week);
    const size = SIZES.find(z => z.id === g.size) || SIZES[0];
    const cost = Math.round(size.cost * 0.3 * (1 + (year2 - 1984) * 0.03)) + Math.round(effLicense(prev, target, prev.week) * 0.5);
    if (prev.money < cost) return prev;
    const orig = platById(g.platform);
    const shareRatio = Math.max(0.3, Math.min(1.5, platShareNow(prev, target, prev.week) / Math.max(0.05, orig.share)));
    let portWeekly = g.weeklyBase * 0.45 * shareRatio;
    if (target.tech > orig.tech + 1) portWeekly *= 0.8; // it shows its age on stronger hardware
    const weeks = ri(8, 12);
    const rec = {
      ...g,
      id: Math.random().toString(36).slice(2),
      name: `${g.name} (${target.name})`,
      platform: platId, port: true, portedTo: undefined, rereleased: true, goty: false,
      weeklyBase: portWeekly, weeksLeft: weeks, weeksTotal: weeks, salesTotal: 0,
      year: year2, live: false, health: undefined, sunset: undefined,
    };
    // Holder likes seeing your catalog arrive
    let holders = prev.holders || {};
    if (target.holder) {
      const r0 = holders[target.holder]?.rel ?? 50;
      holders = { ...holders, [target.holder]: { rel: Math.min(100, r0 + 1) } };
    }
    return {
      ...prev,
      money: prev.money - cost,
      holders,
      released: [rec, ...prev.released.map(x => x.id === gameId ? { ...x, portedTo: [...(x.portedTo || []), platId] } : x)],
      log: pushLog(prev, `🔀 Ported "${g.name}" to the ${target.name} for ${money$(cost)} — a fresh audience, a fresh tail.`),
    };
  });

  const rerelease = gameId => update(prev => {
    const g = prev.released.find(x => x.id === gameId);
    const yr = yearOf(prev.week);
    const cost = Math.round(2000 * (1 + (yr - 1984) * 0.05));
    if (!g || g.rereleased || g.weeksLeft > 0 || g.score < 70 || yr - g.year < 2 || prev.money < cost) return prev;
    return {
      ...prev,
      money: prev.money - cost,
      fans: prev.fans + 100,
      released: prev.released.map(x => x.id === gameId
        ? { ...x, rereleased: true, weeksLeft: 8, weeksTotal: 8, weeklyBase: x.weeklyBase * 0.35 }
        : x),
      log: pushLog(prev, `💿 "${g.name}" is back on shelves as a Greatest Hits budget re-release.`),
    };
  });

  const buyEngineTech = t => update(prev => {
    if (prev.rp < t.cost || prev.engineTechs.includes(t.id)) return prev;
    if (t.req && !prev.engineTechs.includes(t.req)) return prev;
    if (t.yr && yearOf(prev.week) < t.yr) return prev;
    return { ...prev, rp: prev.rp - t.cost, engineTechs: [...prev.engineTechs, t.id], log: pushLog(prev, `🔬 Engine tech researched: ${t.name}. Build it into an engine to use it.`) };
  });

  const buildEngine = name => update(prev => {
    const clean = (name || "").trim();
    if (!clean || !prev.engineTechs.length) return prev;
    const power = enginePowerFromParts(prev.engineTechs);
    const cost = 3000 + power * 150;
    if (prev.money < cost) return prev;
    const eng = {
      id: Math.random().toString(36).slice(2),
      name: clean, version: 1, parts: [...prev.engineTechs],
      builtWeek: prev.week, licensed: false, licensees: 0,
    };
    return {
      ...prev,
      money: prev.money - cost,
      engines: [...prev.engines, eng],
      log: pushLog(prev, `🔧 Built ${clean} v1 for ${money$(cost)} — power ${power}. Select it when greenlighting a game.`),
    };
  });

  const updateEngine = engineId => update(prev => {
    const e = prev.engines.find(x => x.id === engineId);
    if (!e) return prev;
    const newParts = prev.engineTechs.filter(p => !e.parts.includes(p));
    if (!newParts.length) return prev;
    const added = enginePowerFromParts([...e.parts, ...newParts]) - enginePowerFromParts(e.parts);
    const cost = 1500 + Math.max(0, added) * 150;
    if (prev.money < cost) return prev;
    return {
      ...prev,
      money: prev.money - cost,
      engines: prev.engines.map(x => x.id === engineId
        ? { ...x, parts: [...x.parts, ...newParts], version: x.version + 1 }
        : x),
      log: pushLog(prev, `🔧 ${e.name} updated to v${e.version + 1} for ${money$(cost)} — ${newParts.length} new technolog${newParts.length === 1 ? "y" : "ies"}, +${added} power.`),
    };
  });

  const toggleEngineLicense = engineId => update(prev => {
    const e = prev.engines.find(x => x.id === engineId);
    if (!e) return prev;
    return {
      ...prev,
      engines: prev.engines.map(x => x.id === engineId ? { ...x, licensed: !x.licensed, licensees: !x.licensed ? x.licensees : 0 } : x),
      log: pushLog(prev, e.licensed
        ? `${e.name} pulled from the licensing market — in-house only again.`
        : `🔧 ${e.name} v${e.version} is now open for licensing. Competitive engines attract royalty-paying studios.`),
    };
  });

  const licenseRivalEngine = offer => update(prev => {
    if (prev.money < offer.upfront) return prev;
    if ((prev.licensedEngines || []).some(l => l.id === offer.id)) return prev;
    return {
      ...prev,
      money: prev.money - offer.upfront,
      licensedEngines: [...prev.licensedEngines, offer],
      engineMarket: prev.engineMarket.filter(o => o.id !== offer.id),
      log: pushLog(prev, `🔧 Licensed ${offer.name} from ${offer.owner} for ${money$(offer.upfront)} — ${money$(offer.perGame)} per game built on it.`),
    };
  });

  const acceptLoan = () => update(prev => {
    if (!prev.bankOffer) return prev;
    return {
      ...prev,
      money: prev.money + prev.bankOffer.bail,
      loan: { weekly: prev.bankOffer.weekly, weeksLeft: 52 },
      loanUsed: true,
      bankOffer: null,
      log: pushLog(prev, `🏦 Took the lifeline: ${money$(prev.bankOffer.bail)} in, ${money$(prev.bankOffer.weekly)}/week out for a year. Ship something.`),
    };
  });

  const refuseLoan = () => update(prev => prev.bankOffer ? {
    ...prev,
    bankOffer: null,
    gameOver: true,
    log: pushLog(prev, "You refused the bank's terms. The studio's doors are closed."),
  } : prev);

  const resolveEvent = choice => update(prev => {
    const fx = prev.event[choice].fx;
    const after = fx(prev);
    return { ...after, event: null };
  });

  const renameIp = (ipId, newName) => update(prev => {
    const ip = prev.ips[ipId];
    const clean = (newName || "").trim();
    if (!ip || !clean || clean === ip.name) return prev;
    // If a game is mid-development under this IP, carry the rebrand through
    const project = prev.project?.ip?.ipId === ipId
      ? { ...prev.project, ip: { ...prev.project.ip, name: clean } }
      : prev.project;
    const projectB = prev.projectB?.ip?.ipId === ipId
      ? { ...prev.projectB, ip: { ...prev.projectB.ip, name: clean } }
      : prev.projectB;
    return {
      ...prev,
      ips: { ...prev.ips, [ipId]: { ...ip, name: clean } },
      project, projectB,
      log: pushLog(prev, `✎ Rebranded the "${ip.name}" IP as "${clean}". Past releases keep their titles; everything new carries the name.`),
    };
  });

  const sellIp = ipId => update(prev => {
    const ip = prev.ips[ipId];
    if (!ip) return prev;
    if (prev.project?.ip?.ipId === ipId || prev.projectB?.ip?.ipId === ipId) return prev; // can't sell mid-development
    const buyers = independentRivals(prev);
    if (!buyers.length) return { ...prev, log: pushLog(prev, "No studio is buying right now — the industry's a ghost town.") };
    // Prestigious studios have the deepest pockets
    const buyer = [...buyers].sort((a, b) => b.prestige - a.prestige)[Math.random() < 0.5 ? 0 : ri(0, buyers.length - 1)];
    const brokerCut = prev.tech.includes("iplaw") ? 1 : 0.9; // your lawyers keep the broker out of it
    const proceeds = Math.round(ipValue(ip, prev.week) * brokerCut);
    const ips = { ...prev.ips };
    delete ips[ipId];
    const soldIp = { ...ip, formerYours: true, owner: buyer.name, soldWeek: prev.week };
    return {
      ...prev,
      ips,
      money: prev.money + proceeds,
      rivals: { ...prev.rivals, [buyer.id]: { ...buyer, ips: [...buyer.ips, soldIp] } },
      log: pushLog(prev, `💰 Sold the "${ip.name}" IP to ${buyer.name} (${trajectoryOf(buyer)} studio) for ${money$(proceeds)}. Keep an eye out — it may come back on the market.`),
    };
  });

  // Core purchase logic, shared by direct buys and won bidding wars
  const executeBuy = (prev, listing, paid) => {
    const ip = { ...listing.ip };
    delete ip.owner; delete ip.soldWeek; delete ip.formerYours;
    let rivals = prev.rivals;
    const seller = listing.sellerId ? prev.rivals[listing.sellerId] : null;
    if (seller) {
      rivals = { ...rivals, [seller.id]: { ...seller, ips: seller.ips.filter(x => x.id !== ip.id) } };
    }
    return {
      ...prev,
      money: prev.money - paid,
      ips: { ...prev.ips, [ip.id]: ip },
      rivals,
      market: prev.market.filter(m => m.ip.id !== listing.ip.id),
      log: pushLog(prev, listing.buyback
        ? `🤝 Bought back the "${ip.name}" IP for ${money$(paid)}. Welcome home.`
        : `🤝 Acquired the "${ip.name}" IP${seller ? ` from ${seller.name}` : ""} for ${money$(paid)}. ${ip.fans.toLocaleString()} fans come with it.`),
    };
  };

  const buyIp = listing => update(prev => {
    const effPrice = Math.round(listing.price * (prev.tech.includes("iplaw") ? 0.95 : 1));
    if (prev.money < effPrice) return prev;
    // A rival may want it too
    const contenders = independentRivals(prev).filter(r => r.id !== listing.sellerId);
    if (contenders.length && Math.random() < 0.35) {
      const rival = pick(contenders);
      return {
        ...prev,
        bidWar: { listing, rival: { id: rival.id, name: rival.name }, yourBid: effPrice, counter: Math.round(effPrice * 1.15), round: 1 },
      };
    }
    return executeBuy(prev, listing, effPrice);
  });

  const raiseBid = () => update(prev => {
    const bw = prev.bidWar;
    if (!bw) return prev;
    const newBid = Math.round(bw.counter * 1.12);
    if (prev.money < newBid) return prev;
    // Each round the rival is likelier to fold; nobody goes past three
    if (bw.round >= 3 || Math.random() < 0.5 + bw.round * 0.18) {
      const bought = executeBuy({ ...prev, bidWar: null }, bw.listing, newBid);
      return { ...bought, log: pushLog(bought, `⚔ Won the bidding war — ${bw.rival.name} backed down at ${money$(newBid)}.`) };
    }
    return { ...prev, bidWar: { ...bw, yourBid: newBid, counter: Math.round(newBid * 1.15), round: bw.round + 1 } };
  });

  const walkAway = () => update(prev => {
    const bw = prev.bidWar;
    if (!bw) return prev;
    let rivals = prev.rivals;
    const seller = bw.listing.sellerId ? rivals[bw.listing.sellerId] : null;
    if (seller) rivals = { ...rivals, [seller.id]: { ...seller, ips: seller.ips.filter(x => x.id !== bw.listing.ip.id) } };
    const winner = rivals[bw.rival.id];
    if (winner) rivals = { ...rivals, [winner.id]: { ...winner, ips: [...winner.ips, { ...bw.listing.ip }] } };
    return {
      ...prev,
      bidWar: null,
      rivals,
      market: prev.market.filter(m => m.ip.id !== bw.listing.ip.id),
      log: pushLog(prev, `${bw.rival.name} outbid you for "${bw.listing.ip.name}" at ${money$(bw.counter)}.`),
    };
  });

  const buybackPubIp = pubIpId => update(prev => {
    const held = (prev.pubIps || []).find(x => x.id === pubIpId);
    if (!held) return prev;
    const price = Math.round(ipValue(held, prev.week) * 1.4);
    if (prev.money < price) return prev;
    const ip = { ...held };
    delete ip.publisher;
    return {
      ...prev,
      money: prev.money - price,
      ips: { ...prev.ips, [ip.id]: ip },
      pubIps: prev.pubIps.filter(x => x.id !== pubIpId),
      log: pushLog(prev, `🤝 Bought "${ip.name}" back from ${held.publisher} for ${money$(price)}. Expensive lesson — but it's yours now.`),
    };
  });

  const fundPitch = pitch => update(prev => {
    if (prev.money < pitch.ask) return prev;
    const title = rivalGameName();
    return {
      ...prev,
      money: prev.money - pitch.ask,
      pitches: prev.pitches.filter(x => x.id !== pitch.id),
      pubProjects: [...(prev.pubProjects || []), { ...pitch, title, done: prev.week + pitch.weeks }],
      log: pushLog(prev, `📮 Deal signed: funding ${pitch.studio}'s "${title}" (${pitch.concept}) for ${money$(pitch.ask)}. Shipping in ~${pitch.weeks} weeks under your label.`),
    };
  });

  // ---------- STUDIO M&A ----------

  const openTalks = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r || !r.active || r.defunct || r.ownedByYou) return prev;
    if (r.noTalksUntil && prev.week < r.noTalksUntil) return prev;
    return { ...prev, acqTalks: { rivalId, ask: acquisitionPrice(r, prev.week) } };
  });

  const cancelTalks = () => update(prev => ({ ...prev, acqTalks: null }));

  // Turn a rival into your subsidiary at the agreed price
  const finalizeAcquisition = (prev, rivalId, paid) => {
    const r = prev.rivals[rivalId];
    return {
      ...prev,
      money: prev.money - paid,
      rep: Math.min(100, (prev.rep ?? 50) + 2),
      acqTalks: null, acqWar: null,
      rivals: { ...prev.rivals, [rivalId]: { ...r, ownedByYou: true } },
      log: pushLog(prev, `🏦 Deal closed: ${r.name} is now a subsidiary of ${prev.studioName} for ${money$(paid)}. They keep operating — dividends flow up.`),
    };
  };

  const makeStudioOffer = mult => update(prev => {
    const t = prev.acqTalks;
    if (!t) return prev;
    const r = prev.rivals[t.rivalId];
    const offer = Math.round(t.ask * mult);
    if (prev.money < offer) return prev;
    const vuln = (r.momentum < -0.25 ? 0.3 : 0) + (r.skill < 42 ? 0.2 : 0) + (r.prestige < 2000 ? 0.1 : 0);
    const odds = mult <= 0.75 ? 0.12 + vuln : mult <= 1 ? 0.5 + vuln : 0.85 + vuln;
    if (Math.random() >= odds) {
      // Rejected — and the rebuff leaks
      return {
        ...prev,
        acqTalks: null,
        rep: Math.max(0, (prev.rep ?? 50) - 1),
        rivals: { ...prev.rivals, [t.rivalId]: { ...r, noTalksUntil: prev.week + 52 } },
        log: pushLog(prev, `${r.name} rejected your ${money$(offer)} offer${mult <= 0.75 ? " — insulted, frankly" : ""}. The story leaked. No talks for a year.`),
      };
    }
    // Accepted — but a rival may crash the deal
    const crashers = independentRivals(prev).filter(x => x.id !== t.rivalId && x.prestige > r.prestige);
    if (crashers.length && Math.random() < 0.25) {
      const crasher = pick(crashers);
      return {
        ...prev,
        acqTalks: null,
        acqWar: { rivalId: t.rivalId, targetName: r.name, crasher: { id: crasher.id, name: crasher.name }, yourBid: offer, counter: Math.round(offer * 1.15), round: 1 },
        log: pushLog(prev, `${r.name} accepted your offer — but ${crasher.name} just crashed the deal with a counter-bid.`),
      };
    }
    return finalizeAcquisition(prev, t.rivalId, offer);
  });

  const acqRaise = () => update(prev => {
    const w = prev.acqWar;
    if (!w) return prev;
    const newBid = Math.round(w.counter * 1.1);
    if (prev.money < newBid) return prev;
    if (w.round >= 3 || Math.random() < 0.5 + w.round * 0.2) {
      const done = finalizeAcquisition(prev, w.rivalId, newBid);
      return { ...done, log: pushLog(done, `⚔ ${w.crasher.name} backed down at ${money$(newBid)}.`) };
    }
    return { ...prev, acqWar: { ...w, yourBid: newBid, counter: Math.round(newBid * 1.15), round: w.round + 1 } };
  });

  const acqWalk = () => update(prev => {
    const w = prev.acqWar;
    if (!w) return prev;
    const target = prev.rivals[w.rivalId];
    const crasher = prev.rivals[w.crasher.id];
    let rivals = { ...prev.rivals };
    if (target && crasher) {
      rivals[w.rivalId] = { ...target, defunct: true, defunctYear: yearOf(prev.week), acquiredBy: crasher.name, ips: [] };
      rivals[w.crasher.id] = { ...crasher, ips: [...crasher.ips, ...target.ips.map(ip => ({ ...ip }))], prestige: Math.round(crasher.prestige + target.prestige * 0.5) };
    }
    return {
      ...prev,
      acqWar: null,
      rivals,
      log: pushLog(prev, `You walked away — ${w.crasher.name} acquired ${w.targetName} at ${money$(w.counter)}.`),
    };
  });

  // Subsidiary controls
  const orderSequel = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r?.ownedByYou || prev.money < 5000 || !r.ips.length) return prev;
    return {
      ...prev,
      money: prev.money - 5000,
      rivals: { ...prev.rivals, [rivalId]: { ...r, orderedSequel: true, nextRelease: Math.min(r.nextRelease, prev.week + 8) } },
      log: pushLog(prev, `📋 Directive sent: ${r.name} will fast-track a sequel in their strongest IP.`),
    };
  });

  const injectCapital = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r?.ownedByYou || prev.money < 15000) return prev;
    return {
      ...prev,
      money: prev.money - 15000,
      rivals: { ...prev.rivals, [rivalId]: { ...r, momentum: Math.min(1, r.momentum + 0.4), skill: Math.min(90, r.skill + 2) } },
      log: pushLog(prev, `💉 Injected $15,000 into ${r.name} — new hires, new hardware, new momentum.`),
    };
  });

  const absorbSubsidiary = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r?.ownedByYou) return prev;
    // Integration friction: culture clash, nervous fans, flight risk
    const ips = { ...prev.ips };
    for (const ip0 of r.ips) {
      const ip = { ...ip0, fatigue: Math.min(100, (ip0.fatigue || 0) + 20) };
      delete ip.owner; delete ip.soldWeek; delete ip.formerYours;
      ips[ip.id] = ip;
    }
    const base = Math.max(3, Math.min(10, Math.round(r.skill / 9)));
    const alum = () => {
      const c = makeCandidate(yearOf(prev.week));
      for (const k of ["code", "design", "art", "sound"]) c[k] = Math.max(1, Math.min(10, ri(base - 1, base + 1)));
      c.role = `Ex-${r.name.split(" ")[0]} Veteran`;
      c.salary = Math.round((80 + (c.code + c.design + c.art + c.sound) * 22) * 1.3);
      return c;
    };
    const oneWalked = Math.random() < 0.35;
    const vets = oneWalked ? [alum()] : [alum(), alum()];
    return {
      ...prev,
      ips,
      candidates: [...vets, ...prev.candidates].slice(0, 6),
      fans: prev.fans + Math.round(r.prestige * 0.25),
      morale: Math.max(30, prev.morale - 10),
      rivals: { ...prev.rivals, [rivalId]: { ...r, defunct: true, defunctYear: yearOf(prev.week), acquiredByYou: true, ownedByYou: false, ips: [] } },
      log: pushLog(prev, `🏦 ${r.name} fully absorbed — ${r.ips.length} IP${r.ips.length === 1 ? "" : "s"} join your catalog (fans are nervous: +20 fatigue). Culture clash stings morale.${oneWalked ? " One veteran refused to stay through the merger." : " Two veterans are in your applicant pool."}`),
    };
  });

  const sellSubsidiary = rivalId => update(prev => {
    const r = prev.rivals[rivalId];
    if (!r?.ownedByYou) return prev;
    const price = Math.round(acquisitionPrice(r, prev.week) * 0.8);
    return {
      ...prev,
      money: prev.money + price,
      rivals: { ...prev.rivals, [rivalId]: { ...r, ownedByYou: false, noTalksUntil: prev.week + 26 } },
      log: pushLog(prev, `💰 Spun off ${r.name} for ${money$(price)}. They're independent again.`),
    };
  });

  // Responding to a buyout offer on YOUR studio
  const acceptBuyout = () => update(prev => {
    if (!prev.buyoutOffer) return prev;
    return {
      ...prev,
      soldOut: { buyer: prev.buyoutOffer.buyer, price: prev.buyoutOffer.price },
      buyoutOffer: null,
      gameOver: true,
      log: pushLog(prev, `🏦 ${prev.studioName} has been acquired by ${prev.buyoutOffer.buyer} for ${money$(prev.buyoutOffer.price)}.`),
    };
  });

  const refuseBuyout = () => update(prev => prev.buyoutOffer ? {
    ...prev,
    buyoutOffer: null,
    rep: Math.min(100, (prev.rep ?? 50) + 1),
    morale: Math.min(100, prev.morale + 4),
    log: pushLog(prev, `You told ${prev.buyoutOffer.buyer} the studio isn't for sale. The team walks taller.`),
  } : prev);

  const newGameFlow = async () => { await wipeSave(); setSetup({ studio: "", founder: "" }); setMode("setup"); };

  // ---------- RENDER ----------

  const fontLink = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Rubik:wght@400;500;700;800&display=swap');
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin: 0; }
      @keyframes popIn { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes shine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    `}</style>
  );

  const shell = children => (
    <div style={{
      minHeight: "100vh", background: `radial-gradient(1200px 600px at 50% -10%, #2E2660, ${C.bg})`,
      color: C.ink, fontFamily: "'Rubik', sans-serif", padding: 16, userSelect: "none",
    }}>
      {fontLink}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </div>
  );

  if (mode === "boot") return shell(<div style={{ padding: 80, textAlign: "center", color: C.dim }}>Loading…</div>);

  // ----- TITLE -----
  if (mode === "title") {
    return shell(
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "'Bungee', cursive", fontSize: "clamp(40px, 8vw, 78px)", lineHeight: 1, color: C.mag, textShadow: `4px 4px 0 ${C.cyan}, 8px 8px 0 #00000055` }}>
          PIXEL<br />EMPIRE
        </div>
        <div style={{ color: C.dim, marginTop: 14, fontSize: 18 }}>Build a game studio. 1984 → forever.</div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }}>
          {s && !s.gameOver && <Btn color={C.cyan} onClick={() => setMode("play")}>Continue — {s.studioName}</Btn>}
          <Btn onClick={newGameFlow}>New Studio</Btn>
        </div>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 10 }}>
          {[C.mag, C.cyan, C.gold, C.green].map((c, i) => (
            <div key={i} style={{ width: 46, height: 62, borderRadius: 6, background: c, opacity: .85, transform: `rotate(${(i - 1.5) * 4}deg)` }} />
          ))}
        </div>
      </div>
    );
  }

  // ----- SETUP -----
  if (mode === "setup") {
    const inputStyle = {
      width: "100%", fontSize: 20, padding: "16px 18px", borderRadius: 14,
      border: `2px solid ${C.line}`, background: C.panelHi, color: C.ink,
      fontFamily: "'Rubik', sans-serif", outline: "none",
    };
    return shell(
      <div style={{ maxWidth: 520, margin: "60px auto 0" }}>
        <Panel title="FOUND YOUR STUDIO" accent={C.mag}>
          <div style={{ fontSize: 14, color: C.dim, marginBottom: 6 }}>Studio name</div>
          <input style={inputStyle} value={setup.studio} placeholder="e.g. Maverick Interactive"
            onChange={e => setSetup(v => ({ ...v, studio: e.target.value }))} />
          <div style={{ fontSize: 14, color: C.dim, margin: "18px 0 6px" }}>Founder name</div>
          <input style={inputStyle} value={setup.founder} placeholder="Your name"
            onChange={e => setSetup(v => ({ ...v, founder: e.target.value }))} />
          <div style={{ marginTop: 26 }}>
            <Btn disabled={!setup.studio.trim() || !setup.founder.trim()}
              onClick={() => { setS(freshState(setup.studio.trim(), setup.founder.trim())); setMode("play"); }}
              style={{ width: "100%" }}>
              Open the garage door — Jan 1984
            </Btn>
          </div>
        </Panel>
      </div>
    );
  }

  // ----- PLAY -----
  if (!s) return shell(null);

  if (s.gameOver) {
    const sold = s.soldOut;
    return shell(
      <div style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontFamily: "'Bungee', cursive", fontSize: 46, color: sold ? C.gold : C.red }}>
          {sold ? "ACQUIRED" : "GAME OVER"}
        </div>
        {sold && (
          <div style={{ color: C.ink, marginTop: 12, fontSize: 18 }}>
            {s.studioName} sold to {sold.buyer} for <b style={{ color: C.green }}>{money$(sold.price)}</b>.
          </div>
        )}
        <div style={{ color: C.dim, marginTop: 12, fontSize: 18 }}>
          {s.gameCount} game{s.gameCount === 1 ? "" : "s"} shipped · best score {s.bestScore}/100 · {(s.awards || []).length} award{(s.awards || []).length === 1 ? "" : "s"} · {s.fans.toLocaleString()} fans
        </div>
        {sold && <div style={{ color: C.dim, marginTop: 8, fontSize: 15, fontStyle: "italic" }}>Not every studio dies. Some just get a new sign on the door.</div>}
        <div style={{ marginTop: 30 }}><Btn onClick={newGameFlow}>Start a new studio</Btn></div>
      </div>
    );
  }

  const year = yearOf(s.week);
  const office = OFFICES[s.office];
  const nextOffice = OFFICES[s.office + 1];
  const weeklyCost = s.staff.reduce((a, m) => a + m.salary, 0) + office.rent;
  const activePlatforms = PLATFORMS.filter(p => p.yr <= year && platEnd(s, p) >= year);
  const activeTopics = TOPICS.filter(t => t.yr <= year);

  const tabs = [
    ["studio", "Studio"], ["dev", "Develop"], ["team", "Team"], ["research", "R&D"],
    ["ip", s.market?.length ? `IP · ${s.market.length} for sale` : "IP"], ["shelf", "Shelf"], ["stats", "Analytics"],
  ];

  // Nudges: things quietly costing you money or windows about to close
  const warnings = [];
  {
    const staffB = s.staff.filter(m => m.team === "B").length;
    const contractBusy = !!s.contracts?.active;
    if (!s.project && !contractBusy) warnings.push(`Team ${s.office >= 3 ? "A" : ""} is idle — salaries are burning with nothing in development.`);
    if (s.office >= 3 && staffB > 0 && !s.projectB && !contractBusy) warnings.push(`Team B (${staffB} dev${staffB > 1 ? "s" : ""}) is idle.`);
    const burned = s.staff.filter(m => (m.energy ?? 100) < 20 && !m.resting).length;
    if (burned) warnings.push(`${burned} dev${burned > 1 ? "s are" : " is"} burned out — half speed until they Rest.`);
    for (const p of [s.project, s.projectB]) {
      if (p && s.trend && matchesTrend(s.trend, p.genre, p.topic)) {
        const wl = s.trend.endWeek - s.week;
        if (wl <= 10) warnings.push(p.stage === "polish"
          ? `"${p.name}" rides the ${trendLabel(s.trend)} trend — release within ${wl}w or lose the wave.`
          : `The ${trendLabel(s.trend)} trend fades in ${wl}w — "${p.name}" may miss it.`);
      }
    }
    if ((s.engines || []).length) {
      const best = Math.max(...s.engines.map(e => enginePowerFromParts(e.parts)));
      if (best < eraPower(year) * 0.55) warnings.push("Your best engine is far behind the era — research and update it.");
    }
    for (const p of [s.project, s.projectB]) {
      if (p && marketFactor(s, p.genre, p.topic) <= 0.8) {
        warnings.push(`The market for "${p.name}" (${genreById(p.genre)?.name}) is flooding — expect a sales haircut at launch.`);
      }
    }
  }

  return shell(
    <>
      {/* TOP BAR */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "12px 18px", marginBottom: 14,
        position: "sticky", top: 8, zIndex: 5, boxShadow: "0 6px 20px #0007",
      }}>
        <div>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.mag }}>{s.studioName}</div>
          <div style={{ fontSize: 12, color: C.dim }}>{office.name} · Week {weekOf(s.week)}, {year}</div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Stat label="Cash" value={money$(s.money)} color={s.money < 0 ? C.red : C.green} />
          <Stat label="Fans" value={s.fans.toLocaleString()} color={C.cyan} />
          <Stat label="Rep" value={`${Math.round(s.rep ?? 50)}/100`} color={(s.rep ?? 50) >= 70 ? C.gold : (s.rep ?? 50) >= 40 ? C.ink : C.red} />
          <Stat label="Research" value={Math.floor(s.rp)} color={C.gold} />
          <Stat label="Weekly cost" value={money$(weeklyCost)} color={C.dim} />
        </div>
        <Btn color={C.green} onClick={nextWeek}>▶ Next Week</Btn>
      </div>

      {warnings.length > 0 && (
        <div style={{ background: "#3A2E10", border: `1px solid ${C.gold}55`, borderRadius: 14, padding: "8px 14px", marginBottom: 12 }}>
          {warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 13, color: C.gold, padding: "2px 0" }}>⚠ {w}</div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        {tabs.map(([id, label]) => (
          <Btn key={id} small kind={s.tab === id ? "solid" : "ghost"} color={C.cyan}
            onClick={() => update(p => ({ ...p, tab: id }))}
            style={{ flexShrink: 0 }}>
            {label}
          </Btn>
        ))}
      </div>

      {s.tab === "studio"   && <StudioTab s={s} nextOffice={nextOffice} upgradeOffice={upgradeOffice} acceptContract={acceptContract} abandonContract={abandonContract} fundPitch={fundPitch} />}
      {s.tab === "dev"      && <DevTab s={s} startProject={startProject} releaseGame={releaseGame} marketPush={marketPush} setPrice={setPrice} setLive={setLive} toggleCrunch={toggleCrunch} activePlatforms={activePlatforms} activeTopics={activeTopics} year={year} />}
      {s.tab === "team"     && <TeamTab s={s} hire={hire} fire={fire} office={office} recruitAd={recruitAd} recruitHeadhunter={recruitHeadhunter} poachRival={poachRival} toggleRest={toggleRest} setLead={setLead} assignTeam={assignTeam} />}
      {s.tab === "research" && <ResearchTab s={s} buyTech={buyTech} buyEngineTech={buyEngineTech} buildEngine={buildEngine} updateEngine={updateEngine} toggleEngineLicense={toggleEngineLicense} licenseRivalEngine={licenseRivalEngine} />}
      {s.tab === "ip"       && <IpTab s={s} sellIp={sellIp} buyIp={buyIp} renameIp={renameIp} buybackPubIp={buybackPubIp} openTalks={openTalks} orderSequel={orderSequel} injectCapital={injectCapital} absorbSubsidiary={absorbSubsidiary} sellSubsidiary={sellSubsidiary} />}
      {s.tab === "shelf"    && <ShelfTab s={s} rerelease={rerelease} portGame={portGame} liveUpdate={liveUpdate} sunsetLive={sunsetLive} />}
      {s.tab === "stats"    && <StatsTab s={s} />}

      {/* ACQUISITION TALKS */}
      {s.acqTalks && (() => {
        const r = s.rivals[s.acqTalks.rivalId];
        if (!r) return null;
        const ask = s.acqTalks.ask;
        const tiers = [
          { label: "Lowball", mult: 0.7, note: "They'll probably be insulted" },
          { label: "Fair offer", mult: 0.95, note: "A coin flip, better if they're weak" },
          { label: "Generous", mult: 1.15, note: "Hard to refuse" },
        ];
        return (
          <Modal wide>
            <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.gold, marginBottom: 8 }}>🏦 ACQUISITION TALKS</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 6 }}>
              <b style={{ color: `hsl(${r.hue} 65% 70%)` }}>{r.name}</b> is asking around <b>{money$(ask)}</b>.
              They're {trajectoryOf(r)}{r.momentum < -0.25 ? " — desperate sellers take bad deals" : r.momentum > 0.25 ? " — they don't need your money" : ""}.
            </div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>A rejection leaks to the press (−1 rep) and freezes talks for a year. Accepted deals can still be crashed by a rival counter-bid.</div>
            <div style={{ display: "grid", gap: 8 }}>
              {tiers.map(t => (
                <Btn key={t.label} small color={C.gold} disabled={s.money < Math.round(ask * t.mult)} onClick={() => makeStudioOffer(t.mult)} style={{ width: "100%", textAlign: "left" }}>
                  {t.label} — {money$(Math.round(ask * t.mult))} <span style={{ fontWeight: 400, fontSize: 12 }}>· {t.note}</span>
                </Btn>
              ))}
              <Btn kind="ghost" onClick={cancelTalks} style={{ width: "100%" }}>Walk away from the table</Btn>
            </div>
          </Modal>
        );
      })()}

      {/* ACQUISITION BIDDING WAR */}
      {s.acqWar && (
        <Modal>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.red, marginBottom: 10 }}>⚔ DEAL CRASHED</div>
          <div style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 8 }}>
            <b>{s.acqWar.crasher.name}</b> wants {s.acqWar.targetName} too — they've countered your {money$(s.acqWar.yourBid)} with <b style={{ color: C.red }}>{money$(s.acqWar.counter)}</b>.
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 18 }}>Round {s.acqWar.round} of 3. Walk away and they take the whole studio.</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn color={C.gold} disabled={s.money < Math.round(s.acqWar.counter * 1.1)} onClick={acqRaise}>
              Outbid — {money$(Math.round(s.acqWar.counter * 1.1))}
            </Btn>
            <Btn kind="ghost" onClick={acqWalk}>Let them have it</Btn>
          </div>
        </Modal>
      )}

      {/* BUYOUT OFFER ON YOUR STUDIO */}
      {s.buyoutOffer && !s.bankOffer && (
        <Modal>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.gold, marginBottom: 10 }}>🏦 THEY WANT TO BUY YOU</div>
          <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
            <b>{s.buyoutOffer.buyer}</b> has made an offer to acquire {s.studioName} outright: <b style={{ color: C.green }}>{money$(s.buyoutOffer.price)}</b>.
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 18 }}>Accepting ends the run — your story closes as an acquisition, not a bankruptcy. Refusing earns the team's respect.</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn color={C.green} onClick={acceptBuyout}>Sell the studio</Btn>
            <Btn kind="ghost" onClick={refuseBuyout}>We're not for sale</Btn>
          </div>
        </Modal>
      )}

      {/* THE BANK CALLS */}
      {s.bankOffer && (
        <Modal>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.red, marginBottom: 10 }}>🏦 THE BANK CALLS</div>
          <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
            The studio is deep in the red. The bank offers <b style={{ color: C.green }}>{money$(s.bankOffer.bail)}</b> — repaid at <b style={{ color: C.red }}>{money$(s.bankOffer.weekly)}/week for 52 weeks</b> ({money$(s.bankOffer.weekly * 52)} total).
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 18 }}>This is the only lifeline you'll ever get. Go under again and it's over.</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn color={C.gold} onClick={acceptLoan}>Take the loan</Btn>
            <Btn kind="ghost" onClick={refuseLoan} style={{ color: C.red }}>Close the studio</Btn>
          </div>
        </Modal>
      )}

      {/* EVENT MODAL */}
      {s.event && (
        <Modal>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 16, color: C.gold, marginBottom: 12 }}>STUDIO EVENT</div>
          <div style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 22 }}>{s.event.text}</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn onClick={() => resolveEvent("a")}>{s.event.a.label}</Btn>
            <Btn kind="ghost" onClick={() => resolveEvent("b")}>{s.event.b.label}</Btn>
          </div>
        </Modal>
      )}

      {/* BIDDING WAR */}
      {s.bidWar && (
        <Modal>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: C.red, marginBottom: 10 }}>⚔ BIDDING WAR</div>
          <div style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 8 }}>
            <b>{s.bidWar.rival.name}</b> wants "{s.bidWar.listing.ip.name}" too. They've countered your {money$(s.bidWar.yourBid)} with <b style={{ color: C.red }}>{money$(s.bidWar.counter)}</b>.
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 18 }}>Round {s.bidWar.round} of 3 — each raise makes them likelier to fold.</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn color={C.gold} disabled={s.money < Math.round(s.bidWar.counter * 1.12)} onClick={raiseBid}>
              Outbid — {money$(Math.round(s.bidWar.counter * 1.12))}
            </Btn>
            <Btn kind="ghost" onClick={walkAway}>Let it go</Btn>
          </div>
        </Modal>
      )}

      {/* PIXELCON */}
      {s.convention && !s.event && (
        <Modal wide>
          <div style={{ fontFamily: "'Bungee', cursive", fontSize: 20, color: C.cyan, marginBottom: 4 }}>PIXELCON {s.convention.year}</div>
          <div style={{ color: C.dim, fontSize: 15, marginBottom: 18 }}>
            The industry's big summer show. Booth space buys fans, research contacts{s.project ? ", and hype for your current project" : ""}.
          </div>
          {conTiers(s.convention.year).map(tier => {
            const locked = tier.minFans && s.fans < tier.minFans;
            return (
              <div key={tier.id} style={{ background: C.panel, borderRadius: 14, padding: 14, marginBottom: 10, opacity: locked ? 0.5 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{tier.name}</div>
                    <div style={{ fontSize: 13, color: C.dim }}>
                      +{tier.hype} hype · +{tier.rp} RP · fans +{Math.round(tier.fansPct * 100)}%+{tier.fansFlat}
                      {tier.star > 0 && ` · ${Math.round(tier.star * 100)}% star hire`}
                      {locked && ` · needs ${tier.minFans.toLocaleString()} fans`}
                    </div>
                  </div>
                  <Btn small color={C.cyan} disabled={locked || s.money < tier.cost} onClick={() => attendConvention(tier)}>
                    {money$(tier.cost)}
                  </Btn>
                </div>
              </div>
            );
          })}
          <Btn kind="ghost" onClick={() => attendConvention(null)} style={{ width: "100%" }}>Skip this year</Btn>
        </Modal>
      )}

      {/* AWARDS NIGHT */}
      {s.awardsShow && !s.event && !s.convention && (
        <Modal wide>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 34 }}>🏆</div>
            <div style={{ fontFamily: "'Bungee', cursive", fontSize: 20, color: C.gold }}>THE {s.awardsShow.year} PIXEL AWARDS</div>
          </div>
          {s.awardsShow.categories.map((c, i) => (
            <div key={i} style={{ background: c.won ? "#3A3110" : C.panel, border: `2px solid ${c.won ? C.gold : C.line}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 12, letterSpacing: 1.5, color: C.dim, textTransform: "uppercase", marginBottom: 6 }}>{c.cat}</div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 15 }}>
                <span style={{ fontWeight: c.won ? 800 : 400, color: c.won ? C.gold : C.ink }}>{c.won ? "🏆 " : ""}"{c.nominee}" (you)</span>
                <span style={{ color: C.dim }}>{c.yourScore}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 15, marginTop: 4 }}>
                <span style={{ fontWeight: !c.won ? 800 : 400, color: !c.won ? C.ink : C.dim }}>{!c.won ? "🏆 " : ""}{c.rival}</span>
                <span style={{ color: C.dim }}>{c.rivalScore}</span>
              </div>
            </div>
          ))}
          <Btn color={C.gold} onClick={() => update(p => ({ ...p, awardsShow: null }))} style={{ width: "100%" }}>
            {s.awardsShow.categories.some(c => c.won) ? "Take a bow" : "There's always next year"}
          </Btn>
        </Modal>
      )}

      {/* YEAR IN REVIEW */}
      {s.yearReview && !s.event && !s.convention && !s.awardsShow && !s.bidWar && (
        <Modal wide>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 30 }}>🗓</div>
            <div style={{ fontFamily: "'Bungee', cursive", fontSize: 20, color: C.cyan }}>{s.yearReview.year} — YEAR IN REVIEW</div>
          </div>
          <Row k="Revenue" v={money$(s.yearReview.revenue)} color={C.green} />
          {s.yearReview.lastRevenue > 0 && (
            <Row k="vs last year" v={`${s.yearReview.revenue >= s.yearReview.lastRevenue ? "▲" : "▼"} ${Math.abs(Math.round(((s.yearReview.revenue - s.yearReview.lastRevenue) / Math.max(1, s.yearReview.lastRevenue)) * 100))}%`}
              color={s.yearReview.revenue >= s.yearReview.lastRevenue ? C.green : C.red} />
          )}
          <Row k="Games shipped" v={s.yearReview.releases} />
          {s.yearReview.best && <Row k="Best release" v={`"${s.yearReview.best.name}" · ${s.yearReview.best.score}/100`} color={C.gold} />}
          <Row k="Awards won" v={s.yearReview.awardsWon ? `🏆 ${s.yearReview.awardsWon}` : "—"} color={C.gold} />
          <Row k="Fans gained" v={s.yearReview.fansGained.toLocaleString()} color={C.cyan} />
          <Row k="Reputation" v={`${s.yearReview.repDelta >= 0 ? "+" : ""}${s.yearReview.repDelta}`} color={s.yearReview.repDelta >= 0 ? C.green : C.red} />
          {s.yearReview.topRival && (
            <div style={{ marginTop: 10, padding: "10px 14px", background: C.panel, borderRadius: 12, fontSize: 14 }}>
              🏢 <b>Rival of the year:</b> {s.yearReview.topRival.studio} — "{s.yearReview.topRival.game}" ({s.yearReview.topRival.score}/100)
            </div>
          )}
          <Btn color={C.cyan} onClick={() => update(p => ({ ...p, yearReview: null }))} style={{ width: "100%", marginTop: 16 }}>
            Onward to {s.yearReview.year + 1}
          </Btn>
        </Modal>
      )}

      {/* LAUNCH RESULTS */}
      {launchCard && (
        <Modal wide>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <ScoreSticker score={launchCard.game.score} size={74} />
            <div>
              <div style={{ fontFamily: "'Bungee', cursive", fontSize: 22, color: C.ink }}>{launchCard.game.name}</div>
              <div style={{ color: C.dim, fontSize: 14 }}>
                {genreById(launchCard.game.genre).name} · {topicById(launchCard.game.topic).name} · {platById(launchCard.game.platform).name} · {launchCard.game.year}
              </div>
            </div>
          </div>
          {launchCard.reviews.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${C.line}` }}>
              <div>
                <div style={{ fontWeight: 700 }}>{r.outlet}</div>
                <div style={{ color: C.dim, fontSize: 14, fontStyle: "italic" }}>“{r.quote}”</div>
              </div>
              <div style={{ fontFamily: "'Bungee', cursive", fontSize: 20, color: r.score >= 75 ? C.gold : r.score >= 50 ? C.cyan : C.red }}>{r.score}</div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <Btn color={C.green} onClick={() => setLaunchCard(null)} style={{ width: "100%" }}>Watch the sales roll in</Btn>
          </div>
        </Modal>
      )}
    </>
  );

  // ---------- SUBVIEWS (closures over helpers) ----------

  function Modal({ children, wide }) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#0009", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, padding: 20 }}>
        <div style={{ background: C.panelHi, border: `2px solid ${C.line}`, borderRadius: 22, padding: 26, maxWidth: wide ? 560 : 460, width: "100%", animation: "popIn .2s ease-out", maxHeight: "85vh", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    );
  }
}

// ---------- TAB COMPONENTS ----------

function StudioTab({ s, nextOffice, upgradeOffice, acceptContract, abandonContract, fundPitch }) {
  const c = s.contracts?.active;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
      <Panel title="THIS WEEK" accent={C.mag}>
        {s.trend && (
          <div style={{ fontSize: 14, color: C.mag, fontWeight: 700, marginBottom: 10 }}>
            📈 {trendLabel(s.trend)} is trending (~{Math.max(1, s.trend.endWeek - s.week)}w left)
          </div>
        )}
        {s.project || s.projectB ? (
          <>
            {s.project && <ProjectSummary p={s.project} compact />}
            {s.projectB && <div style={{ marginTop: s.project ? 12 : 0 }}><ProjectSummary p={s.projectB} compact /></div>}
          </>
        ) : (
          <div style={{ color: C.dim, fontSize: 16, lineHeight: 1.5 }}>
            No game in development. The team is idle — head to <b style={{ color: C.ink }}>Develop</b> to start one.
          </div>
        )}
        {s.released.filter(g => g.weeksLeft > 0).slice(0, 3).map(g => (
          <div key={g.id} style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 15 }}>
            <span style={{ color: C.dim }}>“{g.name}” selling</span>
            <span style={{ color: C.green, fontWeight: 700 }}>{money$(g.salesTotal)} · {g.weeksLeft}w left</span>
          </div>
        ))}
      </Panel>

      <Panel title="STUDIO" accent={C.cyan}>
        <Row k="Office" v={OFFICES[s.office].name} />
        <Row k="Team" v={`${s.staff.length} / ${OFFICES[s.office].cap}`} />
        <Row k="Morale" v={`${Math.round(s.morale)}%`} color={s.morale >= 70 ? C.green : s.morale >= 50 ? C.gold : C.red} />
        <Row k="Reputation" v={`${Math.round(s.rep ?? 50)}/100`} color={(s.rep ?? 50) >= 70 ? C.gold : (s.rep ?? 50) >= 40 ? C.ink : C.red} />
        {s.loan && <Row k="Bank loan" v={`${money$(s.loan.weekly)}/wk · ${s.loan.weeksLeft}w left`} color={C.red} />}
        <Row k="Games shipped" v={s.gameCount} />
        <Row k="Best review" v={s.bestScore ? `${s.bestScore}/100` : "—"} color={C.gold} />
        <Row k="Awards won" v={(s.awards || []).length ? `🏆 ${s.awards.length}` : "—"} color={C.gold} />
        {nextOffice && (
          <div style={{ marginTop: 16 }}>
            <Btn small color={C.gold} disabled={s.money < nextOffice.cost} onClick={upgradeOffice} style={{ width: "100%" }}>
              Move to {nextOffice.name} — {money$(nextOffice.cost)}
            </Btn>
          </div>
        )}
      </Panel>

      <Panel title="CONTRACT WORK" accent={C.green} style={{ gridColumn: "1 / -1" }}>
        {c ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800 }}>{c.job} for {c.client} <span style={{ color: C.dim, fontWeight: 400 }}>({c.tier})</span></div>
                <div style={{ fontSize: 13, color: C.dim }}>{money$(c.pay)} on delivery · +{c.rp} RP · <b style={{ color: c.deadline <= 3 ? C.red : C.ink }}>{c.deadline}w left</b></div>
              </div>
              <Btn small kind="ghost" onClick={abandonContract}>Walk away</Btn>
            </div>
            <Meter label={`Progress ${Math.min(100, Math.round((c.progress / c.work) * 100))}%`} pct={Math.min(100, (c.progress / c.work) * 100)} color={C.green} />
            {s.project && <div style={{ fontSize: 13, color: C.dim }}>⚠ Splitting the team: ~35% of output goes to this contract while "{s.project.name}" is in development.</div>}
          </div>
        ) : s.contracts?.offers?.length ? (
          <>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>One contract at a time. It'll pull ~35% of the team if a game is in development — or 100% of an idle team. New offers roll in every 10 weeks.</div>
            {s.contracts.offers.map(o => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.line}`, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.job} for {o.client} <span style={{ color: C.dim, fontWeight: 400 }}>({o.tier})</span></div>
                  <div style={{ fontSize: 13, color: C.dim }}>{o.deadline} weeks · +{o.rp} RP</div>
                </div>
                <Btn small color={C.green} onClick={() => acceptContract(o)}>Accept · {money$(o.pay)}</Btn>
              </div>
            ))}
          </>
        ) : (
          <div style={{ color: C.dim, fontSize: 15 }}>No offers on the board right now. New contracts roll in every 10 weeks.</div>
        )}
      </Panel>

      {(s.office >= 3 && (s.rep ?? 50) >= 60 || (s.pitches || []).length > 0 || (s.pubProjects || []).length > 0) && (
        <Panel title="📮 YOUR PUBLISHING LABEL" accent={C.mag} style={{ gridColumn: "1 / -1" }}>
          {(s.pubProjects || []).length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.dim, letterSpacing: 1, marginBottom: 6 }}>IN DEVELOPMENT UNDER YOUR LABEL</div>
              {s.pubProjects.map(pp => (
                <div key={pp.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 14, gap: 8, flexWrap: "wrap" }}>
                  <span><b>"{pp.title}"</b> by {pp.studio} <span style={{ color: C.dim }}>({pp.concept})</span></span>
                  <span style={{ color: C.cyan, fontWeight: 700 }}>ships in ~{Math.max(0, pp.done - s.week)}w</span>
                </div>
              ))}
            </div>
          )}
          {(s.pitches || []).length > 0 ? (
            <>
              <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>
                Indie studios pitching for funding. You take 70% of revenue and the credit — or the blame. Wide score ranges are lottery tickets; narrow ones are safe bets. Board refreshes every 16 weeks.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                {s.pitches.map(p2 => (
                  <div key={p2.id} style={{ background: C.panelHi, borderRadius: 14, padding: 14, border: `1px solid ${C.line}` }}>
                    <div style={{ fontWeight: 800 }}>{p2.studio}</div>
                    <div style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Pitching {p2.concept}</div>
                    <Row k="Projected score" v={`${p2.scoreMin}–${p2.scoreMax}`} color={p2.scoreMax - p2.scoreMin > 20 ? C.mag : C.cyan} />
                    <Row k="Timeline" v={`~${p2.weeks} weeks`} />
                    <Btn small color={C.green} disabled={s.money < p2.ask} onClick={() => fundPitch(p2)} style={{ width: "100%", marginTop: 8 }}>
                      Fund · {money$(p2.ask)}
                    </Btn>
                  </div>
                ))}
              </div>
            </>
          ) : (s.pubProjects || []).length === 0 && (
            <div style={{ color: C.dim, fontSize: 14 }}>The pitch board is empty right now — new pitches land every 16 weeks.</div>
          )}
        </Panel>
      )}

      {(s.awards || []).length > 0 && (
        <Panel title="TROPHY CABINET" accent={C.gold} style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {[...s.awards].reverse().map((a, i) => (
              <div key={i} style={{ background: C.panelHi, border: `1px solid ${C.gold}55`, borderRadius: 12, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{a.cat} · {a.year}</div>
                  <div style={{ fontSize: 13, color: C.dim }}>"{a.game}"</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="STUDIO LOG" accent={C.gold} style={{ gridColumn: "1 / -1" }}>
        <div style={{ maxHeight: 220, overflowY: "auto" }}>
          {s.log.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: `1px solid ${C.line}`, fontSize: 15 }}>
              <span style={{ color: C.dim, flexShrink: 0, width: 84 }}>W{weekOf(l.wk)} {yearOf(l.wk)}</span>
              <span>{l.msg}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Row({ k, v, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 16 }}>
      <span style={{ color: C.dim }}>{k}</span>
      <span style={{ fontWeight: 700, color: color || C.ink }}>{v}</span>
    </div>
  );
}

function ProjectSummary({ p, compact }) {
  const pct = Math.min(100, Math.round((p.progress / p.totalWeeks) * 100));
  return (
    <div>
      <div style={{ fontFamily: "'Bungee', cursive", fontSize: 18, marginBottom: 4 }}>{p.name}{p.team === "B" ? <span style={{ fontSize: 11, color: C.cyan }}> · TEAM B</span> : ""}</div>
      <div style={{ color: C.dim, fontSize: 14, marginBottom: 12 }}>
        {genreById(p.genre).name} · {topicById(p.topic).name} · {platById(p.platform).name}
        {p.ip && <span style={{ color: C.gold }}> · {p.ip.name} #{p.ip.entryNo}</span>}
      </div>
      <Meter label={p.stage === "pre" ? `Pre-production ${Math.min(100, Math.round((p.progress / (p.totalWeeks * 0.15)) * 100))}%` : p.stage === "dev" ? `Production ${pct}%` : "Content complete"} pct={p.stage === "pre" ? Math.min(100, (p.progress / (p.totalWeeks * 0.15)) * 100) : pct} color={p.stage === "pre" ? C.gold : C.cyan} />
      <Meter label={`Bugs ${Math.round(p.bugs)}`} pct={Math.min(100, p.bugs * 4)} color={C.red} />
      {(p.vision > 0 || p.crunch) && (
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>
          {p.vision > 0 ? `📐 Vision +${p.vision}` : ""}{p.vision > 0 && p.crunch ? " · " : ""}{p.crunch ? <span style={{ color: C.red, fontWeight: 700 }}>🔥 CRUNCHING</span> : ""}
        </div>
      )}
      <Meter label={`Hype ${Math.round(p.hype || 0)}`} pct={p.hype || 0} color={C.mag} />
    </div>
  );
}

function Meter({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, color: C.dim, marginBottom: 4 }}>{label}</div>
      <div style={{ height: 12, borderRadius: 6, background: C.bg, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width .4s" }} />
      </div>
    </div>
  );
}

function DevTab({ s, startProject, releaseGame, marketPush, setPrice, setLive, toggleCrunch, activePlatforms, activeTopics, year }) {
  const twoTeams = s.office >= 3;
  const [team, setTeam] = useState("A");
  const slot = team === "B" ? "projectB" : "project";
  const curProj = s[slot];
  const [draft, setDraft] = useState(() => ({
    name: "", genre: "action", topic: "fantasy", platform: "pc", size: "S",
    alloc: { gameplay: 4, graphics: 4, story: 4, sound: 4 },
    price: "std",
    engine: [...(s.engines || [])].sort((a, b) => enginePowerFromParts(b.parts) - enginePowerFromParts(a.parts))[0]?.id || null,
    ip: null, // { ipId, name, entryNo, fans, fatigue, expectation, hue }
    remakeOf: null, // { id, name, score, year }
    exclusive: false,
  }));
  const [pub, setPub] = useState(null); // { name, keepIp } — null = self-publish

  // When a project wraps, clear the drafting table for the next pitch
  useEffect(() => {
    if (!curProj) setDraft(v => ({ ...v, ip: null, remakeOf: null, name: "" }));
  }, [curProj]);

  const teamBar = twoTeams ? (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {["A", "B"].map(t2 => {
        const sl = t2 === "B" ? "projectB" : "project";
        const crew = s.staff.filter(m => (m.team || "A") === t2).length;
        return (
          <Btn key={t2} small kind={team === t2 ? "solid" : "ghost"} color={C.gold} onClick={() => setTeam(t2)}>
            Team {t2} · {crew} devs{s[sl] ? ` · "${s[sl].name}"` : " · idle"}
          </Btn>
        );
      })}
    </div>
  ) : null;

  if (curProj) {
    const p = curProj;
    const canRelease = p.stage === "polish";
    // Focus Testing: sample the scoring model to estimate the review band
    let band = null;
    if (s.tech.includes("focus") && canRelease) {
      let sum = 0;
      for (let i = 0; i < 7; i++) sum += computeScore(s, p);
      const est = Math.round(sum / 7);
      band = [Math.max(5, est - 5), Math.min(98, est + 5)];
    }
    return (
      <>
      {teamBar}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <Panel title={twoTeams ? `TEAM ${team} · IN DEVELOPMENT` : "IN DEVELOPMENT"} accent={C.mag}>
          <ProjectSummary p={p} />
          {(() => {
            const eng = resolveEngine(s, p.engine);
            return <div style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>🔧 {eng ? `${eng.name} · power ${eng.power}` : "No engine — raw code"}</div>;
          })()}
          {p.stage === "polish" && (
            <div style={{ marginTop: 14, fontSize: 15, color: C.dim, lineHeight: 1.5 }}>
              Each week of polish squashes bugs, but hype slowly fades. Release when bugs are low and hype is high.
            </div>
          )}
          <button onClick={() => toggleCrunch(team)} style={{
            width: "100%", marginTop: 14, padding: "10px 12px", minHeight: 48, borderRadius: 12, cursor: "pointer",
            border: `2px solid ${p.crunch ? C.red : C.line}`, background: p.crunch ? "#3E1220" : C.panelHi,
            color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, textAlign: "left", touchAction: "manipulation",
          }}>
            🔥 Crunch mode {p.crunch ? "— ON" : "— OFF"}
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 400, marginTop: 2 }}>
              +30% speed, but energy drains twice as fast, +25% bugs, and morale bleeds. {p.stage === "polish" ? "In polish: bugs get fixed 30% faster." : ""}
            </div>
          </button>
        </Panel>
        <Panel title="LAUNCH CONTROL" accent={C.gold}>
          <Btn small color={C.mag} disabled={s.money < 1500} onClick={() => marketPush(team)} style={{ width: "100%", marginBottom: 12 }}>
            📣 Marketing push — $1,500
          </Btn>
          {band && (
            <div style={{ background: C.panelHi, borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 14 }}>
              🔬 Focus testers predict: <b style={{ color: band[1] >= 75 ? C.gold : band[1] >= 55 ? C.cyan : C.red, fontFamily: "'Bungee', cursive" }}>{band[0]}–{band[1]}</b> <span style={{ color: C.dim }}>/ 100</span>
            </div>
          )}
          <div style={{ fontSize: 13, color: C.dim, letterSpacing: 1, margin: "4px 0 6px" }}>LAUNCH PRICE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {PRICE_TIERS.map(t => (
              <button key={t.id} onClick={() => setPrice(team, t.id)} style={{
                padding: "10px 8px", minHeight: 48, borderRadius: 12, cursor: "pointer",
                border: `2px solid ${(p.price || "std") === t.id ? C.gold : C.line}`,
                background: (p.price || "std") === t.id ? "#3A3110" : C.panelHi,
                color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, touchAction: "manipulation",
              }}>
                {t.name}
                <div style={{ fontSize: 10, color: C.dim, fontWeight: 400, marginTop: 2 }}>{t.blurb}</div>
              </button>
            ))}
          </div>
          {year >= 2010 && (s.engineTechs || []).includes("net3") && (
            <button onClick={() => setLive(team, !p.live)} style={{
              width: "100%", marginBottom: 12, padding: "10px 12px", minHeight: 48, borderRadius: 12, cursor: "pointer",
              border: `2px solid ${p.live ? C.cyan : C.line}`, background: p.live ? "#123A3E" : C.panelHi,
              color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, textAlign: "left", touchAction: "manipulation",
            }}>
              🌐 Launch as live service {p.live ? "— ON" : "— OFF"}
              <div style={{ fontSize: 11, color: C.dim, fontWeight: 400, marginTop: 2 }}>No sales tail; weekly revenue while the game stays healthy. Push updates to keep it alive.</div>
            </button>
          )}
          <Btn color={C.green} disabled={!canRelease} onClick={() => releaseGame(team)} style={{ width: "100%" }}>
            {canRelease ? (p.live ? "🌐 Launch the service" : "🚀 Release the game") : "Finish development first"}
          </Btn>
          {canRelease && p.bugs > 5 && (
            <div style={{ marginTop: 12, fontSize: 14, color: C.red }}>
              ⚠ {Math.round(p.bugs)} known bugs. Critics will notice.
            </div>
          )}
          {matchesTrend(s.trend, p.genre, p.topic) && (
            <div style={{ marginTop: 12, fontSize: 14, color: C.mag, fontWeight: 700 }}>
              📈 This game rides the {trendLabel(s.trend)} trend — worth ~45% extra sales if it ships within ~{Math.max(1, s.trend.endWeek - s.week)}w.
            </div>
          )}
        </Panel>
      </div>
      </>
    );
  }

  const size = SIZES.find(z => z.id === draft.size);
  const spent = Object.values(draft.alloc).reduce((a, b) => a + b, 0);
  const left = size.points - spent;
  const plat = platById(draft.platform);
  const remakeCostMult = draft.remakeOf ? (draft.remakeOf.mode === "remaster" ? 0.4 : 0.85) : 1;
  const remakeWorkMult = draft.remakeOf?.mode === "remaster" ? 0.45 : 1;
  const devCost = Math.round(size.cost * (draft.ip ? 0.75 : 1) * remakeCostMult);
  const draftEngine = resolveEngine(s, draft.engine);
  const engFee = draft.engine && draft.engine.startsWith("lic:") ? (draftEngine?.perGame || 0) : 0;
  const cost = devCost + effLicense(s, plat, s.week) + engFee;
  const g = genreById(draft.genre);
  const t = topicById(draft.topic);
  const myIps = Object.values(s.ips || {}).sort((a, b) => ipStars(b, s.week) - ipStars(a, s.week));

  const remakeCandidates = s.released
    .filter(gm => gm.score >= 65 && year - gm.year >= 8 && !gm.remake && !gm.port && (!gm.ipId || s.ips[gm.ipId]))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  const chooseRemake = orig => setDraft(v => {
    const curSize = SIZES.find(z => z.id === v.size);
    const owned = orig.ipId && s.ips[orig.ipId];
    return {
      ...v,
      name: `${orig.name} (Remake)`,
      genre: orig.genre, topic: orig.topic,
      alloc: orig.alloc ? normalizeAlloc(orig.alloc, curSize.points) : v.alloc,
      ip: owned ? { ...ipInfo(s.ips[orig.ipId]), blueprintFrom: orig.name } : null,
      remakeOf: {
        id: orig.id, name: orig.name, score: orig.score, year: orig.year,
        mode: "remake",
        // Nostalgia inflates the bar: fans remember classics better than they were
        expectation: Math.min(96, orig.score + Math.min(8, Math.floor((year - orig.year) / 5))),
      },
    };
  });

  const chooseOriginal = () => setDraft(v => ({ ...v, ip: null, remakeOf: null, name: "" }));
  const chooseIp = ip => setDraft(v => {
    // Load the blueprint from the last installment you made under this IP
    const prev = s.released
      .filter(gm => gm.ipId === ip.id)
      .sort((a, b) => (b.entryNo || 0) - (a.entryNo || 0))[0];
    const curSize = SIZES.find(z => z.id === v.size);
    const next = { ...v, remakeOf: null, name: `${ip.name} ${ip.entries + 1}`, ip: { ...ipInfo(ip), blueprintFrom: prev?.name || null } };
    if (prev) {
      next.genre = prev.genre;
      next.topic = prev.topic;
      if (prev.alloc) next.alloc = normalizeAlloc(prev.alloc, curSize.points);
    }
    return next;
  });
  const combo = t.great.includes(draft.genre) ? "🔥 Great combo" : t.bad.includes(draft.genre) ? "🧊 Risky combo" : "— Neutral combo";

  const bump = (k, d) => setDraft(v => {
    const nv = v.alloc[k] + d;
    if (nv < 0 || (d > 0 && left <= 0)) return v;
    return { ...v, alloc: { ...v.alloc, [k]: nv } };
  });

  const canStart = draft.name.trim() && left === 0 && s.money >= cost &&
    s.staff.length >= size.minStaff && (!size.techReq || s.tech.some(id => (TECH_TREE.find(x => x.id === id)?.q || 0) >= (size.techReq - 1) * 6));

  const chip = (active, onClick, label, sub) => (
    <button onClick={onClick} style={{
      padding: "12px 14px", minHeight: 48, borderRadius: 12, cursor: "pointer", textAlign: "left",
      border: `2px solid ${active ? C.mag : C.line}`, background: active ? "#3A2050" : C.panelHi,
      color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 15, fontWeight: 600, touchAction: "manipulation",
    }}>
      {label}{sub && <div style={{ fontSize: 12, color: C.dim, fontWeight: 400, marginTop: 2 }}>{sub}</div>}
    </button>
  );

  const riding = matchesTrend(s.trend, draft.genre, draft.topic);

  return (
    <>
      {teamBar}
      {s.trend && (
        <div style={{
          background: `linear-gradient(90deg, #3A2050, ${C.panel})`, border: `2px solid ${C.mag}`,
          borderRadius: 14, padding: "10px 16px", marginBottom: 14, fontSize: 15,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span>📈 <b style={{ color: C.mag }}>TREND WATCH:</b> {trendLabel(s.trend)} is hot — matching releases sell ~45% better.</span>
          <span style={{ color: C.dim, fontSize: 13 }}>~{Math.max(1, s.trend.endWeek - s.week)}w left</span>
        </div>
      )}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
      <Panel title="1 · CONCEPT" accent={C.mag}>
        {myIps.length > 0 && (
          <>
            <div style={{ fontSize: 13, color: C.dim, margin: "0 0 6px", letterSpacing: 1 }}>ORIGINAL OR EXISTING IP?</div>
            <div style={{ display: "grid", gap: 8, marginBottom: 14, maxHeight: 200, overflowY: "auto" }}>
              {chip(!draft.ip, chooseOriginal, "✦ Original title", "A fresh idea — no expectations, no fanbase. It registers as new IP on release.")}
              {myIps.map(ip => (
                <button key={ip.id} onClick={() => chooseIp(ip)} style={{
                  padding: "12px 14px", minHeight: 48, borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: `2px solid ${draft.ip?.ipId === ip.id ? C.mag : C.line}`,
                  background: draft.ip?.ipId === ip.id ? "#3A2050" : C.panelHi,
                  color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 15, fontWeight: 600, touchAction: "manipulation",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span>↻ {ip.name}</span>
                    <Stars value={ipStars(ip, s.week)} size={15} />
                  </div>
                  <div style={{ fontSize: 12, color: C.dim, fontWeight: 400, marginTop: 2 }}>
                    {ip.fans.toLocaleString()} fans · entry #{ip.entries + 1} · beat a {ip.lastScore} score{ip.fatigue > 15 ? ` · fatigue ${Math.round(ip.fatigue)}%` : ""}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
        {remakeCandidates.length > 0 && (
          <>
            <div style={{ fontSize: 13, color: C.dim, margin: "0 0 6px", letterSpacing: 1 }}>OR REMAKE A CLASSIC</div>
            <div style={{ display: "grid", gap: 8, marginBottom: 14, maxHeight: 160, overflowY: "auto" }}>
              {remakeCandidates.map(orig => chip(
                draft.remakeOf?.id === orig.id,
                () => chooseRemake(orig),
                `♻ ${orig.name} (${orig.year})`,
                `Scored ${orig.score} — beat that or fans call it a cash grab. Dev cost −15%.`
              ))}
            </div>
          </>
        )}
        {draft.remakeOf && (
          <div style={{ background: C.panelHi, borderRadius: 14, padding: 12, marginBottom: 14, fontSize: 14, lineHeight: 1.6, border: `2px solid ${C.gold}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { id: "remake", label: "♻ Full Remake", sub: "Ground-up rebuild · −15% cost · +2 quality · no ceiling" },
                { id: "remaster", label: "✨ Remaster", sub: `Facelift · −60% cost · half the work · score capped at ${draft.remakeOf.score + 6}` },
              ].map(m => (
                <button key={m.id} onClick={() => setDraft(v => ({ ...v, remakeOf: { ...v.remakeOf, mode: m.id } }))} style={{
                  padding: "10px 12px", minHeight: 52, borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: `2px solid ${draft.remakeOf.mode === m.id ? C.gold : C.line}`,
                  background: draft.remakeOf.mode === m.id ? "#3A3110" : C.panel,
                  color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, touchAction: "manipulation",
                }}>
                  {m.label}
                  <div style={{ fontSize: 11, color: C.dim, fontWeight: 400, marginTop: 2 }}>{m.sub}</div>
                </button>
              ))}
            </div>
            "<b style={{ color: C.gold }}>{draft.remakeOf.name}</b>" ({draft.remakeOf.year}) scored {draft.remakeOf.score} — but the legend has grown: fans expect <b style={{ color: C.gold }}>{draft.remakeOf.expectation}+</b>.
            Meet it and sales soar, the original re-enters the charts, and your rep climbs. Miss it by 8+ and you get review-bombed{draft.ip ? " — and the IP fans take it personally" : ""}.
          </div>
        )}
        {draft.ip && (
          <div style={{ background: `linear-gradient(135deg, hsl(${draft.ip.hue} 45% 26%), ${C.panelHi})`, borderRadius: 14, padding: 12, marginBottom: 14, fontSize: 14, lineHeight: 1.5 }}>
            <b style={{ color: `hsl(${draft.ip.hue} 70% 72%)` }}>{draft.ip.name}</b> — entry #{draft.ip.entryNo}. Any genre, topic, or size is fair game: mainline it, spin it off, reinvent it. Fans expect <b style={{ color: C.gold }}>{draft.ip.expectation}+</b>. Asset reuse: dev cost −25% and a hype head start.
            {draft.ip.blueprintFrom && (
              <div style={{ marginTop: 6, fontSize: 13, color: C.cyan }}>
                📐 Blueprint loaded from "{draft.ip.blueprintFrom}" — genre, topic, and dev focus prefilled below. Change anything.
              </div>
            )}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input value={draft.name} placeholder="Game title"
            onChange={e => setDraft(v => ({ ...v, name: e.target.value }))}
            style={{ flex: 1, fontSize: 18, padding: "12px 14px", borderRadius: 12, border: `2px solid ${C.line}`, background: C.panelHi, color: C.ink, fontFamily: "'Rubik', sans-serif", outline: "none" }} />
          <Btn small kind="ghost" onClick={() => setDraft(v => ({ ...v, name: (v.ip ? v.ip.name + ": " : "") + pick(NAME_A) + " " + pick(NAME_B) }))}>🎲</Btn>
        </div>
        <div style={{ fontSize: 13, color: C.dim, margin: "10px 0 6px", letterSpacing: 1 }}>GENRE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {GENRES.map(gg => chip(draft.genre === gg.id, () => setDraft(v => ({ ...v, genre: gg.id })), gg.name))}
        </div>
        <div style={{ fontSize: 13, color: C.dim, margin: "14px 0 6px", letterSpacing: 1 }}>TOPIC</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 240, overflowY: "auto" }}>
          {activeTopics.map(tt => chip(draft.topic === tt.id, () => setDraft(v => ({ ...v, topic: tt.id })), tt.name))}
        </div>
        <div style={{ marginTop: 12, fontWeight: 700, color: combo.startsWith("🔥") ? C.gold : combo.startsWith("🧊") ? C.red : C.dim }}>{combo}</div>
        {(() => {
          const mf = marketFactor(s, draft.genre, draft.topic);
          return (
            <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14, color: mf >= 1.05 ? C.green : mf >= 0.9 ? C.dim : C.red }}>
              {mf >= 1.05 ? "🌱 Starved market — buyers are hungry (+10% sales)"
                : mf >= 0.9 ? "🛒 Open market"
                : `🥵 Crowded market — too many similar releases lately (−${Math.round((1 - mf) * 100)}% sales)`}
            </div>
          );
        })()}
        {riding && (
          <div style={{ marginTop: 6, fontWeight: 700, color: C.mag }}>
            📈 Riding the {trendLabel(s.trend)} trend — ship it before the wave breaks (~{Math.max(1, s.trend.endWeek - s.week)}w).
          </div>
        )}
      </Panel>

      <Panel title="2 · PLATFORM & SCOPE" accent={C.cyan}>
        <div style={{ display: "grid", gap: 8 }}>
          {activePlatforms.map(pp => {
            const fate = platFate(s, pp);
            const phase = platPhase(s, pp, s.week);
            const verdict = fate.revealed && fate.verdict === "hit" ? " · 🚀 winning the war" : fate.revealed && fate.verdict === "flop" ? " · 💀 flopping" : "";
            return chip(draft.platform === pp.id, () => setDraft(v => ({ ...v, platform: pp.id, exclusive: false })),
              `${pp.name} · lic ${money$(effLicense(s, pp, s.week))}`,
              `${Math.round(platShareNow(s, pp, s.week) * 100)}% market · ${phase}${verdict} — ${pp.blurb}`);
          })}
        </div>
        <div style={{ fontSize: 13, color: C.dim, margin: "14px 0 6px", letterSpacing: 1 }}>ENGINE</div>
        <div style={{ display: "grid", gap: 8 }}>
          {chip(!draft.engine, () => setDraft(v => ({ ...v, engine: null })), "No engine", "Raw code — power 0. Fine in 1984, suicide later.")}
          {(s.engines || []).map(e => {
            const pw = enginePowerFromParts(e.parts);
            return chip(draft.engine === e.id, () => setDraft(v => ({ ...v, engine: e.id })), `${e.name} v${e.version}`, `Power ${pw} · in-house, no fee`);
          })}
          {(s.licensedEngines || []).map(l => chip(draft.engine === "lic:" + l.id, () => setDraft(v => ({ ...v, engine: "lic:" + l.id })), `${l.name} (licensed)`, `Power ${l.power} · ${money$(l.perGame)} per game`))}
        </div>
        {(() => {
          const engQ = draftEngine ? Math.round(draftEngine.power * 0.35) : 0;
          const gap = plat.tech * 8 - (10 + engQ);
          return gap > 10 ? (
            <div style={{ marginTop: 8, fontSize: 13, color: C.red, fontWeight: 700 }}>
              ⚠ {draftEngine ? draftEngine.name : "No engine"} is underpowered for the {plat.name}. Critics will notice the tech gap.
            </div>
          ) : null;
        })()}
        {plat.holder && (() => {
          const rel = s.holders?.[plat.holder]?.rel ?? 50;
          const fund = Math.round(size.cost * 0.5 * (1 + rel / 100));
          return (
            <button onClick={() => setDraft(v => ({ ...v, exclusive: !v.exclusive }))} style={{
              width: "100%", marginTop: 10, padding: "10px 12px", minHeight: 48, borderRadius: 12, cursor: "pointer", textAlign: "left",
              border: `2px solid ${draft.exclusive ? C.cyan : C.line}`, background: draft.exclusive ? "#123A3E" : C.panelHi,
              color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, touchAction: "manipulation",
            }}>
              🤝 {plat.holder} exclusivity {draft.exclusive ? "— SIGNED" : "— available"}
              <div style={{ fontSize: 11, color: C.dim, fontWeight: 400, marginTop: 2 }}>
                {money$(fund)} marketing fund up front (rel {Math.round(rel)}) + 25% sales on {plat.name} — but this game can never be ported.
              </div>
            </button>
          );
        })()}
        <div style={{ fontSize: 13, color: C.dim, margin: "14px 0 6px", letterSpacing: 1 }}>PROJECT SIZE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {SIZES.map(z => chip(draft.size === z.id, () => setDraft(v => ({
            ...v, size: z.id, alloc: normalizeAlloc(v.alloc, z.points),
          })), z.name, `${Math.round(z.weeks * workScale(plat.tech))} work · min ${z.minWeeks}w · needs ${z.minStaff}+ staff`))}
        </div>
      </Panel>

      <Panel title="3 · PUBLISHING" accent={C.green} style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontSize: 14, color: C.dim, marginBottom: 12 }}>
          A garage studio's game sinks without distribution — a publisher's logo is why anyone buys from a studio they've never heard of. The price: they keep 65% of revenue{`, and unless you negotiate otherwise, the IP too`}.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
          <button onClick={() => setPub(null)} style={{
            padding: "12px 14px", minHeight: 64, borderRadius: 12, cursor: "pointer", textAlign: "left",
            border: `2px solid ${!pub ? C.green : C.line}`, background: !pub ? "#123A28" : C.panelHi,
            color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 15, fontWeight: 700, touchAction: "manipulation",
          }}>
            ✊ Self-publish
            <div style={{ fontSize: 12, color: C.dim, fontWeight: 400, marginTop: 2 }}>
              Keep 100% of revenue and the IP. Sales lean entirely on your {s.fans.toLocaleString()} fans.
            </div>
          </button>
          {PUBLISHERS.map(name => {
            const rel = s.publishers?.[name]?.rel ?? 50;
            const terms = pubDealTerms(name, rel, devCost, pub?.name === name ? pub.keepIp : false);
            const outgrown = s.fans > terms.floor;
            const refuses = rel < 25;
            return (
              <button key={name} disabled={refuses} onClick={() => setPub(v => v?.name === name ? v : { name, keepIp: false })} style={{
                padding: "12px 14px", minHeight: 64, borderRadius: 12, cursor: refuses ? "default" : "pointer", textAlign: "left",
                border: `2px solid ${pub?.name === name ? C.green : C.line}`, background: pub?.name === name ? "#123A28" : C.panelHi,
                color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 15, fontWeight: 700, touchAction: "manipulation", opacity: refuses ? 0.5 : 1,
              }}>
                📮 {name} <span style={{ fontSize: 11, color: rel >= 65 ? C.gold : rel >= 40 ? C.dim : C.red }}>rel {Math.round(rel)}</span>
                <div style={{ fontSize: 12, color: C.dim, fontWeight: 400, marginTop: 2 }}>
                  {refuses
                    ? "Won't work with you after last time."
                    : `Advance ${money$(terms.advance)} · reach ~${(terms.floor / 1000).toFixed(0)}K fans · you keep 35% · score guarantee: 55+`}
                  {!refuses && outgrown && <span style={{ color: C.gold, fontWeight: 700 }}> · Your fans exceed their reach — you don't need them anymore.</span>}
                </div>
              </button>
            );
          })}
        </div>
        {pub && (
          <button onClick={() => setPub(v => ({ ...v, keepIp: !v.keepIp }))} style={{
            width: "100%", marginTop: 10, padding: "10px 12px", minHeight: 48, borderRadius: 12, cursor: "pointer", textAlign: "left",
            border: `2px solid ${pub.keepIp ? C.gold : C.line}`, background: pub.keepIp ? "#3A3110" : C.panelHi,
            color: C.ink, fontFamily: "'Rubik', sans-serif", fontSize: 14, fontWeight: 700, touchAction: "manipulation",
          }}>
            📜 Keep the IP rights {pub.keepIp ? "— YES (advance halved)" : "— NO (they own the franchise)"}
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 400, marginTop: 2 }}>
              If this game becomes a franchise, whoever holds the rights owns it. Half the advance buys your name on the deed.
            </div>
          </button>
        )}
      </Panel>

      <Panel title="4 · DEV FOCUS" accent={C.gold} style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontSize: 15, color: C.dim, marginBottom: 14 }}>
          Allocate all <b style={{ color: C.gold }}>{size.points}</b> focus points. {g.name} games reward a particular balance — experiment.
          <span style={{ float: "right", fontWeight: 800, color: left === 0 ? C.green : C.gold }}>{left} left</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {["gameplay", "graphics", "story", "sound"].map(k => (
            <div key={k} style={{ background: C.panelHi, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, textTransform: "capitalize", fontSize: 16 }}>{k}</div>
                <div style={{ fontFamily: "'Bungee', cursive", fontSize: 24, color: C.cyan }}>{draft.alloc[k]}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small kind="ghost" onClick={() => bump(k, -1)} style={{ width: 52 }}>−</Btn>
                <Btn small color={C.cyan} onClick={() => bump(k, +1)} style={{ width: 52 }}>+</Btn>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 16 }}>
            {(() => {
              const work = Math.round(size.weeks * workScale(plat.tech) * remakeWorkMult);
              const out = effTeamOutput(s.staff, team, s.tech.includes("devtools") ? 1.1 : 1) || 0.1;
              const est = Math.max(size.minWeeks, Math.ceil(work / out));
              return (
                <div style={{ marginBottom: 6 }}>
                  📅 Estimated: <b style={{ color: C.cyan }}>~{est} weeks</b> of development with Team {team} <span style={{ color: C.dim }}>(+ polish)</span>
                </div>
              );
            })()}
            {(() => {
              const deal = pub ? pubDealTerms(pub.name, s.publishers?.[pub.name]?.rel ?? 50, devCost, pub.keepIp) : null;
              const net = cost - (deal?.advance || 0);
              return (
                <>
                  Upfront cost: <b style={{ color: C.gold }}>{money$(cost)}</b>
                  <span style={{ color: C.dim }}> (dev {money$(devCost)}{draft.ip ? " after IP asset reuse" : ""} + platform {money$(effLicense(s, plat, s.week))}{engFee ? ` + engine fee ${money$(engFee)}` : ""})</span>
                  {deal && (
                    <div style={{ marginTop: 4 }}>
                      📮 {deal.name} advance: <b style={{ color: C.green }}>+{money$(deal.advance)}</b> → net {net <= 0
                        ? <b style={{ color: C.green }}>{money$(-net)} in your pocket day one</b>
                        : <b style={{ color: C.gold }}>{money$(net)}</b>}
                    </div>
                  )}
                  {draft.exclusive && plat.holder && (
                    <div style={{ marginTop: 4 }}>
                      🤝 {plat.holder} marketing fund: <b style={{ color: C.cyan }}>+{money$(Math.round(size.cost * 0.5 * (1 + (s.holders?.[plat.holder]?.rel ?? 50) / 100)))}</b>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          <Btn color={C.green} disabled={!canStart} onClick={() => startProject({ ...draft, team, pubDeal: pub ? pubDealTerms(pub.name, s.publishers?.[pub.name]?.rel ?? 50, devCost, pub.keepIp) : null })}>
            🎮 Start development {twoTeams ? `(Team ${team})` : ""}
          </Btn>
        </div>
        {!canStart && (
          <div style={{ marginTop: 8, fontSize: 14, color: C.dim }}>
            {!draft.name.trim() ? "Give your game a title. " : ""}
            {left !== 0 ? "Spend all focus points. " : ""}
            {s.money < cost ? "Not enough cash. " : ""}
            {s.staff.length < size.minStaff ? `Needs at least ${size.minStaff} team members. ` : ""}
          </div>
        )}
      </Panel>
    </div>
    </>
  );
}

function TeamTab({ s, hire, fire, office, recruitAd, recruitHeadhunter, poachRival, toggleRest, setLead, assignTeam }) {
  const yr = yearOf(s.week);
  const disc = s.tech.includes("talent") ? 0.7 : 1;
  const adCost = Math.round(400 * (1 + (yr - 1984) * 0.06) * disc);
  const hhCost = Math.round(2500 * (1 + (yr - 1984) * 0.06) * disc);
  const poachTargets = independentRivals(s).sort((a, b) => b.skill - a.skill).slice(0, 6);
  const StatPip = ({ label, v }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Bungee', cursive", fontSize: 16, color: v >= 8 ? C.gold : v >= 5 ? C.cyan : C.dim }}>{v}</div>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
      <Panel title={`YOUR TEAM · ${s.staff.length}/${office.cap}`} accent={C.cyan}>
        {s.staff.map(m => {
          const energy = Math.round(m.energy ?? 100);
          const isLead = s.leadId === m.id;
          return (
            <div key={m.id} style={{ padding: "12px 0", borderBottom: `1px solid ${C.line}`, opacity: m.resting ? 0.65 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ minWidth: 130 }}>
                  <div style={{ fontWeight: 700 }}>
                    <button onClick={() => setLead(m.id)} title="Make lead" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, padding: "2px 4px", opacity: isLead ? 1 : 0.3 }}>👑</button>
                    {m.name} <span style={{ color: C.gold, fontSize: 12 }}>Lv{m.level ?? 1}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.dim }}>{m.role} · {money$(m.salary)}/wk{m.trait ? ` · ${TRAITS[m.trait]?.name}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <StatPip label="Code" v={m.code} /><StatPip label="Dsgn" v={m.design} /><StatPip label="Art" v={m.art} /><StatPip label="Snd" v={m.sound} />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {s.office >= 3 && (
                    <Btn small kind="ghost" color={C.gold} onClick={() => assignTeam(m.id)} style={{ minWidth: 44 }}>
                      {(m.team || "A")}
                    </Btn>
                  )}
                  <Btn small kind="ghost" onClick={() => toggleRest(m.id)}>{m.resting ? "Return" : "Rest"}</Btn>
                  {m.id !== "founder" && <Btn small kind="ghost" color={C.red} onClick={() => fire(m.id)} style={{ color: C.red }}>✕</Btn>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                  <div style={{ width: `${energy}%`, height: "100%", background: energy < 20 ? C.red : energy < 50 ? C.gold : C.green }} />
                </div>
                <span style={{ fontSize: 11, color: energy < 20 ? C.red : C.dim, width: 84, flexShrink: 0 }}>
                  {m.resting ? "Resting" : energy < 20 ? "🔥 Burned out" : `Energy ${energy}%`}
                </span>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>👑 The lead's skills weight their team's projects 30% and they earn double XP. Burned-out staff (energy under 20%) work at half speed — Rest to recover.{s.office >= 3 ? " A/B assigns each person to a dev team — each team runs its own project." : ""}</div>
      </Panel>
      <Panel title="RECRUITING" accent={C.gold}>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 12 }}>Applicants don't come to you — go find them. Signing bonus on hire = 4 weeks' salary.</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          <Btn small color={C.cyan} disabled={s.money < adCost} onClick={recruitAd} style={{ width: "100%" }}>
            📰 Post a job ad — {money$(adCost)} · 3 applicants
          </Btn>
          <Btn small color={C.gold} disabled={s.money < hhCost} onClick={recruitHeadhunter} style={{ width: "100%" }}>
            🎩 Hire a headhunter — {money$(hhCost)} · 2 senior candidates
          </Btn>
        </div>
        <div style={{ fontSize: 13, color: C.dim, letterSpacing: 1, marginBottom: 8 }}>🕵 POACH FROM A RIVAL <span style={{ letterSpacing: 0, textTransform: "none" }}>· their skill sets the talent, their prestige sets the price</span></div>
        {poachTargets.map(r => {
          const cost = Math.round((1500 + r.prestige * 0.12 + r.skill * 40) * disc);
          return (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0", borderTop: `1px solid ${C.line}` }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: `hsl(${r.hue} 65% 70%)` }}>{r.name}</div>
                <div style={{ fontSize: 12, color: C.dim, textTransform: "capitalize" }}>{trajectoryOf(r)} · form {Math.round(r.skill)}</div>
              </div>
              <Btn small kind="ghost" disabled={s.money < cost} onClick={() => poachRival(r.id)}>{money$(cost)}</Btn>
            </div>
          );
        })}
      </Panel>
      <Panel title="APPLICANTS" accent={C.mag}>
        {!s.candidates.length && <div style={{ color: C.dim, fontSize: 15 }}>The pool is empty. Post an ad, call a headhunter, or raid a rival.</div>}
        {s.candidates.map(c => {
          const signing = c.salary * 4;
          const full = s.staff.length >= office.cap;
          return (
            <div key={c.id} style={{ background: C.panelHi, borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.dim }}>{c.role} · {money$(c.salary)}/wk{c.trait ? ` · ${TRAITS[c.trait]?.name} (${TRAITS[c.trait]?.desc.toLowerCase()})` : ""}</div>
                </div>
                <Btn small color={C.green} disabled={full || s.money < signing} onClick={() => hire(c)}>
                  Hire {money$(signing)}
                </Btn>
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                <StatPip label="Code" v={c.code} /><StatPip label="Dsgn" v={c.design} /><StatPip label="Art" v={c.art} /><StatPip label="Snd" v={c.sound} />
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

function ResearchTab({ s, buyTech, buyEngineTech, buildEngine, updateEngine, toggleEngineLicense, licenseRivalEngine }) {
  const year = yearOf(s.week);
  const [engineName, setEngineName] = useState("");
  const researchedPower = enginePowerFromParts(s.engineTechs || []);
  const buildCost = 3000 + researchedPower * 150;
  const era = eraPower(year);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* ---- YOUR ENGINES ---- */}
      <Panel title="ENGINE WORKSHOP" accent={C.mag}>
        {(s.engines || []).length === 0 && (
          <div style={{ color: C.dim, fontSize: 15, marginBottom: 12 }}>
            No engines yet. Research technologies below, then build them into an engine — games built without one take a growing quality hit as hardware advances.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 12 }}>
          {(s.engines || []).map(e => {
            const pw = enginePowerFromParts(e.parts);
            const newParts = (s.engineTechs || []).filter(p => !e.parts.includes(p));
            const addPw = enginePowerFromParts([...e.parts, ...newParts]) - pw;
            const updCost = 1500 + Math.max(0, addPw) * 150;
            const behind = pw < era * 0.55;
            return (
              <div key={e.id} style={{ background: C.panelHi, border: `2px solid ${behind ? C.red : C.line}`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontFamily: "'Bungee', cursive", fontSize: 16, marginBottom: 4 }}>{e.name} <span style={{ color: C.cyan }}>v{e.version}</span></div>
                <Row k="Power" v={pw} color={pw >= era ? C.gold : pw >= era * 0.7 ? C.cyan : C.red} />
                <Row k="Era benchmark" v={era} />
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "8px 0" }}>
                  {ENGINE_CATS.map(cat => {
                    const best = ENGINE_TECHS.filter(t => t.cat === cat && e.parts.includes(t.id)).sort((a, b) => b.power - a.power)[0];
                    return <span key={cat} style={{ fontSize: 11, background: C.panel, borderRadius: 8, padding: "3px 8px", color: best ? C.ink : C.dim }}>{cat}: {best ? best.power : "—"}</span>;
                  })}
                </div>
                {e.licensed && <Row k="Licensees" v={`${e.licensees} · ${money$(e.licensees * (50 + pw * 4))}/wk`} color={C.green} />}
                {behind && <div style={{ fontSize: 12, color: C.red, marginBottom: 6 }}>⚠ Falling behind the era — licensees will churn and games suffer.</div>}
                <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
                  <Btn small color={C.cyan} disabled={!newParts.length || s.money < updCost} onClick={() => updateEngine(e.id)} style={{ width: "100%" }}>
                    {newParts.length ? `Update to v${e.version + 1} · ${money$(updCost)} (+${addPw} power)` : "Up to date with your research"}
                  </Btn>
                  <Btn small kind="ghost" onClick={() => toggleEngineLicense(e.id)} style={{ width: "100%" }}>
                    {e.licensed ? "Withdraw from licensing" : "💼 Offer for licensing"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
          <div style={{ fontSize: 13, color: C.dim, letterSpacing: 1, marginBottom: 8 }}>BUILD A NEW ENGINE — includes every technology you've researched</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={engineName} placeholder="Engine name" onChange={e => setEngineName(e.target.value)}
              style={{ flex: 1, minWidth: 160, fontSize: 16, padding: "12px 14px", borderRadius: 12, border: `2px solid ${C.line}`, background: C.panelHi, color: C.ink, fontFamily: "'Rubik', sans-serif", outline: "none" }} />
            <Btn small color={C.mag} disabled={!engineName.trim() || !(s.engineTechs || []).length || s.money < buildCost}
              onClick={() => { buildEngine(engineName); setEngineName(""); }}>
              Build · {money$(buildCost)} (power {researchedPower})
            </Btn>
          </div>
        </div>
      </Panel>

      {/* ---- ENGINE TECH RESEARCH ---- */}
      <Panel title={`ENGINE TECHNOLOGY · ${Math.floor(s.rp)} RP`} accent={C.cyan}>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 12 }}>An engine's power is the best technology per category, summed. Research wide, then update your engine to ship it.</div>
        {ENGINE_CATS.map(cat => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Bungee', cursive", fontSize: 12, letterSpacing: 1, color: C.gold, marginBottom: 6 }}>{cat.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ENGINE_TECHS.filter(t => t.cat === cat).map(t => {
                const owned = (s.engineTechs || []).includes(t.id);
                const reqLocked = t.req && !(s.engineTechs || []).includes(t.req);
                const eraLocked = t.yr && year < t.yr;
                const locked = reqLocked || eraLocked;
                return (
                  <div key={t.id} style={{ background: owned ? "#1F3A2C" : C.panelHi, border: `2px solid ${owned ? C.green : C.line}`, borderRadius: 12, padding: "10px 12px", opacity: locked ? 0.45 : 1, minWidth: 150 }}>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>power {t.power}{eraLocked ? ` · ${t.yr}` : ""}</div>
                    {owned
                      ? <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginTop: 4 }}>✓</div>
                      : <Btn small color={C.gold} disabled={locked || s.rp < t.cost} onClick={() => buyEngineTech(t)} style={{ marginTop: 6, minHeight: 36, padding: "6px 12px" }}>{t.cost} RP</Btn>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Panel>

      {/* ---- LICENSE A RIVAL ENGINE ---- */}
      {(s.engineMarket || []).length > 0 && (
        <Panel title="ENGINE LICENSING MARKET" accent={C.gold}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>Skip the R&D grind — license someone else's engine. Upfront fee plus a per-game charge.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {s.engineMarket.map(o => (
              <div key={o.id} style={{ background: C.panelHi, borderRadius: 14, padding: 14, border: `1px solid ${C.line}` }}>
                <div style={{ fontWeight: 800 }}>{o.name}</div>
                <div style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>by {o.owner}</div>
                <Row k="Power" v={o.power} color={o.power >= era ? C.gold : C.cyan} />
                <Row k="Per game" v={money$(o.perGame)} />
                <Btn small color={C.green} disabled={s.money < o.upfront} onClick={() => licenseRivalEngine(o)} style={{ width: "100%", marginTop: 8 }}>
                  License · {money$(o.upfront)}
                </Btn>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ---- STUDIO PERKS ---- */}
      <Panel title="STUDIO PERKS" accent={C.gold}>
        <div style={{ fontSize: 14, color: C.dim, marginBottom: 14 }}>Research points come from active development, contracts, conventions, and successful releases.</div>
        {TECH_CATS.map(cat => (
          <div key={cat} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "'Bungee', cursive", fontSize: 13, letterSpacing: 1, color: C.cyan, marginBottom: 8 }}>{cat.toUpperCase()}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {TECH_TREE.filter(t => t.cat === cat).map(t => {
                const owned = s.tech.includes(t.id);
                const reqLocked = t.req && !s.tech.includes(t.req);
                const eraLocked = t.yr && year < t.yr;
                const locked = reqLocked || eraLocked;
                return (
                  <div key={t.id} style={{ background: owned ? "#1F3A2C" : C.panelHi, border: `2px solid ${owned ? C.green : C.line}`, borderRadius: 14, padding: 14, opacity: locked ? 0.5 : 1 }}>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: C.dim, marginBottom: 12, minHeight: 34 }}>
                      {t.effect}
                      {reqLocked ? ` · requires ${TECH_TREE.find(x => x.id === t.req).name}` : ""}
                      {eraLocked ? ` · the tech doesn't exist yet (${t.yr})` : ""}
                    </div>
                    {owned
                      ? <div style={{ color: C.green, fontWeight: 800 }}>✓ Researched</div>
                      : <Btn small color={C.gold} disabled={locked || s.rp < t.cost} onClick={() => buyTech(t)}>{t.cost} RP</Btn>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function IpTab({ s, sellIp, buyIp, renameIp, buybackPubIp, openTalks, orderSequel, injectCapital, absorbSubsidiary, sellSubsidiary }) {
  const sellCut = s.tech.includes("iplaw") ? 1 : 0.9;
  const buyCut = s.tech.includes("iplaw") ? 0.95 : 1;
  const [confirmSell, setConfirmSell] = useState(null); // ipId pending confirmation
  const [renaming, setRenaming] = useState(null);       // { ipId, value }
  const [confirmAcq, setConfirmAcq] = useState(null);    // rivalId pending acquisition
  const myIps = Object.values(s.ips || {}).sort((a, b) => ipStars(b, s.week) - ipStars(a, s.week));
  const rivalList = Object.values(s.rivals || {}).filter(r => r.active || r.defunct).sort((a, b) => (b.defunct ? -1 : b.prestige) - (a.defunct ? -1 : a.prestige));
  const soldList = rivalList.flatMap(r => r.ips.filter(ip => ip.formerYours).map(ip => ({ ...ip, ownerName: r.name, ownerDefunct: r.defunct })));

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Panel title="YOUR IP PORTFOLIO" accent={C.gold}>
        {myIps.length === 0 && (
          <div style={{ color: C.dim, fontSize: 16, lineHeight: 1.5 }}>
            You don't own any IP yet. Release an original game and it registers automatically — or buy one off the market below.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {myIps.map(ip => {
            const stars = ipStars(ip, s.week);
            const value = ipValue(ip, s.week);
            const inDev = s.project?.ip?.ipId === ip.id || s.projectB?.ip?.ipId === ip.id;
            const entries = s.released.filter(g => g.ipId === ip.id).sort((a, b) => (a.entryNo || 0) - (b.entryNo || 0));
            const idle = ip.lastWeek != null ? s.week - ip.lastWeek : 0;
            return (
              <div key={ip.id} style={{ background: C.panelHi, border: `2px solid hsl(${ip.hue} 60% 55%)`, borderRadius: 14, padding: 14 }}>
                {renaming?.ipId === ip.id ? (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <input
                      value={renaming.value}
                      autoFocus
                      onChange={e => setRenaming({ ipId: ip.id, value: e.target.value })}
                      style={{ flex: 1, fontSize: 16, padding: "10px 12px", borderRadius: 10, border: `2px solid hsl(${ip.hue} 60% 55%)`, background: C.panel, color: C.ink, fontFamily: "'Rubik', sans-serif", outline: "none", minWidth: 0 }}
                    />
                    <Btn small color={C.green} disabled={!renaming.value.trim()} onClick={() => { renameIp(ip.id, renaming.value); setRenaming(null); }}>Save</Btn>
                    <Btn small kind="ghost" onClick={() => setRenaming(null)}>✕</Btn>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: `hsl(${ip.hue} 70% 70%)` }}>{ip.name}</div>
                      <button onClick={() => setRenaming({ ipId: ip.id, value: ip.name })} title="Rename IP" style={{
                        background: "none", border: "none", color: C.dim, fontSize: 16, cursor: "pointer",
                        padding: 6, minWidth: 32, minHeight: 32, touchAction: "manipulation",
                      }}>✎</button>
                    </div>
                    <Stars value={stars} size={17} />
                  </div>
                )}
                <Row k="Appraised value" v={money$(value)} color={C.green} />
                <Row k="Fans" v={ip.fans.toLocaleString()} color={C.cyan} />
                <Row k="Entries" v={ip.entries} />
                <Row k="Last score" v={`${ip.lastScore}/100`} color={ip.lastScore >= 75 ? C.gold : C.ink} />
                <Row k="Fatigue" v={`${Math.round(ip.fatigue)}%`} color={ip.fatigue > 40 ? C.red : ip.fatigue > 15 ? C.gold : C.green} />
                {idle > 208 && <div style={{ fontSize: 13, color: C.red, marginTop: 4 }}>⚠ Dormant {Math.floor(idle / 52)} years — stars are fading.</div>}
                {entries.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {entries.map(e => (
                      <div key={e.id} title={e.name} style={{
                        width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Bungee', cursive", fontSize: 12,
                        background: e.score >= 80 ? C.gold : e.score >= 60 ? C.cyan : C.red, color: "#1A1633",
                      }}>{e.score}</div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  {confirmSell === ip.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small color={C.red} onClick={() => { sellIp(ip.id); setConfirmSell(null); }} style={{ flex: 1, color: "#fff" }}>
                        Confirm — {money$(Math.round(value * sellCut))}
                      </Btn>
                      <Btn small kind="ghost" onClick={() => setConfirmSell(null)}>Keep</Btn>
                    </div>
                  ) : (
                    <Btn small kind="ghost" disabled={inDev} onClick={() => setConfirmSell(ip.id)} style={{ width: "100%" }}>
                      {inDev ? "In development — can't sell" : `Sell IP · ~${money$(Math.round(value * sellCut))}${sellCut < 1 ? " after fees" : " — no fees"}`}
                    </Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="IP MARKET" accent={C.mag}>
        {s.market.length === 0 ? (
          <div style={{ color: C.dim, fontSize: 16 }}>Nothing listed right now. Rival studios put IP up for sale from time to time — check back.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {s.market.map(m => {
              const stars = ipStars(m.ip, s.week);
              const seller = m.sellerId ? s.rivals?.[m.sellerId] : null;
              return (
                <div key={m.ip.id} style={{
                  background: C.panelHi, borderRadius: 14, padding: 14,
                  border: `2px solid ${m.buyback ? C.gold : m.fireSale ? C.red : C.line}`,
                }}>
                  {m.buyback && (
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#1A1633", background: C.gold, display: "inline-block", padding: "3px 10px", borderRadius: 8, marginBottom: 8, marginRight: 6 }}>
                      ★ YOUR FORMER IP
                    </div>
                  )}
                  {m.fireSale && (
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#fff", background: C.red, display: "inline-block", padding: "3px 10px", borderRadius: 8, marginBottom: 8 }}>
                      🔥 FIRE SALE
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
                    <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17 }}>{m.ip.name}</div>
                    <Stars value={stars} size={17} />
                  </div>
                  {seller && <Row k="Seller" v={`${seller.name}${seller.defunct ? " (defunct)" : ""}`} />}
                  <Row k="Fans" v={m.ip.fans.toLocaleString()} color={C.cyan} />
                  <Row k="Entries" v={m.ip.entries} />
                  <Row k="Last score" v={`${m.ip.lastScore}/100`} />
                  <Row k="Listing expires" v={`${m.weeksLeft}w`} color={m.weeksLeft <= 4 ? C.red : C.dim} />
                  <div style={{ marginTop: 12 }}>
                    <Btn small color={C.green} disabled={s.money < Math.round(m.price * buyCut)} onClick={() => buyIp(m)} style={{ width: "100%" }}>
                      Buy — {money$(Math.round(m.price * buyCut))}{buyCut < 1 ? " (lawyered)" : ""}
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {(s.pubIps || []).length > 0 && (
        <Panel title="YOUR FRANCHISES — HELD BY PUBLISHERS" accent={C.gold}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>
            You made these; a publisher owns them. That's the deal you signed. Buying one back costs a premium.
          </div>
          {s.pubIps.map(ip => {
            const price = Math.round(ipValue(ip, s.week) * 1.4);
            return (
              <div key={ip.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${C.line}`, gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{ip.name}</div>
                  <div style={{ fontSize: 12, color: C.dim }}>Owned by {ip.publisher} · {ip.fans.toLocaleString()} fans · scored {ip.lastScore}</div>
                </div>
                <Btn small color={C.gold} disabled={s.money < price} onClick={() => buybackPubIp(ip.id)}>Buy back · {money$(price)}</Btn>
              </div>
            );
          })}
        </Panel>
      )}

      {soldList.length > 0 && (
        <Panel title="SOLD IP — UNDER RIVAL OWNERSHIP" accent={C.cyan}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>
            You'll see it in the log if a rival puts one of these back on the market.
          </div>
          {soldList.map(ip => (
            <div key={ip.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${C.line}`, gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{ip.name}</div>
                <div style={{ fontSize: 12, color: C.dim }}>Owned by {ip.ownerName}{ip.ownerDefunct ? " (defunct)" : ""} · {ip.fans.toLocaleString()} fans · last score {ip.lastScore}</div>
              </div>
              <Stars value={ipStars(ip, s.week)} size={15} />
            </div>
          ))}
        </Panel>
      )}

      <Panel title="THE INDUSTRY" accent={C.cyan}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {rivalList.map(r => {
            const traj = trajectoryOf(r);
            const arrow = traj === "rising" ? "↗" : traj === "declining" ? "↘" : traj === "defunct" ? "✕" : "→";
            const arrowColor = traj === "rising" ? C.green : traj === "declining" ? C.red : traj === "defunct" ? C.dim : C.gold;
            const topIp = r.ips.length ? [...r.ips].sort((a, b) => ipStars(b, s.week) - ipStars(a, s.week))[0] : null;
            return (
              <div key={r.id} style={{ background: C.panelHi, border: `1px solid ${C.line}`, borderRadius: 14, padding: 14, opacity: r.defunct ? 0.55 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Bungee', cursive", fontSize: 15, color: `hsl(${r.hue} 65% 70%)` }}>{r.name}</div>
                  <div style={{ fontFamily: "'Bungee', cursive", fontSize: 18, color: arrowColor }} title={traj}>{arrow}</div>
                </div>
                {r.ownedByYou && (
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#1A1633", background: C.gold, display: "inline-block", padding: "3px 10px", borderRadius: 8, marginBottom: 6 }}>
                    ★ YOUR SUBSIDIARY · ~{money$(r.skill < 36 && r.momentum < 0 ? -400 : Math.round(r.prestige * 0.003 + r.skill * 1.5))}/wk
                  </div>
                )}
                <div style={{ fontSize: 12, color: C.cyan, fontWeight: 700, marginBottom: 2 }}>
                  {ARCHETYPES[r.arch]?.label || "Studio"}{r.genres?.length ? ` · ${r.genres.map(gid => genreById(gid)?.name).filter(Boolean).join(" / ")}` : ""}
                </div>
                {r.blurb && <div style={{ fontSize: 12, color: C.dim, fontStyle: "italic", marginBottom: 6 }}>{r.blurb}</div>}
                <div style={{ fontSize: 12, color: C.dim, marginBottom: 8, textTransform: "capitalize" }}>
                  {r.defunct ? `Founded ${r.founded} · ${r.acquiredByYou ? `acquired by you, ${r.defunctYear}` : r.acquiredBy ? `acquired by ${r.acquiredBy}, ${r.defunctYear}` : `closed ${r.defunctYear}`}` : `Founded ${r.founded} · ${traj}`}
                </div>
                {!r.defunct && (
                  <>
                    <Row k="Clout" v={r.prestige.toLocaleString()} color={C.cyan} />
                    <Row k="IP catalog" v={r.ips.length} />
                    {r.awards > 0 && <Row k="Awards" v={`🏆 ${r.awards}`} color={C.gold} />}
                    {r.lastRelease && (
                      <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>
                        Latest: "{r.lastRelease.name}"{r.lastRelease.genre ? ` (${genreById(r.lastRelease.genre)?.name})` : ""} — <b style={{ color: r.lastRelease.score >= 75 ? C.gold : r.lastRelease.score >= 50 ? C.ink : C.red }}>{r.lastRelease.score}</b> ({r.lastRelease.year})
                      </div>
                    )}
                    {topIp && (
                      <div style={{ fontSize: 13, color: C.dim, marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        Flagship IP: <b style={{ color: C.ink }}>{topIp.name}</b> <Stars value={ipStars(topIp, s.week)} size={12} />
                        {topIp.formerYours && <span style={{ color: C.gold, fontWeight: 700 }}>(yours once)</span>}
                      </div>
                    )}
                    <div style={{ marginTop: 12 }}>
                      {r.ownedByYou ? (
                        <div style={{ display: "grid", gap: 6 }}>
                          <Btn small color={C.cyan} disabled={s.money < 5000 || !r.ips.length || r.orderedSequel} onClick={() => orderSequel(r.id)} style={{ width: "100%" }}>
                            {r.orderedSequel ? "📋 Sequel in production" : "📋 Order a sequel · $5,000"}
                          </Btn>
                          <Btn small color={C.gold} disabled={s.money < 15000} onClick={() => injectCapital(r.id)} style={{ width: "100%" }}>
                            💉 Inject capital · $15,000
                          </Btn>
                          {confirmAcq === r.id ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              <Btn small color={C.red} onClick={() => { absorbSubsidiary(r.id); setConfirmAcq(null); }} style={{ flex: 1, color: "#fff" }}>Absorb</Btn>
                              <Btn small color={C.green} onClick={() => { sellSubsidiary(r.id); setConfirmAcq(null); }} style={{ flex: 1 }}>Sell {money$(Math.round(acquisitionPrice(r, s.week) * 0.8))}</Btn>
                              <Btn small kind="ghost" onClick={() => setConfirmAcq(null)}>✕</Btn>
                            </div>
                          ) : (
                            <Btn small kind="ghost" onClick={() => setConfirmAcq(r.id)} style={{ width: "100%" }}>
                              Absorb or sell…
                            </Btn>
                          )}
                        </div>
                      ) : (
                        <Btn small kind="ghost"
                          disabled={r.noTalksUntil && s.week < r.noTalksUntil}
                          onClick={() => openTalks(r.id)} style={{ width: "100%" }}>
                          {r.noTalksUntil && s.week < r.noTalksUntil
                            ? `Talks soured — ${r.noTalksUntil - s.week}w`
                            : `🏦 Make an offer · asking ${money$(acquisitionPrice(r, s.week))}`}
                        </Btn>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function StatsTab({ s }) {
  const fmtMoney = v => Math.abs(v) >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : Math.abs(v) >= 1e3 ? `$${Math.round(v / 1e3)}K` : `$${Math.round(v)}`;
  const fmtNum = v => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${Math.round(v)}`;
  const tipStyle = { background: C.panelHi, border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink, fontSize: 13 };
  const axis = { stroke: C.dim, fontSize: 12, tickLine: false };

  const rel = [...s.released].reverse(); // oldest first
  const lifetime = rel.reduce((a, g) => a + g.salesTotal, 0);
  const avgScore = rel.length ? Math.round(rel.reduce((a, g) => a + g.score, 0) / rel.length) : 0;
  const hits = rel.filter(g => g.score >= 70).length;
  const top = rel.length ? [...rel].sort((a, b) => b.salesTotal - a.salesTotal)[0] : null;

  const timeline = (s.history || []).map(h => ({ yr: +(1984 + h.w / 52).toFixed(2), money: h.money, fans: h.fans }));
  const scores = rel.map((g, i) => ({ n: i + 1, score: g.score, name: g.name, year: g.year }));

  const agg = (list, keyOf, nameOf) => {
    const out = {};
    for (const g of rel) {
      const k = keyOf(g);
      if (!out[k]) out[k] = { name: nameOf(k), games: 0, revenue: 0, sum: 0 };
      out[k].games++; out[k].revenue += g.salesTotal; out[k].sum += g.score;
    }
    return Object.values(out).map(o => ({ ...o, revenue: Math.round(o.revenue), avg: Math.round(o.sum / o.games) }));
  };
  const byGenre = agg(rel, g => g.genre, k => genreById(k)?.name || k).sort((a, b) => b.revenue - a.revenue);
  const byPlat = agg(rel, g => g.platform, k => platById(k)?.name || k).sort((a, b) => b.revenue - a.revenue);
  const sellers = [...rel].sort((a, b) => b.salesTotal - a.salesTotal).slice(0, 8)
    .map(g => ({ name: g.name.length > 18 ? g.name.slice(0, 17) + "…" : g.name, revenue: Math.round(g.salesTotal) }));
  const clout = [
    ...activeRivals(s).map(r => ({ name: r.name, clout: r.prestige, you: false })),
    { name: `${s.studioName} (you)`, clout: s.fans, you: true },
  ].sort((a, b) => b.clout - a.clout);

  if (!rel.length && timeline.length < 2) {
    return <Panel title="ANALYTICS" accent={C.cyan}><div style={{ color: C.dim, fontSize: 16 }}>Not enough data yet. Ship a game or two and let a few months pass — the charts will fill in.</div></Panel>;
  }

  const gameTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return <div style={{ ...tipStyle, padding: "8px 12px" }}><b>"{p.name}"</b> ({p.year})<br />Score: {p.score}/100</div>;
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Panel title="STUDIO VITALS" accent={C.gold}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-around" }}>
          <Stat label="Lifetime revenue" value={fmtMoney(lifetime)} color={C.green} />
          <Stat label="Games shipped" value={rel.length} />
          <Stat label="Avg review" value={rel.length ? `${avgScore}/100` : "—"} color={C.gold} />
          <Stat label="Hit rate (70+)" value={rel.length ? `${Math.round((hits / rel.length) * 100)}%` : "—"} color={C.cyan} />
          <Stat label="Best seller" value={top ? top.name : "—"} color={C.mag} />
        </div>
      </Panel>

      {timeline.length > 1 && (
        <Panel title="CASH & FANS OVER TIME" accent={C.cyan}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeline} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={C.line} strokeDasharray="3 6" />
              <XAxis dataKey="yr" {...axis} tickFormatter={v => Math.floor(v)} minTickGap={40} />
              <YAxis yAxisId="m" {...axis} tickFormatter={fmtMoney} width={56} />
              <YAxis yAxisId="f" orientation="right" {...axis} tickFormatter={fmtNum} width={46} />
              <Tooltip contentStyle={tipStyle} labelFormatter={v => `~${Math.floor(v)}`} formatter={(v, k) => [k === "money" ? fmtMoney(v) : fmtNum(v), k === "money" ? "Cash" : "Fans"]} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line yAxisId="m" type="monotone" dataKey="money" name="Cash" stroke={C.green} strokeWidth={2.5} dot={false} />
              <Line yAxisId="f" type="monotone" dataKey="fans" name="Fans" stroke={C.cyan} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {scores.length > 1 && (
        <Panel title="REVIEW SCORES BY RELEASE" accent={C.gold}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={scores} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={C.line} strokeDasharray="3 6" />
              <XAxis dataKey="n" {...axis} label={{ value: "release #", fill: C.dim, fontSize: 11, position: "insideBottomRight", offset: -2 }} />
              <YAxis domain={[0, 100]} {...axis} width={34} />
              <Tooltip content={gameTip} />
              <Line type="monotone" dataKey="score" stroke={C.gold} strokeWidth={2.5} dot={{ r: 4, fill: C.gold }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {byGenre.length > 0 && (
        <Panel title="GENRE REPORT CARD" accent={C.mag}>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Where the money is vs. where the craft is.</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byGenre} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={C.line} strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="name" {...axis} interval={0} angle={-25} textAnchor="end" height={58} />
              <YAxis yAxisId="r" {...axis} tickFormatter={fmtMoney} width={56} />
              <YAxis yAxisId="a" orientation="right" domain={[0, 100]} {...axis} width={34} />
              <Tooltip contentStyle={tipStyle} formatter={(v, k) => [k === "revenue" ? fmtMoney(v) : `${v}/100`, k === "revenue" ? "Revenue" : "Avg score"]} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar yAxisId="r" dataKey="revenue" name="Revenue" fill={C.mag} radius={[6, 6, 0, 0]} />
              <Bar yAxisId="a" dataKey="avg" name="Avg score" fill={C.gold} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        {byPlat.length > 0 && (
          <Panel title="REVENUE BY PLATFORM" accent={C.cyan}>
            <ResponsiveContainer width="100%" height={Math.max(180, byPlat.length * 38)}>
              <BarChart data={byPlat} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
                <XAxis type="number" {...axis} tickFormatter={fmtMoney} />
                <YAxis type="category" dataKey="name" {...axis} width={104} />
                <Tooltip contentStyle={tipStyle} formatter={v => [fmtMoney(v), "Revenue"]} />
                <Bar dataKey="revenue" fill={C.cyan} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        )}
        {sellers.length > 0 && (
          <Panel title="TOP SELLERS" accent={C.green}>
            <ResponsiveContainer width="100%" height={Math.max(180, sellers.length * 38)}>
              <BarChart data={sellers} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
                <XAxis type="number" {...axis} tickFormatter={fmtMoney} />
                <YAxis type="category" dataKey="name" {...axis} width={128} />
                <Tooltip contentStyle={tipStyle} formatter={v => [fmtMoney(v), "Revenue"]} />
                <Bar dataKey="revenue" fill={C.green} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        )}
      </div>

      <Panel title="INDUSTRY CLOUT" accent={C.gold}>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Your fanbase vs. every active studio's prestige. Climb the chart.</div>
        <ResponsiveContainer width="100%" height={Math.max(200, clout.length * 34)}>
          <BarChart data={clout} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
            <XAxis type="number" {...axis} tickFormatter={fmtNum} />
            <YAxis type="category" dataKey="name" {...axis} width={168} />
            <Tooltip contentStyle={tipStyle} formatter={v => [fmtNum(v), "Clout"]} />
            <Bar dataKey="clout" radius={[0, 6, 6, 0]}>
              {clout.map((c, i) => <Cell key={i} fill={c.you ? C.mag : "#4A4280"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

function ShelfTab({ s, rerelease, portGame, liveUpdate, sunsetLive }) {
  const yr = yearOf(s.week);
  const rrCost = Math.round(2000 * (1 + (yr - 1984) * 0.05));
  const luCost = Math.round(3000 * (1 + Math.max(0, yr - 2010) * 0.05));
  const [detail, setDetail] = useState(null); // game record being inspected
  if (!s.released.length) {
    return <Panel title="THE SHELF" accent={C.mag}><div style={{ color: C.dim, fontSize: 16 }}>Your shelf is empty. Ship a game and it'll live here forever, sticker and all.</div></Panel>;
  }
  return (
    <>
      <Panel title="THE SHELF" accent={C.mag}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {s.released.map(g => (
            <div key={g.id} onClick={() => setDetail(g)} style={{
              background: `linear-gradient(160deg, hsl(${g.hue} 60% 62%), hsl(${g.hue} 65% 40%))`,
              borderRadius: 10, padding: 14, minHeight: 190, position: "relative", cursor: "pointer",
              boxShadow: "0 8px 18px #0007, inset 0 2px 0 #ffffff44",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                {g.entryNo && (
                  <div style={{ background: "#1A1633cc", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.5 }}>
                    ENTRY {g.entryNo}
                  </div>
                )}
                {g.goty && (
                  <div style={{ background: C.gold, color: "#1A1633", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.5 }}>
                    🏆 GOTY
                  </div>
                )}
                {g.trendy && (
                  <div style={{ background: C.mag, color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.5 }}>
                    📈 TREND
                  </div>
                )}
                {g.remake && (
                  <div style={{ background: "#1A1633cc", color: C.gold, fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.5 }}>
                    {g.remakeMode === "remaster" ? "✨ REMASTER" : "♻ REMAKE"}
                  </div>
                )}
                {g.live && (
                  <div style={{ background: g.sunset ? "#555" : C.cyan, color: "#1A1633", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.5 }}>
                    🌐 {g.sunset ? "SUNSET" : "LIVE"}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: "#fff", textShadow: "2px 2px 0 #0005", lineHeight: 1.15, paddingRight: g.entryNo ? 60 : 0 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: "#ffffffcc", marginTop: 6 }}>{genreById(g.genre).name} · {g.year}</div>
                <div style={{ fontSize: 12, color: "#ffffffaa" }}>{platById(g.platform).name}</div>
              </div>
              <div>
                {g.live && !g.sunset && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ height: 6, borderRadius: 3, background: "#0006", overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ width: `${Math.round(g.health ?? 0)}%`, height: "100%", background: (g.health ?? 0) < 30 ? C.red : (g.health ?? 0) < 60 ? C.gold : C.green }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={e => { e.stopPropagation(); liveUpdate(g.id); }} disabled={s.money < luCost} style={{ flex: 1, padding: "6px 4px", minHeight: 36, borderRadius: 8, border: "none", cursor: "pointer", background: "#1A1633cc", color: s.money < luCost ? C.dim : "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Rubik', sans-serif", touchAction: "manipulation" }}>
                        Update {money$(luCost)}
                      </button>
                      <button onClick={e => { e.stopPropagation(); sunsetLive(g.id); }} style={{ padding: "6px 8px", minHeight: 36, borderRadius: 8, border: "none", cursor: "pointer", background: "#1A163388", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Rubik', sans-serif", touchAction: "manipulation" }}>
                        Sunset
                      </button>
                    </div>
                  </div>
                )}
                {!g.live && !g.rereleased && g.weeksLeft <= 0 && g.score >= 70 && yr - g.year >= 2 && (
                  <button onClick={e => { e.stopPropagation(); rerelease(g.id); }} disabled={s.money < rrCost} style={{
                    width: "100%", marginBottom: 8, padding: "8px 6px", minHeight: 40, borderRadius: 10, cursor: "pointer",
                    border: "none", background: "#1A1633cc", color: s.money < rrCost ? C.dim : "#fff",
                    fontFamily: "'Rubik', sans-serif", fontSize: 12, fontWeight: 800, touchAction: "manipulation",
                  }}>
                    💿 Re-release · {money$(rrCost)}
                  </button>
                )}
                {g.rereleased && <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 6, textShadow: "1px 1px 0 #0006" }}>💿 GREATEST HITS</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textShadow: "1px 1px 0 #0006" }}>{money$(g.salesTotal)}</div>
                  <ScoreSticker score={g.score} size={46} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* GAME DOSSIER */}
      {detail && (() => {
        const g = s.released.find(x => x.id === detail.id) || detail;
        const curve = Array.from({ length: g.weeksTotal || 1 }, (_, i) => ({
          w: i + 1,
          rev: Math.round(g.weeklyBase * ((g.weeksTotal - i) / (g.weeksTotal || 1))),
        }));
        const revs = g.reviews || REVIEWERS.map(r => ({ outlet: r, score: Math.max(5, Math.min(99, g.score + ri(-6, 6))), quote: pick(g.score >= 75 ? QUOTES.hi : g.score >= 50 ? QUOTES.mid : QUOTES.lo) }));
        return (
          <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30, padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: C.panelHi, border: `2px solid hsl(${g.hue} 60% 55%)`, borderRadius: 22, padding: 24, maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto", animation: "popIn .2s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <ScoreSticker score={g.score} size={64} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Bungee', cursive", fontSize: 20, color: `hsl(${g.hue} 70% 72%)` }}>{g.name}</div>
                  <div style={{ fontSize: 13, color: C.dim }}>
                    {genreById(g.genre)?.name} · {topicById(g.topic)?.name} · {platById(g.platform)?.name} · {g.year}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {g.entryNo && <Tag>Entry #{g.entryNo}</Tag>}
                {g.engineName && <Tag>🔧 {g.engineName}</Tag>}
                {g.pubName && <Tag>📮 {g.pubName}</Tag>}
                {g.port && <Tag>🔀 Port</Tag>}
                {g.exclusive && <Tag>🤝 Exclusive</Tag>}
                <Tag>{(PRICE_TIERS.find(t => t.id === g.priceTier)?.name || "Standard")} price</Tag>
                {g.goty && <Tag gold>🏆 GOTY</Tag>}
                {g.trendy && <Tag>📈 Trend launch</Tag>}
                {g.remake && <Tag>{g.remakeMode === "remaster" ? "✨ Remaster" : "♻ Remake"}</Tag>}
                {g.rereleased && <Tag>💿 Greatest Hits</Tag>}
                {g.live && <Tag>🌐 {g.sunset ? "Sunset" : `Live · ${Math.round(g.health ?? 0)}% health`}</Tag>}
              </div>
              <Row k="Lifetime revenue" v={money$(g.salesTotal)} color={C.green} />
              {!g.port && !g.live && !g.exclusive && (() => {
                const yr2 = yearOf(s.week);
                const targets = PLATFORMS.filter(pp => pp.yr <= yr2 && platEnd(s, pp) >= yr2 && pp.id !== g.platform && !(g.portedTo || []).includes(pp.id));
                if (!targets.length) return null;
                const size = SIZES.find(z => z.id === g.size) || SIZES[0];
                return (
                  <div style={{ margin: "10px 0" }}>
                    <div style={{ fontSize: 12, color: C.dim, letterSpacing: 1, marginBottom: 6 }}>🔀 PORT TO ANOTHER PLATFORM</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {targets.slice(0, 4).map(pp => {
                        const cost = Math.round(size.cost * 0.3 * (1 + (yr2 - 1984) * 0.03)) + Math.round(effLicense(s, pp, s.week) * 0.5);
                        return (
                          <Btn key={pp.id} small kind="ghost" disabled={s.money < cost} onClick={() => { portGame(g.id, pp.id); setDetail(null); }} style={{ width: "100%" }}>
                            {pp.name} · {money$(cost)} <span style={{ color: C.dim, fontWeight: 400 }}>({Math.round(platShareNow(s, pp, s.week) * 100)}% market, {platPhase(s, pp, s.week)})</span>
                          </Btn>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              {g.exclusive && <div style={{ fontSize: 12, color: C.cyan, margin: "6px 0" }}>🤝 {typeof g.exclusive === "string" ? g.exclusive : "Platform"} exclusive — can never be ported.</div>}
              {!g.live && g.weeksLeft > 0 && <Row k="Still selling" v={`${g.weeksLeft}w left`} color={C.cyan} />}
              {revs.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${C.line}` }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.outlet}</div>
                    <div style={{ color: C.dim, fontSize: 13, fontStyle: "italic" }}>“{r.quote}”</div>
                  </div>
                  <div style={{ fontFamily: "'Bungee', cursive", fontSize: 17, color: r.score >= 75 ? C.gold : r.score >= 50 ? C.cyan : C.red }}>{r.score}</div>
                </div>
              ))}
              {!g.live && curve.length > 1 && (
                <>
                  <div style={{ fontSize: 12, color: C.dim, letterSpacing: 1, margin: "12px 0 4px" }}>ESTIMATED SALES CURVE</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={curve} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                      <XAxis dataKey="w" stroke={C.dim} fontSize={10} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink, fontSize: 12 }} formatter={v => [money$(v), "Weekly"]} labelFormatter={v => `Week ${v}`} />
                      <Line type="monotone" dataKey="rev" stroke={C.green} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
              <Btn kind="ghost" onClick={() => setDetail(null)} style={{ width: "100%", marginTop: 12 }}>Close</Btn>
            </div>
          </div>
        );
      })()}
    </>
  );
}

function Tag({ children, gold }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8, background: gold ? C.gold : C.panel, color: gold ? "#1A1633" : C.ink, border: `1px solid ${C.line}` }}>
      {children}
    </span>
  );
}
