# Bhutan NDI — Design System

The brand and UI system for **Bhutan NDI** (National Digital Identity): the
world's first national digital identity built entirely on decentralized
**Self-Sovereign Identity (SSI)** technology. Citizens take full control of their
personal data and access public and private services through a secure wallet.

This system is a **hyper-modern, dark-theme rebrand** of the NDI website and app —
an engineering-grade interface (think GitHub / Vercel / modern Web3) carrying an
authoritative, sovereign national presence.

---

## Sources

- **Figma — "New_Bhutan NDI App" + "NDI Website"** (mounted as a read-only VFS during
  authoring). The existing light-theme site: 285 website frames, 12 asset frames,
  171 component sets. Used as the source of truth for **copy, page structure, and
  product surfaces** — not visual style, which is the new rebrand.
- **Brand brief** (the rebrand spec) — color architecture, typography and the
  tech-platform visual vibe. This brief governs all visual decisions.
- **Uploaded logos** — `assets/logos/` (horizontal, vertical, circuit mark; light + dark).

> The Figma is a real, messy working file (auto-named frames, lorem ipsum,
> light-theme illustrations). We extracted brand colors (confirmed: bg `#141B29`,
> accent `#5AC994`), real copy, and the logos, then authored a fresh, coherent
> dark component set rather than materializing hundreds of disposable layout frames.

---

## What's here (manifest)

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import`s only. Consumers link this. |
| `tokens/` | `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`, `base.css` |
| `components/forms/` | Button, IconButton, Input, Select, Checkbox, Switch |
| `components/data-display/` | Badge, Card, Avatar, MonoLabel |
| `components/feedback/` | Dialog, Toast, ProgressBar |
| `components/navigation/` | Tabs, Accordion |
| `components/brand/` | CredentialCard, FeatureCard, Logo |
| `ui_kits/website/` | Dark marketing site (Home / Users / Orgs / Developers) |
| `ui_kits/app/` | Mobile SSI wallet (login → wallet → scan → consent → activity) |
| `guidelines/foundations/` | Specimen cards (Colors, Type, Spacing, Brand) |
| `assets/logos/` | NDI logo lockups |
| `SKILL.md` | Agent Skill manifest for downloadable use |

The **Design System tab** renders every `@dsCard`-tagged file grouped by concern.

---

## CONTENT FUNDAMENTALS

**Voice.** Authoritative but human; confident, never hype. We speak as a national
institution that respects the citizen. Plain language about complex cryptography.

- **Person.** Address the user as **"you"** ("Your secure, sovereign digital
  identity", "Take full control of your personal data"). The organization is
  **"we"** ("We enable trusted interaction…"). Citizens are "citizens" / "users".
- **Casing.** Sentence case for body and most headings. Display headlines may use
  a single emphasized word in mint. UPPERCASE is reserved for **monospaced system
  labels / eyebrows** (e.g. `— SECURE · SELF-SOVEREIGN · VERIFIABLE`).
- **Tone words.** sovereign, secure, decentralized, self-sovereign, verifiable,
  tamper-proof, trusted, control, consent, seamless. Avoid "revolutionary",
  "disrupt", and exclamation-heavy marketing (the legacy site's "Download Now!"
  becomes a calm "Download Now").
- **Numbers/metadata** are mono and terse: `did:ndi:0x7f3a…e91c`, `Issued 2026-06-29`,
  `120+ services`. Stats are sparse and meaningful — never decorative.
- **Emoji:** never. The engineered aesthetic uses monospaced ticks (`—`, `·`),
  status dots, and line icons instead.
- **Bhutanese touches** are welcome and warm: "Kuzuzangpo" greeting, real partner
  names (RCSC, RUB, DHI, BOB, RMA, TashiCell), "Royal Government of Bhutan".

Examples (from the system):
- Hero: *"Your secure, sovereign digital identity"* / *"Take full control of your
  personal data and seamlessly access public and private services."*
- Feature: *"Self-sovereign — You hold the keys. Credentials live in your wallet,
  never on a central server."*

---

## VISUAL FOUNDATIONS

**Color.** Dark-mode dominant. Three brand anchors:
- **Mint `#5AC994`** — the single accent. CTAs, active nodes, micro-glow hovers,
  links, status dots, the one emphasized headline word. Used sparingly for maximum
  signal.
- **Deep teal `#124143`** — structural depth: glassmorphism panel fills, depth
  gradients, container tints.
- **Obsidian `#141B29`** — the base canvas (near-black, slightly cool).
Neutrals are an obsidian-derived cool ramp (`--ndi-ink-900…400`). Semantic:
success = mint, info `#4AA3FF`, warning `#F5B740`, danger `#E1493E` (from Figma).

