# Lê Đức Anh — Portfolio Build Plan

A practical companion to the portfolio strategy report. This document is a proposed implementation plan, not a generated or tested application.

## Recommended direction

Build an English-first, project-led personal website with a calm editorial aesthetic and a distinctive engineering-notebook theme. Present a clear React/TypeScript foundation, substantiate full-stack capability through project evidence, and describe AI as a direction of study until concrete implementations support a stronger claim.

**Working concept:** “Thoughtful interfaces. Reliable systems.”

**Default audience:** engineering hiring managers and technical interviewers for frontend/full-stack positions.

**Default schedule:** six weeks, approximately 5–8 hours per week. This is a planning assumption, not a delivery guarantee. Extend it if case-study preparation or visual design needs more time.

## Learn from the reference

Harry Tang documents a platform using Next.js, Strapi, Remark42, search, and GitOps. That infrastructure supports his specific engineering identity; it is not necessary to obtain an equally polished visual result.

- Architecture: https://harrytang.xyz/blog/how-i-built-microservices-portfolio
- Credits: https://harrytang.xyz/credits
- Projects: https://harrytang.xyz/projects

Adopt clarity, typographic hierarchy, spacing discipline, authentic personal material, and consistent components. Do not copy his photographs, biography, project claims, or template-derived source without appropriate permission.

The credits identify Spotlight. If choosing that starting point, review current availability and licensing directly: https://tailwindcss.com/plus/templates/spotlight. Public source visibility does not establish reuse rights.

## Scope

### Launch

- Home with a focused introduction and two featured projects.
- Projects index and two complete case studies.
- Writing index and two substantial engineering notes.
- About with accurate experience, education, and selected interests.
- Contact links, GitHub, LinkedIn, and downloadable CV.
- Privacy disclosure matching the services actually used.
- Metadata, sitemap, robots configuration, and a useful not-found page.

### Defer

- CMS, database, authentication, microservices, Kubernetes, and Redis for the portfolio itself.
- Comments, newsletter, hosted search, and visitor accounts.
- AI résumé chatbot or assistant.
- Arbitrary-code playground embedded in the main site.
- Empty Lab, Speaking, or Testimonials sections.

## Stack

| Concern | Proposed choice | Reason |
|---|---|---|
| Framework | Next.js App Router + TypeScript | React-first development and a path to prerendered content routes. |
| Styling | Tailwind CSS + CSS custom properties | One coherent visual token system. |
| Content | Local MDX with `@next/mdx` | Authored project stories and articles remain versioned with the code. |
| Validation | Zod | Validate metadata during CI/build. |
| Media | `next/image`, `next/font` | Intentional image and font handling. |
| Components | Native HTML first | Add accessible headless primitives only where useful. |
| Unit tests | Vitest | Focus on pure content/query helpers. |
| Page tests | Playwright + axe | Navigation, responsive flows, metadata, and detectable accessibility issues. |
| Formatting/linting | Biome | A single consistent toolchain. |
| Delivery | GitHub + Vercel + custom domain | Preview review before production. |
| Analytics | None initially | Add only with a clear purpose and accurate disclosure. |

Astro with React islands is a credible alternative if publishing becomes the dominant goal. This recommendation favors continuity with React, not a claim of universal superiority.

Relevant documentation:

- https://nextjs.org/docs/app/guides/mdx
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://docs.astro.build/en/concepts/islands/
- https://docs.astro.build/en/guides/content-collections/
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/plans/hobby

Vercel Hobby is restricted to personal, non-commercial use. Check applicable terms before using it for a commercial or freelance-oriented site.

## Architecture

```text
Trusted local MDX + typed data + original media
                         |
                         v
GitHub PR: lint / typecheck / validate / test / build
                         |
                         v
Preview deployment -> review -> merge
                         |
                         v
Production portfolio
  Prerendered content routes
  Small client-side enhancements
                         |
                         v
Independent project demos + recording fallbacks
```

### Boundaries

