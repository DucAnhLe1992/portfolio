# Lê Đức Anh — portfolio

Personal site with case studies and engineering notes. Built with Vite, React 18, TypeScript and Tailwind CSS. Content lives in typed TypeScript modules; there is no CMS or backend.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Client build, server build, then prerenders every route into `dist/` |
| `npm test` | Vitest: router matching, page metadata, content integrity |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Structure

- `src/content/` — projects and articles as typed data, plus `queries.ts`.
- `src/data/profile.ts` — name, links, experience, skills. `email`, `cvUrl` and `siteUrl` are `null` until set.
- `src/lib/router.tsx` — small history router with focus management and scroll restoration.
- `src/lib/seo.ts` — per-route title and description, shared by the client and the prerenderer.
- `src/entry-server.tsx` + `scripts/prerender.mjs` — render each route to static HTML, write `404.html`, `robots.txt` and, when `siteUrl` is set, `sitemap.xml` and canonical links.

## Content rules

- Claims about a repository link to source at a pinned commit (`sources` on a section). A test enforces 40-character SHAs.
- Course-derived work is labelled as such; known limitations sit next to the design.

## Deployment

Any static host. `public/_redirects` serves `404.html` with a 404 status for unknown paths.