**Typography.**
- **Display / headlines — Space Grotesk** (self-hosted): mechanical,
  geometric, slightly condensed (`-0.03em` tracking) to signal cryptographic
  engineering.
- **Body / UI — Inter:** razor-sharp grotesque, line-height 1.62.
- **Metadata / labels / DIDs — JetBrains Mono:** uppercase, wide tracking
  (`0.18em`) for system badges; the "secure digital wallet" signal.

**Backgrounds.** No photography-led heroes. Surfaces are flat obsidian with:
- a **radial depth gradient** (`--grad-depth`, obsidian→teal at top),
- a faint **tech-wireframe grid** (`--grid-bg`, mint 8% lines, radially masked),
- and **mint radial glows** behind focal objects (credential cards, CTAs).
Imagery, when present, is cool-toned; the hero leads with a real `CredentialCard`,
not a stock photo.

**Borders.** The signature: **low-opacity mint hairlines** —
`rgba(90,201,148,0.15)` (`--border-grid`) — forming elegant tech-wireframe edges
on cards, inputs, nav and dividers. Stronger mint (25%) on hover/active.

**Cards.** Teal-tinted **glassmorphism**: `--grad-card` fill + `backdrop-filter:
blur(18px)` + mint hairline + a 1px top inset highlight + a low cool shadow.
Radius 16px (`--radius-lg`); hero panels 24px. They **lift 3–4px and gain a mint
glow** on hover.

**Shadows & glows.** Two systems: cool **elevation shadows** (low, dark, diffuse)
for depth, and **mint glows** (`--glow-sm/md/lg`) for interactivity and "active
nodes". Glow — not drop shadow — communicates focus and energy.

**Transparency & blur.** Used deliberately: sticky nav (`blur(14px)` over 72%
obsidian), glass cards, dialog scrims (`blur(6px)`), mobile bottom-sheets. Never
gratuitous.

**Radii.** 8 / 12 (controls) / 16 (cards) / 24 (hero) / pill. Consistent, modern,
not over-rounded.

**Motion.** Restrained and precise. `--ease-out` cubic-bezier(0.22,1,0.36,1) for
entrances/hovers; 140–400ms. Hover = glow + 3px lift; **press = `scale(0.99)` +
1px translate**. No bounces, no infinite decorative loops on content. Respects
`prefers-reduced-motion`.

**Hover / press states.** Hover lightens surface (`--surface-hover`) or adds mint
glow; primary buttons shift to `--accent-hover` (`#6FE0A9`) + glow. Press darkens
to `--accent-press` (`#3DA876`) and shrinks slightly.

**Layout.** 1200px content max, 32px gutters, 8px spacing grid, generous section
padding (`--section-y`, up to 128px). Sticky translucent header. Ample negative
space over density.

---

## ICONOGRAPHY

- **Line icons, Lucide-style** — 1.8px stroke, rounded caps/joins, currentColor.
  The system ships a curated set in `ui_kits/website/Icons.jsx` (`window.Icons`):
  shield, wallet, fingerprint, globe, key, qr, layers, bolt, lock, check,
  arrow-right, menu, building, code, users, send, scan. They match the thin,
  engineered wireframe aesthetic and the circuit-line motif of the logo mark.
  > **Substitution flag:** this Lucide-style set is our own recreation in the
  > brand stroke weight, not extracted from the Figma (whose icons were colorful
  > flat illustrations belonging to the old light brand). If you have an official
  > NDI icon library, drop it in and we'll switch.
- **Logo mark** — the circular **circuit-art wireframe** (concentric arcs + nodes)
  is the brand's hero glyph; its linear-circuit language inspires backgrounds,
  glows and the QR/scan treatments. Lockups in `assets/logos/`.
- **No emoji. No unicode glyph icons.** Monospaced ticks (`—`, `·`) and glowing
  status dots stand in for decorative marks.
- Icons sit in 44–52px rounded mint-tinted tiles on feature cards and in 12px
  radius squares inline.

---

## Quick start

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>const { Button, CredentialCard } = window.BhutanNDIDesignSystem_fabd6a;</script>
```

Namespace: **`BhutanNDIDesignSystem_fabd6a`**.

---

## CAVEATS / OPEN QUESTIONS

- **Fonts:** Space Grotesk (self-hosted TTF), Inter and JetBrains Mono (Google
  Fonts). **Satoshi** (mentioned in the brief as a body option)
  is not freely CDN-hosted — we standardized on **Inter** for body. If you want
  Satoshi self-hosted, upload the files and we'll wire `@font-face`.
- **Iconography** is a Lucide-style recreation in the brand stroke weight (see
  above) — swap in the official set if one exists.
- The Figma's 171 "component families" are largely auto-named layout frames and
  legacy light-theme illustrations; we authored a clean dark component set instead
  of materializing them verbatim.
