# Bhutan NDI — website

Next.js 16 website with **Payload CMS 3** as its content management system, on
PostgreSQL, with local-disk uploads in development and Amazon S3 in production.

The public site is statically prerendered; the CMS admin lives at `/admin`.

```bash
pnpm install
pnpm dev                # http://localhost:3000, admin at /admin
pnpm build
pnpm lint
pnpm typecheck
```

First-time setup, and the full architecture, are in **[docs/CMS.md](docs/CMS.md)**.
The short version:

```bash
cp .env.example .env    # fill in PAYLOAD_SECRET and DATABASE_URI
pnpm migrate            # create the schema
pnpm seed               # categories, users, and the site's existing content
pnpm dev
```

## Layout

```
public/media/          static artwork the pages own (not CMS-managed)
src/app/
  (frontend)/          the public site — every URL unchanged
  (payload)/           the admin panel and Payload's REST API
src/components/
  layout/              Atmosphere (circuit background), SiteHeader, SiteFooter
  home/                the eight Home sections
  pages/               per-page components, incl. the job application form
  ui/                  Reveal, cards, icons, form controls
src/content/
  index.ts             THE SEAM — every accessor the components read through
  cms/                 Payload queries and the mappers onto the view types
  *.ts                 content that is deliberately still static
src/payload/
  collections/         one file per collection
  access/              every access rule, in one place
  fields/              reusable field builders (slug, SEO, taxonomy, …)
  optimize/            the image/PDF optimisation pipeline
  storage/             local-disk vs S3
  hooks/               revalidation
  endpoints/           the public job-application endpoint
  seed/                seed data and the seed script
  migrations/          generated; committed
src/payload.config.ts  wiring only
src/hooks/             motion hooks (carousels, circuit glow, reduced motion)
src/lib/               media URL resolution, date formatting, scroll helpers
src/styles/            ndi-effects.css — the effects Tailwind can't express
project/               the original Claude Design handoff bundle (reference only)
```

Two route groups, which is what lets the admin panel have its own root layout
without the site's fonts, header, footer and atmosphere layers wrapped around it.
Route groups do not appear in URLs, so nothing the public sees changed.

## Styling

Design tokens are ported into `src/app/globals.css` as CSS variables and bridged into
Tailwind's theme, so `bg-canvas`, `text-muted`, `border-grid`, `font-display` etc. all
resolve to the design system's values.

The signature effects — `@property`-animated conic-gradient borders, `mask-composite`
lens rims, cursor-tracked spotlights, the glass pass — live in `src/styles/ndi-effects.css`
as hand-written CSS. They have no Tailwind utility equivalent. Everything else is
Tailwind utilities.

Fonts are **Host Grotesk** (display), **Inter** (body) and **DM Mono** (mono). Note the
design-system token files name Space Grotesk and JetBrains Mono, but `ndi-site.css`
overrides both and the prototypes load the three above — those overrides are what
actually rendered, so those are what the build uses.

## The content seam

Components never import content directly. They read through the async accessors
in `src/content/index.ts`:

```ts
const news = await getNews();
```

Those accessors were written as a seam before the CMS existed, and the migration
was a change to their bodies rather than to any component. They now split two
ways:

- **CMS-managed** — news, webinars, insights, glossary, FAQs, team members,
  careers, media coverage — query Payload's Local API. That is an in-process
  call to PostgreSQL, not HTTP, so it runs inside a Server Component being
  prerendered at build time.
- **Still static** — the home page, the users and organizations pages,
  governance, site settings — return the modules in `src/content/`. Those pages
  are marketing copy with bespoke layouts; modelling them as CMS documents would
  buy an editor a form they should not be filling in and cost the site a
  page-builder it does not need.

Between Payload's documents and the components sits a mapper layer
(`src/content/cms/`). Payload's generated types describe storage; the view types
in `src/content/types.ts` describe a rendered page. Resolving a category
relationship to a word on a chip, narrowing an ISO timestamp to the calendar day
the date formatters expect, and applying the SEO fallbacks all happen once,
there, rather than in every component.

---

# The design handoff bundle

`project/` is the original export from Claude Design (claude.ai/design) — HTML/CSS/JS
prototypes, not production code. `project/Bhutan NDI Home.dc.html` is the design this
build implements; `NDI-Nav.dc.html`, `NDI-Footer.dc.html` and `ndi-site.css` are its
shared pieces.

`Bhutan NDI Home v1–v5.dc.html` are superseded drafts — every section in them survives
into the final `Bhutan NDI Home.dc.html`. Don't diff against them.

`support.js` and `image-slot.js` are the design tool's own runtime (a template engine and
an image-placeholder picker). Nothing in them needs porting; the real behaviour lives in
the `class Component extends DCLogic` block at the bottom of each prototype.

The other nine prototypes — Users, Organizations, Company, Governance, Resources, Media
Coverage, FAQs, Glossary, Careers — are designed but not yet built. `/users`,
`/organizations` and friends currently render a placeholder so every nav and footer link
resolves.