- Content code owns records, validation, ordering, draft filtering, and slug lookup.
- Presentation code owns layouts, cards, typography, navigation, and diagrams.
- Client components own only genuinely interactive behavior.
- Demo applications remain separately deployable; their failure must not break the portfolio.

Use Server Components for content loading and rendering. Introduce `"use client"` only where state or browser APIs are needed. Avoid a global store for a few toggles.

**Important distinction:** prerendering on managed Next.js hosting is not identical to `output: 'export'`. Do not enable static export casually: it excludes server-dependent features and the default image-optimization loader. A pure-static-host migration should explicitly address images, headers, redirects, and any contact endpoint.

Documentation: https://nextjs.org/docs/app/guides/static-exports

## Routes

| Route | Role |
|---|---|
| `/` | Identity, selected work, writing, brief experience, contact |
| `/projects` | Curated project index |
| `/projects/car-rental` | Flagship full-stack case study |
| `/projects/code-notebook` | Frontend/developer-tooling case study |
| `/projects/ticket-booking` | Optional third case study after the first two are ready |
| `/writing` | Article index |
| `/writing/[slug]` | Shared article template |
| `/about` | Professional and personal context |
| `/privacy` | Actual data-handling disclosure |
| `/cv.pdf` | Downloadable career document |

## Folder skeleton

```text
portfolio/
├── content/
│   ├── projects/
│   │   ├── car-rental.mdx
│   │   ├── code-notebook.mdx
│   │   └── ticket-booking.mdx
│   └── writing/
│       ├── payment-confirmation.mdx
│       └── reservation-concurrency.mdx
├── public/
│   ├── images/
│   │   ├── profile/
│   │   └── projects/
│   └── cv.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── writing/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── site/
│   │   ├── projects/
│   │   ├── writing/
│   │   └── ui/
│   ├── data/
│   │   ├── profile.ts
│   │   └── experience.ts
│   ├── lib/
│   │   ├── content/
│   │   │   ├── registry.ts
│   │   │   ├── schemas.ts
│   │   │   └── queries.ts
│   │   └── seo.ts
│   └── mdx-components.tsx
├── tests/
│   ├── unit/
│   └── e2e/
├── scripts/validate-content.ts
├── .github/workflows/quality.yml
├── next.config.mjs
├── playwright.config.ts
├── vitest.config.ts
├── biome.json
└── package.json
```

Use a small explicit registry of imported local MDX modules. Validate metadata and use the same published-entry queries for index pages, detail routes, and the sitemap. With App Router, `@next/mdx` requires `mdx-components.tsx`.

For the first release, prefer named metadata exports inside MDX. YAML frontmatter is not supported by `@next/mdx` by default. Never compile visitor-submitted MDX.

## Content model

```ts
type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  kind: 'personal' | 'course-derived' | 'professional';
  role: string;
  stack: string[];
  featured: boolean;
  status: 'maintained' | 'experimental' | 'archived';
  evidence: {
    repository?: string;
    demo?: string;
    recording?: string;
  };
};
```

Keep long-form explanations in MDX. Give articles a separate model: title, slug, summary, publication date, optional updated date, tags, and draft state.

## Case-study preparation

### Car Rental

Repository: https://github.com/DucAnhLe1992/CarRental

Architecture: https://github.com/DucAnhLe1992/CarRental/blob/main/ARCHITECTURE.md

Prepare a story around booking concurrency, payment confirmation authority, and duplicate-request handling. Include screenshots, a booking state diagram, reproducible tests, implementation links, and known limitations. Do not describe documented behavior as independently verified production correctness.

### Code Notebook

Repository: https://github.com/DucAnhLe1992/online-code-editor

Explain the editing-to-bundling-to-preview pipeline, local persistence, packaging, and failure handling. Include a short recording and one simplified architecture diagram.

### Ticket Booking

Repository: https://github.com/DucAnhLe1992/ticket-booking-app

Explain event-driven coordination through one concrete event trace. Clearly document course-derived foundations, original extensions, current deployment status, and limitations. Avoid unsupported scalability or production-readiness claims.

### Shared structure

