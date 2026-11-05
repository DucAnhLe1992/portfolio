# Lê Đức Anh — portfolio

Personal site with case studies and engineering notes. Built with Vite, React 18, TypeScript and Tailwind CSS. Content lives in typed TypeScript modules; there is no CMS or backend.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Client build, server build, then prerenders every route into `dist/` |
| `npm test` | Vitest: path helpers, page metadata, content integrity |
| `npm run test:e2e` | Playwright against `vite preview` of `dist/` (run `npm run build` first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript for the app and for the config/e2e files, no emit |

The browser suite covers: no horizontal overflow at 320px on every page, prerendered HTML with JavaScript disabled (with and without a trailing slash), `.html` and `/index.html` aliases keeping their content after hydration, metadata and focus after client navigation, back/forward scroll restoration immediately after scrolling, table-of-contents jumps, the outcome summary, scenario-tab keyboard behaviour, copy-email feedback, and `noindex` on unknown pages. `@playwright/test` is pinned to 1.58 to match the locally installed Chromium; CI installs its own browser.

## Structure

- `src/content/` — projects and articles as typed data, plus `queries.ts`.
- `src/data/profile.ts` — name, links, experience, education, skills. `cvUrl` and `siteUrl` are `null` until set.
- `src/lib/paths.ts` — pure path helpers (`normalize`, `canonicalPath`, `matchRoute`, `savedScrollY`, `entryKey`), unit-tested.
- `src/lib/router.tsx` — small history router with focus management. Scroll positions are tracked per history entry (a key in `history.state`), so a pending save never lands on the entry that back/forward just activated.
- `src/lib/seo.ts` — per-route title and description, shared by the client and the prerenderer.
- `src/entry-server.tsx` + `scripts/prerender.mjs` — render each route to static HTML as both `route.html` and `route/index.html`, write `404.html`, `robots.txt`, alias redirects and, when `siteUrl` is set, `sitemap.xml`, canonical links and the `public/og-image.jpg` social card.
- `e2e/` — Playwright tests.

## Content rules

- Claims about a repository link to source at a pinned commit (`sources` on a section). A test enforces 40-character SHAs.
- Every project has an `outcome` (what works, how it was checked, what is limited, main lesson), shown before the implementation detail. No invented usage or business numbers.
- Screenshots are optional: put images in `public/screenshots/` and list them in the project's `screenshots` with `src` (`/screenshots/name.webp`), descriptive `alt`, `caption` and the real `width`/`height`. A "Screens" section and TOC entry appear automatically; tests check the fields.
- Course-derived work is labelled as such; known limitations sit next to the design.

## Deployment

1. Set `profile.siteUrl` to the production origin (bare `https://` origin, no path). The build rejects anything else.
2. Build with `REQUIRE_SITE_URL=1 npm run build` for production; it fails if `siteUrl` is still `null`. Local builds do not need it.

The build prepends `301!` rules to `dist/_redirects` sending `/route.html` and `/route/index.html` to `/route`, followed by the catch-all that serves `404.html` with a 404 status. The `!` (force) suffix is Netlify syntax, needed because the files exist on disk. Cloudflare Pages redirects `.html` to clean URLs by itself and does not accept `!`; elsewhere, configure the equivalent. As a fallback the app rewrites the address bar to the clean URL on load and renders the right page.

After deploying, check with JavaScript disabled that known routes return their own HTML, unknown routes return HTTP 404, aliases redirect, and canonical, sitemap and social-image URLs use the real domain.

## Decision record

`docs/portfolio-build-plan.md` proposes Next.js App Router with MDX. The site instead uses Vite, typed TypeScript content modules and a small prerender script. The goals behind the plan (static HTML per route, per-route metadata, crawlable content, no client-only pages) are met without a framework migration, and typed content lets tests check every source link and route. Revisit if the site needs server rendering on request, image optimisation, or many more articles.
