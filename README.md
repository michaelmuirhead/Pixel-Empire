# Pixel Empire — Game Studio Tycoon

Build a game studio from a 1984 garage to a publishing empire. Runs 1984 → 2045
on the real console timeline: engines, IP, rivals, M&A, publishers, platform
wars, live-service, remakes, and the Pixel Awards.

Vite + React, saves to localStorage on-device. Designed touch-first for iPad.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (GitHub → Vercel)

1. Create a new GitHub repo (e.g. `pixel-empire`) and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Pixel Empire v1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pixel-empire.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repo.
   Vercel auto-detects Vite — no settings needed. Deploy.
3. On iPad: open the Vercel URL in Safari → Share → **Add to Home Screen**.
   It launches fullscreen with its own icon like a native app.

## Notes

- **Saves** live in localStorage under `pixel-empire-save-v1`, autosaving every
  turn. Clearing Safari website data erases the save.
- The save system migrates old versions forward automatically.
- All game code lives in `src/PixelEmpire.jsx` (one big file by design — split
  into modules whenever it gets unwieldy).
