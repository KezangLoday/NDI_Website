# Bhutan NDI — website

Next.js implementation of the Bhutan NDI website redesign.

**Phase 1 (current): the Home page**, built to match the design at full fidelity, using
local media in `/public` and mock data in `src/content`. Payload CMS v3, PostgreSQL and
S3 come in Phase 2 — the content layer is already built behind a seam so that is a swap,
not a rewrite.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Layout

```
public/media/          hero phones, org and partner logos, news images
src/app/               routes — / is the built Home page, the rest are stubs
src/components/
  layout/              Atmosphere (circuit background), SiteHeader, SiteFooter
  home/                the eight Home sections
  ui/                  Reveal, cards, icons, form controls
src/content/           mock data, shaped like Payload documents
src/hooks/             motion hooks (carousels, circuit glow, reduced motion)
src/lib/               media URL resolution, date formatting, scroll helpers
src/styles/            ndi-effects.css — the effects Tailwind can't express
project/               the original Claude Design handoff bundle (reference only)
```

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

## The Phase 2 seam

Components never import mock data directly. They read through the async accessors in
`src/content/index.ts`:

```ts
const news = await getNews();
```

In Phase 2 those function bodies become Payload Local API calls and no component
changes. Mock records already carry `id`/`slug`, media uses Payload's upload shape
(`{ url, alt, width, height }`) resolved through `src/lib/media.ts`, and dates are ISO
strings formatted at render time.

Collections the content implies: `news`, `organizations`, `collaborators`,
`capabilities`, `useCases`, `services`, plus a `siteSettings` global for nav, footer,
contact details and social links.

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
