# Lê Đức Anh — Portfolio Strategy and Technical Blueprint
**Planning assumptions:** an English-first portfolio aimed primarily at frontend/full-stack engineering opportunities, a restrained editorial design, and an initial six-week release at roughly 5–8 hours per week. These are proposed defaults, not confirmed constraints or a delivery guarantee.
## Reference-site assessment
Harry Tang’s site combines a professional identity, technical articles, project links, career history, and personal interests; its projects page explicitly describes the website itself as a Next.js, Strapi, and Remark42 project. Its architecture article describes a publishing platform with search and GitOps deployment, rather than merely a static résumé.[^1][^2][^3][^4]

The important distinction is **visible quality versus infrastructure complexity**. The recommended approach is to reproduce the care given to design, content, and reliability—not automatically reproduce the reference site’s deployment topology.

| Layer | Reference-site observation | Proposed adaptation |
|---|---|---|
| Positioning | A specific Solutions Architect/DevOps identity, supported by professional experience and articles.[^4][^5] | Lead with React/TypeScript expertise and demonstrate full-stack capability through concrete projects. |
| Presentation | Visual inspection of the [live homepage](https://harrytang.xyz/) shows an off-white canvas, amber accents, strong typography, rounded cards, a photo arrangement, and generous spacing. | Use the same principles of restraint and consistency, but choose original colors, composition, imagery, and copy. |
| Publishing | Technical articles are a prominent part of the site.[^2] | Start with two excellent engineering notes rather than an empty blog or a large collection of shallow posts. |
| Technology | The site identifies Next.js, Strapi, and Remark42; its architecture article also describes Algolia and GitOps.[^1][^3] | Start with one application, repository-managed content, and managed deployment. |
| Design foundation | Its credits identify Spotlight, alongside tools including Tailwind CSS and TypeScript.[^6] | Use a properly licensed starting point or build an original design system; do not treat public source visibility as permission to copy. |

**Evidence boundary:** the visual observations come from the live homepage and its public markup. The architecture is documented by the author; this is not an independent audit of production infrastructure, accessibility conformance, or performance.
## Personal positioning
The existing portfolio material already supports a coherent story: a TypeScript/React frontend foundation, an in-browser development tool, an event-driven ticketing application, and a car-rental application with transactional booking and payment concerns. The proposed positioning is therefore **“a frontend-focused software engineer who understands the systems behind the interface,”** rather than an unsupported senior architect or AI-engineer identity.[^7]

A proposed identity line is **“Lê Đức Anh — Software Engineer”**, with a supporting line such as **“Thoughtful interfaces. Reliable systems.”** Treat these as copy directions to refine, not claims of measured impact.

| Message layer | Proposed content |
|---|---|
| Main headline | “Building thoughtful interfaces and reliable web applications.” |
| Supporting description | Emphasize React and TypeScript, full-stack projects, and the problems solved—not a long list of frameworks. |
| Career direction | Describe AI as an area of study and exploration until there is substantive public implementation evidence. |
| Primary action | “Explore selected work” |
| Secondary action | “Get in touch”; provide a separate CV link. |
| Human detail | Add a short, authentic note about life in Finland, independent study, or music interests where personally appropriate. |

Avoid positioning frontend, backend, AI, DevOps, data science, and theoretical computer science as six equally established specialisms. A focused headline can coexist with a broader About page and a clearly labeled experimental area.
## A distinctive concept
**Proposed concept: “The Engineer’s Notebook.”** Build a calm editorial website in which polished interfaces and engineering reasoning sit side by side. The signature is not a spinning object or terminal animation; it is the ability to move from an attractive project preview to a clear explanation of a difficult decision.

Use three recurring content labels: **Build** for projects, **Explain** for technical writing, and **Explore** for experiments. Keep the actual navigation conventional—Home, Projects, Writing, About—so the concept does not make the site harder to use.

| Element | Proposed treatment | Boundary |
|---|---|---|
| Canvas | Warm ivory or pale neutral with charcoal text | Do not copy the reference palette exactly. |
| Accent | Deep teal or ink blue | Check contrast in every state. |
| Typography | One strong sans-serif; monospace for small engineering labels | Avoid decorative fonts competing with code and diagrams. |
| Project imagery | Consistent screenshots, deliberate cropping, short descriptive captions | No generic stock imagery standing in for project evidence. |
| Personal imagery | Two or three original photos, if comfortable | No need to imitate Harry’s photo arrangement. |
| Motion | Short hover/focus transitions and an optional single entrance effect | No scroll hijacking, essential information hidden behind animation, or mandatory motion. |
| Signature detail | A small “Engineering decisions” section on every case study | Reuse the pattern consistently rather than inventing a new interaction for each page. |
### Proposed design tokens
These are starting values for iteration, not measured characteristics of the reference site:

```css
:root {
  --canvas: #f7f6f2;
  --surface: #ffffff;
  --ink: #202723;
  --muted: #59655e;
  --accent: #176b5b;
  --line: #d9ded8;
  --radius-card: 1.25rem;
  --content-wide: 72rem;
  --content-reading: 68ch;
}
```

Use a small spacing scale, a deliberate heading hierarchy, and consistent card internals. Design a homepage, a project case study, and an article at both narrow and wide widths before multiplying components.
## Information architecture
Prioritize selected work on the homepage, then writing and experience. This deliberately differs from an article-led homepage because the default objective here is recruitment through demonstrable engineering work.

| Route | Purpose | Initial scope |
|---|---|---|
| `/` | Communicate identity and guide visitors toward evidence | Hero, two featured projects, two writing links, short experience summary, contact |
| `/projects` | Present a curated body of work | Three projects, each with a clear reason to open it |
| `/projects/car-rental` | Show application correctness and product thinking | Flagship case study |
| `/projects/code-notebook` | Show frontend and developer-tooling depth | Second case study |
| `/projects/ticket-booking` | Show distributed-system learning | Third case study, with honest provenance and limitations |
| `/writing` | Demonstrate clear technical communication | Two useful articles at launch |
| `/writing/[slug]` | Explain one real problem or decision | Shared article layout |
| `/about` | Add professional and personal context | Experience, education, working style, selected interests |
| `/privacy` | Explain actual data handling | Match the services and tracking genuinely used |
| `/cv.pdf` | Offer a portable career document | Keep consistent with the website |

Do not launch empty Lab, Speaking, Testimonials, or Newsletter sections. Add them when there is material worth presenting.
### Homepage skeleton
```text
Header: name/avatar · Projects · Writing · About · theme control

Hero
  Clear professional headline
  Two short supporting sentences
  Explore selected work / Get in touch
  Original project visual or small personal composition

Selected work
  Car Rental: product image + hard problem + case-study link
  Code Notebook: product image + tooling story + case-study link

Engineering notes
  Two article titles with useful one-line descriptions

Experience and direction
  Concise timeline, skills expressed through evidence

Contact
  Email, GitHub, LinkedIn, CV

Footer
  Copyright, privacy, site/source information where appropriate
```

On mobile, preserve the same story in a single column. The main identity and project links should not depend on hovering, opening a command palette, or running JavaScript.
## Project evidence strategy
The car-rental project already contains material for a stronger case study than a conventional feature list: booking concurrency, payment confirmation through webhooks, and idempotency. Its [architecture document](https://github.com/DucAnhLe1992/CarRental/blob/main/ARCHITECTURE.md) should be treated as input to a clearer public explanation—not as a substitute for screenshots, verification, and candid limitations.[^7]

| Project | Proposed portfolio role | Story to emphasize | Evidence to prepare |
|---|---|---|---|
| Car Rental | Flagship full-stack case study | What happens when customers compete for inventory or a payment callback is repeated? | Booking flow screenshots, state diagram, concurrency/idempotency test instructions, relevant code links |
| Code Notebook | Frontend/tooling case study | How editing, bundling, previewing, and persistence fit together | Short recording, simplified architecture, error handling examples, packaging explanation |
| Ticket Booking | Supporting systems case study | Event-driven coordination, failure handling, and learning through distributed services | Service diagram, one event trace, test evidence, deployment status and limitations |

The existing project descriptions support these themes, but this plan does not certify the implementations as production-ready or establish production-scale performance.[^7]
### Reusable case-study structure
1. **Overview:** what the application does and who it serves.
2. **Contribution:** what was personally implemented, adapted, designed, or extended.
3. **Context:** personal, educational, professional, or collaborative work; dates and relevant constraints.
4. **Hard problem:** one concrete challenge, not every feature.
5. **Architecture:** one diagram with responsibilities and trust boundaries.
6. **Decisions:** two or three trade-offs and rejected alternatives.
7. **Verification:** tests, reproducible commands, recordings, and actual measurements where available.
8. **Limitations:** known gaps, operational assumptions, and what would change for production.
9. **Links:** source, working demonstration or recording, and related writing.

For course-derived work, explain the starting point and distinguish original extensions from the baseline. Never invent adoption, speed improvements, uptime, commercial outcomes, or independent authorship.
### Writing candidates
- **“Why a checkout redirect should not confirm a booking.”** Explain authority and trust boundaries through the car-rental flow.
- **“Preventing overlapping reservations: what the database must guarantee.”** Explain the implementation and its limits using reproducible tests.
- **“From editor to preview: the pipeline inside a browser-based code notebook.”** Explain bundling, persistence, and error handling.

Publish two initially; keep the third as a follow-up. Prefer a specific problem with a diagram and an honest conclusion over generic framework tutorials.
## Stack selection
**Recommended default: Next.js App Router, TypeScript, Tailwind CSS, local MDX, and Vercel deployment.** This is a judgment based on the existing React/TypeScript foundation, not a claim that Next.js is uniquely capable of producing a polished portfolio.

Astro is an equally credible alternative for a publishing-first site: its documented architecture renders most content as HTML and adds client JavaScript to explicitly interactive islands, including React islands. Next.js supports local MDX and can prerender content routes, so choosing it does not require turning the portfolio into a client-rendered SPA.[^8][^9][^10][^11]

| Decision | Next.js | Astro | Proposed choice |
|---|---|---|---|
| React-first development | App Router supports Server Components and MDX.[^8][^12] | React can be used within an islands architecture.[^9] | Next.js for continuity with existing strengths. |
| Content modeling | Add a small typed content layer around local MDX.[^8] | Built-in content collections support schemas and querying.[^13] | Next.js is reasonable for this small initial content set; Astro is attractive if publishing dominates. |
| Interactivity | Restrict client components to interactive features.[^12] | Hydrate islands explicitly with `client:*` directives.[^9] | Either is sufficient; do not add interactivity without purpose. |
| Deployment | Managed Next.js hosting or a static export.[^14] | Build-time collections can generate static pages.[^13] | Managed Next.js hosting initially. |
### Proposed supporting tools
| Concern | Selection | Scope rule |
|---|---|---|
| Styling | Tailwind CSS plus CSS custom properties | One token system; no second competing styling framework. |
| Content | `@next/mdx` and typed metadata | Repository-managed projects and articles. |
| Validation | Zod | Validate metadata during CI/build rather than trusting type assertions alone. |
| Images and fonts | `next/image` and `next/font` | Optimize actual project imagery; avoid unnecessary font variants. |
| Icons | One SVG icon family | Keep sizing and stroke weight consistent. |
| UI primitives | Native HTML first; Headless UI or Radix only when useful | No need to install a whole component library for cards and headings. |
| Testing | Vitest for pure helpers; Playwright and axe for page flows | Test content, navigation, and accessibility—not only snapshots. |
| Formatting | Biome | One consistent formatting/linting setup. |
| Package manager | pnpm | Commit the lockfile and pin the runtime/package-manager versions used by CI. |
| Deployment | Vercel with a custom domain | Review applicable plan terms before commercial use. |
| Analytics | None at launch; evaluate later | Do not collect data without a clear purpose and accurate disclosure. |

Vercel documents preview deployments for non-production branches and pull requests. Its Hobby plan is restricted to personal, non-commercial use; do not assume that every freelance or business-oriented use qualifies.[^15][^16]
### Template or original build
Spotlight is an official Tailwind personal-site template built with Next.js and MDX. Review its [official product page](https://tailwindcss.com/plus/templates/spotlight), current checkout availability, and license terms before choosing it; this plan does not depend on a particular template price.[^17]

**Recommended decision rule:** use Spotlight if properly licensed and the priority is reaching a polished baseline quickly; build an original small design system if the design work itself is part of the portfolio story. In both cases, differentiate through project storytelling, original visuals, and composition—not merely replacing the template’s name and colors. Public access to Harry’s code is not a substitute for checking the rights to template-derived material.
## Application architecture
Use a **single application with build-time content and small client-side enhancements**. Keep complex applications such as Car Rental deployed independently: the portfolio should remain usable if a demo service is offline.

```text
Authoring
  Local MDX + typed project/profile data + original media
                         |
                         v
GitHub pull request
  Lint + typecheck + metadata validation + tests + build
                         |
                         v
Preview deployment -> review -> merge
                         |
                         v
Production site / custom domain
  Prerendered project and article routes
  Small client features: navigation, theme, optional filters
                         |
                         v
Links to independently deployed demos
  Recording/screenshot fallback when a demo is unavailable
```

Next.js can generate known dynamic routes at build time with `generateStaticParams`; Server Components are the App Router default and do not themselves add client-side component code to the browser bundle. Keep content loading and metadata generation server-side; add `"use client"` only at the boundaries that genuinely need browser state or APIs.[^12][^11]
### Clear responsibility boundaries
- **Content layer:** project records, article records, metadata validation, draft filtering, ordering, and slug lookup.
- **Presentation layer:** layouts, cards, typography, diagrams, and navigation.
- **Interactive layer:** narrowly scoped client components; no global application store unless a real need emerges.
- **Delivery layer:** CI, preview review, deployment, redirects, and monitoring appropriate to the actual host.

Do not add a database, authentication, GraphQL API, Kubernetes cluster, Redis, or microservice solely to display authored content. If a separate systems experiment is valuable, present it as a project with its own constraints rather than making it a prerequisite for reading the portfolio.
### Deployment distinction
A prerendered Next.js site on managed hosting is **not the same thing as** `output: 'export'`. Static export produces files for static hosting, but does not support features such as Server Actions, ISR, request-dependent handlers, or the default image-optimization loader.[^18]

The default plan should **not** enable static export just to claim the site is static. If portability to a pure static host later becomes a requirement, make that a deliberate decision and configure image handling, headers, and any contact endpoint accordingly.
## Repository skeleton
This proposed layout uses a small, explicit content registry. It is a structural blueprint, not a generated or tested application.

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

`@next/mdx` requires an `mdx-components.tsx` file when used with the App Router; it also supports importing MDX content into route components. The registry should import trusted local MDX modules explicitly, validate their metadata, and expose shared query functions used by indexes, detail pages, and the sitemap.[^8]
### Content contract
A proposed minimal project model:

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

Use a separate article model with title, slug, summary, publication date, optional updated date, tags, and draft state. Keep long explanations in MDX instead of growing the metadata into an entire CMS.

For the first release, use named metadata exports in MDX rather than silently assuming YAML frontmatter works: `@next/mdx` does not support frontmatter by default. The route looks up an allowed slug in the registry, renders its imported content component, generates metadata, and returns not-found for unknown slugs; `generateStaticParams` enumerates the published entries.[^8][^11]

Never compile visitor-submitted MDX. Treat MDX as trusted executable authoring material rather than ordinary untrusted text.[^8]
## One signature feature
**Recommended first enhancement: an interactive explanation of the car-rental booking lifecycle.** Let a visitor choose a scenario—successful payment, expired checkout, repeated callback, or competing reservation—and step through a compact state diagram and event log. This builds on existing booking/payment material rather than requiring an unrelated new project.[^7]

Label the feature clearly as an **illustrative visualization** unless it actually runs against an isolated backend. It must not imply that a diagram animation proves database correctness or shows a real transaction.

| Candidate | Portfolio value | Complexity | Recommendation |
|---|---|---|---|
| Booking-flow explainer | Connects interface quality with domain correctness | Moderate, can be local-only | First enhancement after the core content is complete. |
| Embedded code playground | Strong developer-tooling demonstration | Higher loading and security burden | Add later on a dedicated page. |
| Audio/DSP experiment | Potentially distinctive personal/technical intersection | Depends on the actual experiment | Add when there is genuine work to show. |
| AI résumé chatbot | Useful only if retrieval, evaluation, privacy, cost, and failure behavior are well handled | Unnecessary initial scope | Skip for version one. |

If a future playground executes arbitrary code, use a separate origin and tightly restricted iframe permissions; MDN specifically warns against combining `allow-scripts` and `allow-same-origin` for same-origin embedded content. A web worker alone should not be treated as the security boundary for an untrusted-code feature.[^19]
## Quality acceptance criteria
These are proposed release gates, not measured results for either site. A polished portfolio should be evaluated across content, accessibility, stability, and loading—not solely by a Lighthouse badge.

| Area | Proposed acceptance check |
|---|---|
| Identity | A reviewer can identify the person, main engineering focus, and relevant work without searching through menus. |
| Content | At least two finished case studies and two substantial notes; honest contribution and project provenance. |
| Responsive design | Review at narrow phone, tablet, and wide desktop sizes; no unintended horizontal overflow. |
| Keyboard use | Reach all controls, see focus, use navigation without a mouse, and avoid trapped focus. |
| Accessibility | Aim for WCAG 2.2 AA; combine automated checks with manual review.[^20][^21] |
| Motion | Respect reduced-motion preferences; do not make animations necessary to understand content.[^22] |
| Performance | Target good field Core Web Vitals: LCP at most 2.5 seconds, INP at most 200 milliseconds, CLS at most 0.1, evaluated at the 75th percentile.[^23] |
| SEO | Unique page titles/descriptions, canonical URLs, accurate social previews, sitemap, robots configuration, and working internal links.[^24][^25][^26] |
| Reliability | Each advertised demo works or has a clear recording fallback; no dependency on demo uptime for the case-study page. |
| Engineering | CI passes typecheck, lint, content validation, unit tests, production build, and critical end-to-end flows. |
| Privacy | Data collection and third-party services match the actual disclosure; no unnecessary tracker added for appearance. |

Low-traffic sites may not have sufficient field data for every Core Web Vitals report; use repeatable lab checks before launch without presenting them as field results. Playwright can integrate axe, but its documentation explicitly cautions that automated accessibility testing cannot discover every accessibility problem.[^27][^21]
### Test the actual journeys
- Home → featured project → repository or demo.
- Home → writing → article → related project.
- Mobile navigation opens, closes, and returns focus correctly.
- Invalid slugs show a useful not-found page.
- Draft content is absent from indexes, detail routes, feeds if added, and sitemap.
- Theme behavior remains legible and does not produce hydration errors.
- Main identity and project information remain available without JavaScript.

Before linking repositories prominently, review README completeness, license/provenance, setup instructions, outdated demo claims, and secrets. If a real credential has ever been published, rotate it; deleting its visible text is not an adequate remediation plan.
## Six-week delivery plan
The proposed scope is roughly 30–48 focused hours, assuming the existing projects supply most case-study material. If content preparation or original visual design needs longer, reduce launch scope or extend the schedule rather than compressing testing.

| Week | Focus | Deliverable | Exit condition |
|---|---|---|---|
| 1 | Positioning and evidence | Content inventory, headline, two case-study outlines, screenshots and demo audit | The intended reader and strongest proof are clear before implementation. |
| 2 | Design foundation | Desktop/mobile homepage and project layout, tokens, typography, image direction | Pages share a coherent visual system. |
| 3 | Application shell | Routing, navigation, metadata, MDX configuration, content registry, preview deployment | A vertical slice renders real content end to end. |
| 4 | Core content | Two finished case studies, Writing/About pages, two notes, contact and CV links | The site is useful even without signature interactivity. |
| 5 | Differentiation | Booking-flow explainer if time remains; project visual polish | Enhancement adds understanding without blocking ordinary reading. |
| 6 | Verification and launch | Accessibility review, responsive/browser testing, CI gates, domain, privacy, final copy edit | All launch gates pass; any unfinished feature is removed or deferred. |

A shorter MVP should include Home, two project pages, About, contact/CV links, and essential metadata. A CMS, third case study, dark theme, search, comments, and the interactive explainer can all follow later if necessary.
## Scope and evolution
Do not use Harry’s long-running publishing platform as the minimum viable scope. The reference itself demonstrates an ongoing content and systems practice; its infrastructure serves the author’s DevOps positioning.[^3][^5]

| Add later when… | Possible evolution |
|---|---|
| Browser-based editing or non-developer contributors become important | Evaluate a headless CMS; retain the same presentation/content-query boundary. |
| The archive becomes difficult to navigate | Add search; choose local indexing before a hosted search service unless requirements justify it. |
| A real discussion community forms | Evaluate comments and the associated moderation/privacy work. |
| A full-stack or AI experiment has genuine depth | Add a clearly scoped Lab entry with implementation details and evaluation. |
| Publishing in another language becomes sustainable | Add translations with explicit ownership and update discipline. |
| Infrastructure skills become a deliberate showcase goal | Build and document a separate deployment experiment rather than making it a launch dependency. |

Maintain a modest release habit: review links and demos regularly, improve one case study when the project changes, and publish useful engineering notes when there is something concrete to explain. The first task is the flagship case-study outline and evidence inventory—not selecting an animation library.

---

## References

1. [Projects - Harry Tang](https://harrytang.xyz/projects) - Explore a showcase of my most proud projects, including open-source work. Browse the code, contribut...

2. [Articles - Page 1 - Harry Tang](https://harrytang.xyz/articles) - Learn how I attract IT jobs and freelance projects with a personal blog, public GitHub work, and cro...

3. [How I built my microservices portfolio website stack - Harry Tang](https://harrytang.xyz/blog/how-i-built-microservices-portfolio) - A practical showcase of harrytang.xyz, a microservices portfolio built with Next.js, Strapi CMS, Rem...

4. [About - Harry Tang](https://harrytang.xyz/about) - Harry Tang, a Solutions Architect & DevOps Specialist in Espoo, Finland ... Outside of work, he enjo...

5. [Kubernetes And Gitops](https://harrytang.xyz/blog/mirasys-working-experience) - I work at Mirasys Oy in Finland as a Solutions Architect and DevOps Specialist.

6. [Credits - Harry Tang](https://harrytang.xyz/credits) - Explore the complete tech stack powering my personal website, including frameworks, tools, and hosti...

7. [Car Rentals:

# Car Rental Full Stack App

Full-stack car rental app with role-based auth, inventory-safe booking concurrency, Stripe Checkout payment flow, and webhook-driven booking confirmation.

- Backend: Node.js + Express + TypeScript, PostgreS...

...e express.json() and uses express.raw for signature verification

## Test Artifacts

Requests and test logs are in requests/:

- api.http
- race-condition-test.mjs
- race-condition-modify-test.mjs
- idempotency-test.mjs
- idempotency-test-results.txt](https://www.perplexity.ai/search/446a88a8-0afd-4bb6-85fb-ecb5546a44e5) - Dưới đây là 3 bullet “Projects” đã tối ưu, đồng bộ style, và nhấn mạnh rõ tech stack + skills. Bạn c...

8. [How to use markdown and MDX in Next.js](https://nextjs.org/docs/app/guides/mdx) - The Next.js plugin handles transforming markdown and React components into HTML, including support f...

9. [Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Astro helped pioneer and popularize a new frontend architecture pattern called **Islands Architectur...

10. [Why Astro? | Docs](https://docs.astro.build/en/concepts/why-astro/) - - **Content collections:** Organize, validate, and provide TypeScript type-safety for your Markdown ...

11. [generateStaticParams - Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - The generateStaticParams function can be used in combination with dynamic route segments to statical...

12. [Next.js Glossary](https://nextjs.org/docs/app/glossary) - A deployment mode that generates a fully static site with HTML, CSS, and JavaScript files.

13. [Content collections - Astro Docs](https://docs.astro.build/en/guides/content-collections/) - Content collections are the best way to manage sets of content in any Astro project: blog posts, pro...

14. [Deploying](https://nextjs.org/docs/app/getting-started/deploying) - Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally up...

15. [vercel.com](https://vercel.com/docs/deployments/environments.md) - - Push a commit to a branch that is **not** your production branch (commonly `main`)

16. [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby) - As stated in the fair use guidelines, the Hobby plan restricts users to non-commercial, personal use...

17. [We built you a new personal website + Heroicons v2.0, Headless UI v1.7, and more](https://tailwindcss.com/blog/2022-09-09-new-personal-website-heroicons-2-headless-ui-v17?ref=tailwindweekly.ongloat.com) - Like our other templates, it's built with Next.js, and this time we're using MDX to power all of the...

18. [How to create a static export of your Next.js application](https://nextjs.org/docs/app/guides/static-exports) - Image Optimization with the default loader; Draft Mode · Server Actions · Intercepting Routes. Attem...

19. [<iframe> HTML inline frame element - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) - When the embedded document has the same origin as the embedding page, it is strongly discouraged to ...

20. [What's New in WCAG 2.2 | Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) - > The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where:

21. [Accessibility testing](https://playwright.dev/docs/accessibility-testing) - 4. Awaits `AxeBuilder.analyze()` to run the accessibility scan against the page

22. [All WCAG 2.2 Techniques | WAI | W3C](https://www.w3.org/WAI/WCAG22/Techniques/?lang=en) - - C39: Using the CSS prefers-reduced-motion query to prevent motion

23. [How the Core Web Vitals metrics thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds) - So, for example, a 75th percentile LCP of 2 seconds is classified as "good", while a 75th percentile...

24. [generateMetadata - Next.js](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata) - Learn how to add Metadata to your Next.js application for improved search engine optimization (SEO) ...

25. [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - `sitemap.(xml|js|ts)` is a special file that matches the Sitemaps XML format to help search engine c...

26. [robots.txt - Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - Add or generate a robots.txt file that matches the Robots Exclusion Standard in the root of app dire...

27. [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520) - 3. We recommend reading the web.dev fast loading guidelines and the *Web Fundamentals* performance p...