1. Product overview.
2. Personal role and contribution.
3. Context, provenance, and constraints.
4. One difficult engineering problem.
5. Architecture diagram.
6. Two or three decisions and alternatives.
7. Verification and reproducible evidence.
8. Limitations and next improvements.
9. Source, demo/recording, and related writing.

## Design rules

- Start with an off-white canvas, charcoal text, and a deep teal or blue accent.
- Use one strong sans-serif; reserve monospace for small technical labels.
- Keep reading width near 68 characters and wider layouts around 72rem as starting values.
- Create one spacing scale and one card family.
- Use consistent project screenshot proportions.
- Add original personal photography only if comfortable.
- Keep navigation conventional and visible.
- Use restrained motion; support reduced-motion preferences.
- Do not hide essential information behind hover or animation.
- Review contrast rather than assuming proposed colors pass.

These are design proposals, not measurements or accessibility certification.

## Signature enhancement

After the core site is complete, add an interactive booking-flow explainer. Offer scenarios such as successful payment, expired checkout, repeated callback, and competing reservations. Show a state diagram and event log.

Label it as illustrative unless it really executes against an isolated backend. A visualization does not prove concurrency guarantees.

Do not embed arbitrary execution in the main origin. If adding a code playground later, use a separate origin and restricted iframe permissions. MDN warns against combining `allow-scripts` and `allow-same-origin` for same-origin embedded content:

https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

## Six-week milestones

| Week | Deliverable | Exit condition |
|---|---|---|
| 1 | Positioning, evidence inventory, two case-study outlines | Strongest proof is selected before coding. |
| 2 | Desktop/mobile layouts and tokens | Home, project, and article share a coherent system. |
| 3 | Routing, MDX registry, metadata, previews | One real case study works end to end. |
| 4 | Two case studies, two articles, About, contact, CV | Site is useful without signature features. |
| 5 | Optional booking explainer and visual polish | Enhancement clarifies the engineering story. |
| 6 | Accessibility, responsive/browser testing, CI, domain, launch | All release gates pass; unfinished features are deferred. |

## Release checklist

### Content and trust

- [ ] Two completed case studies; no placeholder claims.
- [ ] Personal contribution and educational provenance are explicit.
- [ ] Two articles explain actual implementation decisions.
- [ ] CV, LinkedIn, GitHub, and site tell a consistent story.
- [ ] No invented usage, speedup, uptime, or commercial outcome.
- [ ] Demo links work or clearly offer a recording fallback.
- [ ] Repositories have clear setup instructions and limitations.
- [ ] Secret scan completed; any genuinely exposed credentials rotated.

### Experience

- [ ] Narrow phone, tablet, and wide desktop layouts reviewed.
- [ ] Keyboard navigation and visible focus verified manually.
- [ ] Mobile menu restores focus appropriately.
- [ ] Main content remains readable without JavaScript.
- [ ] Reduced-motion preferences respected.
- [ ] No unintended horizontal overflow or image-driven layout shifts.

### Engineering

- [ ] Lint, typecheck, metadata validation, tests, and production build pass.
- [ ] Home-to-project-to-source journey passes.
- [ ] Writing index-to-article journey passes.
- [ ] Invalid slugs return a useful not-found page.
- [ ] Drafts are excluded from every public surface.
- [ ] Titles, canonical URLs, social previews, sitemap, and robots are correct.
- [ ] Privacy disclosure matches actual hosting and third-party services.

### Measurement

Target good field Core Web Vitals: LCP at most 2.5 seconds, INP at most 200 milliseconds, CLS at most 0.1, evaluated at the 75th percentile. These are targets, not observed results. Low traffic may prevent useful public field reporting; distinguish lab checks from real-user data.

- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://support.google.com/webmasters/answer/9205520

Aim for WCAG 2.2 AA and combine automated accessibility tests with manual checks. Passing axe does not establish complete conformance.

- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://playwright.dev/docs/accessibility-testing

## First work session

Write the Car Rental case-study outline and gather its best screenshots, architecture diagram, test instructions, and code links. Use that real content to design the first project page. Do not begin by installing an animation library or provisioning infrastructure.
