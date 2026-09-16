# our-home — Home of PAPEREE × SULIN

> A love letter in Next.js, 2,295 km from Guangzhou to Lhasa.

`Superee = su per ee` — one page for two people: 纸片君 (Guangzhou) and 苏淋 (Lhasa).

## Stack

| What | With |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4, neo-brutalist pills & hard shadows |
| Motion | Framer Motion (reveals, marquees, secret-letter transition) |
| Scroll | Lenis smooth scroll + custom overlay scrollbar |
| Data | Open-Meteo (dual-city weather, no key), iTunes 30s previews |

## Getting started

```bash
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```

## What's inside

- **Duo cards** — ee × su, stats counted from 21,154 real chat messages
- **Numbers** — distance, messages, good-nights, characters written
- **Story** — four lines, 07-28 → soon
- **Playlist** — 14 picked tracks, 30s previews, full versions on Kugou
- **Two skies** — live Guangzhou vs Lhasa weather
- **Moments** — bento grid of us
- **Secrets** — Konami code or 5 clicks on the top badge opens a letter
  (pushes a door counter in `localStorage`, Esc to close)

## Notes

- Stats are a snapshot of the chat export — they don't update themselves.
- Avatars in `public/avatars` are optimized `.webp`; originals stay out of git.
