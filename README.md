# Serge Alain Kamedjieu — Portfolio

Portfolio website and content dashboard for Pastor Serge Alain Kamedjieu.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components, Turbopack, typed routes)
- React 19, TypeScript (strict)
- Tailwind CSS v4
- ESLint (`eslint-config-next`) + Prettier (with Tailwind class sorting)
- Zod for environment validation
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000 for the public site and http://localhost:3000/dashboard for the dashboard.

## Scripts

| Script           | What it does                       |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Start the dev server               |
| `pnpm build`     | Production build                   |
| `pnpm start`     | Serve the production build         |
| `pnpm lint`      | Run ESLint                         |
| `pnpm typecheck` | Generate route types and run `tsc` |
| `pnpm format`    | Format with Prettier               |
| `pnpm check`     | Lint + typecheck + format check    |

## Project structure

```
src/
  app/
    (site)/            Public pages: home, about, sermons, events, contact
    (dashboard)/       Admin dashboard under /dashboard (noindex)
    layout.tsx         Root layout, fonts, global metadata
    robots.ts          robots.txt (dashboard disallowed)
    sitemap.ts         sitemap.xml from the site navigation
  components/
    site/              Public site components
    dashboard/         Dashboard components
    ui/                Shared primitives
  config/site.ts       Site name, description, navigation
  lib/                 env validation and utilities
```

## Notes

- The dashboard is **not protected yet**. Add authentication (and a `src/proxy.ts`
  redirect for `/dashboard`) before deploying.
- Read environment variables through `@/lib/env`, not `process.env`.
