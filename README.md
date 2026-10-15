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

Open http://localhost:3000 — you are redirected to `/en` or `/fr`. The dashboard is at `/en/dashboard`.

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
    [lang]/              Every route lives under the locale segment
      layout.tsx         Root layout: <html lang>, fonts, global metadata
      (site)/            Public pages: home, about, sermons, events, contact
      (dashboard)/       Admin dashboard under /[lang]/dashboard (noindex)
      not-found.tsx      Localized 404
      error.tsx          Localized error boundary
    global-not-found.tsx 404 for URLs outside any locale
    robots.ts            robots.txt (dashboards disallowed)
    sitemap.ts           sitemap.xml with hreflang alternates
  i18n/
    config.ts            Locales, default locale, cookie name (client-safe)
    dictionaries/        en.json, fr.json
    get-dictionary.ts    getDictionary() / getLocale() for Server Components
    routing.ts           localizePath() and pageMetadata() helpers
  proxy.ts               Redirects locale-less URLs to the preferred locale
  components/            site/, dashboard/, ui/, language-switcher.tsx
  config/site.ts         Site name, URL and navigation
  lib/                   env validation and utilities
```

## Internationalization

Uses the built-in Next.js approach (no i18n library): a `[lang]` root segment, JSON
dictionaries and `src/proxy.ts`. Supported locales: **English (`en`, default)** and
**French (`fr`)**.

- A URL without a locale (`/about`) is redirected using, in order: the `NEXT_LOCALE`
  cookie set by the language switcher, the browser's `Accept-Language`, then `en`.
- In Server Components, call `await getDictionary()` and `await getLocale()`. The locale
  comes from `next/root-params`, so there is no need to pass `lang` around.
- Client Components get strings and the locale as props from a server parent.
- Build links with `localizePath(locale, "/about")`.
- Every public page sets its canonical URL and hreflang alternates with
  `pageMetadata()` in its own `generateMetadata`.

**Add a string:** add the key to `en.json`, then to `fr.json`. The French file is
type-checked against the English one, so a missing key fails `pnpm typecheck`.

**Add a locale:** add it to `locales` (and labels) in `src/i18n/config.ts`, create
`dictionaries/<locale>.json` and register it in `get-dictionary.ts`.

## Notes

- The dashboard is **not protected yet**. Add authentication (and extend `src/proxy.ts`
  to guard `/[lang]/dashboard`) before deploying.
- Read environment variables through `@/lib/env`, not `process.env`.
