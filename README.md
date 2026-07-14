# Unipaas Docs

A documentation website with a personified experience: a Fumadocs-powered docs
site whose landing page greets you with a search box and, once you've browsed
around, a persistent **Recent Activity** list of the pages you visited.

## Tech stack

- **Next.js (App Router)** + **Fumadocs** — docs UI, MDX content, and server-side search
- **Tailwind CSS** + **shadcn/ui** (Base UI) — styling and components
- **Express** — a custom server that serves the Next.js app and a small backend API
- **node:sqlite** — built-in SQLite for persisting visitor activity (no native deps)
- **Pino** — structured logging
- **Zod** — request/env validation
- **TypeScript** run natively on **Node 22** (no build step for the server)
- **npm workspaces** monorepo

## Architecture

The whole site runs as a **single process**: one Express server (`apps/web/server`)
renders the Next.js app and exposes the backend under `/api/v1`.

```
apps/web/
├── server/            # Express + Next custom server (Node-only)
│   ├── index.mts      # entrypoint: wiring, request logging, error handling
│   ├── api.mts        # /api/v1 routes
│   ├── activity.mts   # recent-activity data access
│   ├── db.mts         # node:sqlite connection + migrations
│   ├── env.mts        # zod-validated environment
│   └── logger.mts     # pino logger
├── app/               # Next.js App Router (pages, /api/search, layouts)
├── components/        # UI (docs landing, MDX, shadcn/ui)
├── content/docs/      # all markdown, one folder per section
└── proxy.ts           # Next middleware (issues the visitor cookie)
```

- **Content** lives entirely in `apps/web/content/docs/`. Add a section by creating
  a folder with a `meta.json`; add a guide by dropping in an `.mdx` file.
- **Search** is server-side via Fumadocs' `/api/search` route (Orama index).
- **Recent Activity**: a visitor cookie is set by the middleware; each doc page
  reports the visit to `/api/v1/activity`, which stores it in SQLite. The landing
  reads it back from `/api/v1/activity/recent`.

## Run it locally

Requirements: **Node >= 22.18** (for native TypeScript + `node:sqlite`).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Useful scripts

```bash
npm run build          # production build
npm run start          # run the production server
npm run types:check -w web   # type-check
```

## Configuration

| Variable   | Default        | Description                                  |
| ---------- | -------------- | -------------------------------------------- |
| `PORT`     | `3000`         | Port the server listens on                   |
| `NODE_ENV` | `production`   | `development` enables Next dev + pretty logs |
| `DB_PATH`  | `data.db`      | SQLite file path for activity persistence    |

## Deployment

Deploys as a single service (e.g. Railway) from the repo root: `npm run build`
then `npm run start`. For activity to persist in production, point `DB_PATH` at a
mounted volume, since container filesystems are ephemeral.
