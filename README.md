# Internet Backyard · Cursor prototype

Design/development track for [Internet Backyard](https://github.com/andrewhuhh/internet-backyard) — a Next.js prototype for the composable **send transfer** primitive described in `goal.md`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run lint
npm run build
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Prototype index |
| `/brief` | Product framing and demo matrix |
| `/explorations` | Visual direction (palette, evidence rows) |
| `/primitive` | Transfer dialog + scenario controls |

## Stack

- Next.js 16 App Router, TypeScript
- Tailwind CSS 4, shadcn/ui
- Zod (runtime + compile-time validation)
- Zustand (flow + persisted local counterparties/rails)
- Motion (step transitions)

## Deploy

Connected to Vercel via GitHub. Production deploys on push to `main`.

See `goal.md` for full product requirements and bakeoff criteria.
