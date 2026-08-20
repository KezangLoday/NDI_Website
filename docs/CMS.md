# The CMS

Payload CMS 3 on PostgreSQL, integrated into the existing Next.js 16 site.

---

## Contents

1. [Running it](#running-it)
2. [Architecture](#architecture)
3. [Collections](#collections)
4. [Relationships](#relationships)
5. [Roles and access control](#roles-and-access-control)
6. [Draft and publish](#draft-and-publish)
7. [Storage: local and S3](#storage-local-and-s3)
8. [File optimisation](#file-optimisation)
9. [Recruitment](#recruitment)
10. [Frontend integration](#frontend-integration)
11. [Environment variables](#environment-variables)
12. [Commands](#commands)
13. [Assumptions](#assumptions)
14. [Decisions needed before production](#decisions-needed-before-production)

---

## Running it

PostgreSQL is expected to be running already — the CMS neither creates nor manages
the container. The development container is `ndi-website` on port **5433**:

```bash
docker run -d --name ndi-website -p 5433:5432 \
  -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=ndi-website postgres:16
```

Then:

```bash
pnpm install
cp .env.example .env          # fill in PAYLOAD_SECRET (openssl rand -base64 48)
pnpm migrate                  # build the schema from the committed migration
pnpm seed                     # categories, users, and the site's existing content
pnpm dev                      # http://localhost:3000 — admin at /admin
```

The seed creates three accounts, all sharing `PAYLOAD_SEED_SUPERADMIN_PASSWORD`:

| Account | Role | Sees |
| --- | --- | --- |
| `PAYLOAD_SEED_SUPERADMIN_EMAIL` | superadmin | everything |
| `hr@…` (same domain) | HR | careers, applications, team, FAQs |
| `pr@…` (same domain) | PR | newsroom, webinars, publications, glossary, media coverage |

**Change all three passwords before anyone else has the URL.**

The seed is idempotent and never destructive: it checks for each document before
creating it and skips what is already there. Running it twice is a no-op, which
matters because the second run is usually someone adding a step to it. The price
is that editing a fixture will not update a document already created from it.

---

## Architecture

```
                    ┌─────────────────────────────────────┐
   Editor  ────────▶│  /admin        Payload admin panel  │
                    │  /api/…        Payload REST API     │
                    └──────────────────┬──────────────────┘
                                       │
                              ┌────────▼────────┐
                              │   PostgreSQL    │
                              └────────┬────────┘
                                       │  Local API — in-process, no HTTP
                    ┌──────────────────▼──────────────────┐
   Visitor ────────▶│  src/content/index.ts   THE SEAM    │
                    │  src/content/cms/       mappers     │
                    │  (frontend) routes      prerendered │
                    └─────────────────────────────────────┘
```

`src/app` has two route groups. `(frontend)` holds every existing route, unchanged;
`(payload)` holds the admin panel and the REST API. Two groups means two root
layouts, which is what lets the admin panel render without the site's fonts,
header, footer and atmosphere layers wrapped around it. **Route groups do not
appear in URLs — no public URL changed.**

`src/payload.config.ts` is wiring only. Every collection, access rule, field
group and hook lives in its own file under `src/payload/`.

### Database changes

64 tables, all created by `src/payload/migrations/20260820_085210_initial.ts`.
Payload owns the schema; there is nothing hand-written in it. Indexes are on
every field the site actually filters or sorts by: slugs (unique per collection),
publication dates, categories, `_status`, recruitment status, job department,
application reference (unique), plus two compound indexes —
`(taxonomy, slug)` unique on categories, and `(job, status)` on applications,
which is the query HR runs most.

---

## Collections

Ordered as the admin sidebar orders them.

| Collection | Group | Purpose |
| --- | --- | --- |
| `media` | Library | Public artwork and documents |
| `categories` | Library | The shared taxonomy for every section |
| `news` | Resources | News & Updates — stories and notices |
| `webinars` | Resources | Sessions, upcoming and recorded |
| `insights` | Resources | Research, case studies, reports, blogs |
| `glossary` | Resources | Term definitions |
| `team-members` | Company | The people on the Company page |
| `faqs` | Company | Questions and answers |
| `media-coverage` | Company | Articles published by other outlets |
| `jobs` | Recruitment | Vacancies and their application requirements |
| `job-applications` | Recruitment | Submissions — private |
| `applicant-documents` | Recruitment | CVs and certificates — private |
| `audit-log` | Recruitment | Append-only recruitment record |
| `users` | Administration | CMS accounts |

Plus one global: **Upcoming events**, which drives the "Upcoming session" card.

### One taxonomy, not six

Five sections need configurable categories and all five want the same behaviour —
a name, a slug, an order, uniqueness. Six collections would have meant six copies
of that, six sets of access rules to keep in step, and six sidebar entries.

`categories` carries a required `taxonomy` discriminator
(`news` · `webinar` · `insight` · `faq` · `media-coverage` · `glossary`).
Each content collection's `category` field filters to its own taxonomy, so a news
editor is offered news categories and nothing else. That filter is enforced
server-side — Payload applies it when validating an incoming value — so it is a
constraint, not just a narrower dropdown.

Uniqueness is per taxonomy: "Research" can exist under both News and Insights.
It is enforced twice, deliberately — a compound unique index is the guarantee,
and a `beforeValidate` hook exists so the ordinary case produces *"There is
already a News category called Announcement"* in the field the editor is looking
at rather than a database constraint violation.

### One news collection, two shapes

The newsroom renders two things: **stories** (artwork, standfirst, an article,
their own page) and **notices** (a dated line, usually linking off-site). They
share a category vocabulary, a date, an archive grid and a publishing workflow —
which is most of what a collection is. A `format` field switches between them and
drives which fields the admin shows.

A notice with no external URL gets its own page, so an announcement with nowhere
else to live still has somewhere to live.

---

## Relationships

```
categories ──filtered by taxonomy──▶ news · webinars · insights · faqs
                                     media-coverage · glossary

media ──▶ news.image, news.gallery[], news.attachments[]
      ──▶ webinars.thumbnail, webinars.speakers[].photo
      ──▶ insights.image, insights.document
      ──▶ team-members.photo
      ──▶ jobs.torDocument, jobs.attachments[]
      ──▶ media-coverage.image
      ──▶ *.meta.image (SEO)

glossary ──▶ glossary.relatedTerms[]        (self, excluding itself)

jobs ──join──▶ job-applications              ("Applications received")
job-applications ──▶ jobs                    (fixed at submission)
                 ──▶ applicant-documents[]   (private)
                 ──▶ users                   (assignedTo, filtered to HR)
                 ──▶ job-applications        (duplicateOf, self)

audit-log ──▶ users (actor)
          ──▶ documents by slug + id, NOT by relationship
```

Two of those deserve a note.

**`jobs` → `job-applications` is a `join` field**, not a counter. It gives HR the
actual list — filterable, sortable — inside the vacancy they are looking at, which
is the workflow the requirements describe. The count comes with it for free, and no
denormalised total can drift out of step with reality.

**`audit-log` deliberately does not use a relationship** for the document it
records. A relationship cascades to null when the application is deleted, which is
precisely when the log line matters most: *"who deleted this, and when"* has to
survive the deletion. The reference number stored alongside is what keeps the
orphaned line readable.

---

## Roles and access control

Every rule lives in `src/payload/access/`. Three roles, modelled as a `hasMany`
select rather than a hierarchy — a small communications team may well have one
person who is both HR and PR, and a fourth combined role would be needed the
moment another pair overlaps.

| | Superadmin | HR | PR | Signed out |
| --- | :---: | :---: | :---: | :---: |
| News, Webinars, Insights, Glossary, Media Coverage | ✅ | — | ✅ | read published |
| Careers (jobs) | ✅ | ✅ | — | read published |
| Team members | ✅ | ✅ | — | read published |
| FAQs | ✅ | ✅ | ✅ | read published |
| Categories, Media | ✅ | ✅ | ✅ | read |
| **Job applications** | ✅ | ✅ | ❌ | ❌ |
| **Applicant documents** | ✅ | ✅ | ❌ | ❌ |
| **Audit log** | read | read | ❌ | ❌ |
| Delete content | ✅ | — | — | — |
| Delete an application | ✅ | ❌ | ❌ | ❌ |
| Users | ✅ | own only | own only | ❌ |

Four things about how this is enforced:

**Rules return constraints, not booleans, wherever the answer is "some of them".**
A rule that returns a `Where` lets Payload push the restriction into the SQL, so an
unauthorised row is never loaded, never serialised and never counted. Filtering
after the fact would leak totals through pagination metadata even when the
documents themselves are hidden.

**Nothing relies on the admin UI hiding a control.** `admin.hidden` is cosmetic.
The rules are what the REST API, the Local API and static file requests all go
through — including `GET /api/applicant-documents/file/<name>`, which runs the
collection's `read` rule before returning a single byte.

**PR is excluded from recruitment by omission, not by an explicit deny**, so a
fourth role added later starts with no access to recruitment data rather than
inheriting it.

**`roles` carries a field-level rule of its own.** Any user may edit their own
document — that is what makes the account page work — and without the field rule
that would include *"add superadmin to your own roles"*, which would make every
other rule in the CMS decoration.

Deletion of content is superadmin-only because Payload nulls references rather
than refusing: an editor tidying a category list should not be able to strip the
category off forty published articles by accident.

---

## Draft and publish

Two states, nothing more. Payload implements drafts on top of its versions table,
so versions are enabled but capped at **two per document** — the published one and
the draft on top of it. That is the minimum for "edit a published page without the
edits going live"; anything above two would be version history by another name.

Drafts **skip validation**; publishing enforces it in full. The commonest thing an
editor does is save a headline and come back to the body, and validating drafts
would make "save what I have so far" impossible for exactly the documents that
most need it.

Draft content is guarded twice, independently:

1. **The collection's `read` rule** returns a published-only constraint for
   anonymous callers. This covers the REST API, and any future code that forgets
   to filter.
2. **Every frontend query asks for published documents explicitly.** This is the
   guard that actually protects the public pages, because the Local API runs with
   access control *overridden* by default — which is what makes it usable at build
   time, and why the collection rule alone would not be enough.

---

## Storage: local and S3

One switch, `src/payload/storage/index.ts`. No collection, hook or component knows
which is in force.

|  | Development | Production |
| --- | --- | --- |
| Public media | `./media/` | S3, `media/` prefix, served direct or via CDN |
| Applicant documents | `./.uploads/applicant-documents/` | S3, private ACL, own prefix or bucket |

Both directories are gitignored.

The driver is resolved from **configuration, not `NODE_ENV`**. `next build` runs
with `NODE_ENV=production`, so keying off it would mean a production build could
not be produced without live S3 credentials in the build environment. Building is
not running. The rule is:

1. `MEDIA_STORAGE` wins if set (an explicit `s3` with no credentials still throws).
2. Otherwise S3 if `S3_BUCKET` is set.
3. Otherwise local disk.

A production deployment that resolves to local disk logs a loud warning, because a
container's filesystem is ephemeral and uploads would vanish on the next deploy.

### Why two adapter instances

Public media and applicant documents get **separate S3 adapter instances**, and
that separation is the security boundary rather than a tidiness measure:

- Public media is written with a public-read ACL under its own prefix and served
  straight from the bucket or a CDN, **bypassing the application entirely**. That
  is what makes images fast.
- Applicant documents are written **private**, under a different prefix (and
  optionally a different bucket), and are reachable *only* through Payload's own
  file route — which runs the collection's `read` access control first. There is
  no configuration in which an applicant document is publicly readable, because
  the code path that would make it so does not exist.

One adapter for both would mean one ACL for both, and the only safe choice would
then be to make every site image private and proxy it.

In development, applicant documents are written to `.uploads/` — deliberately
outside `public/`, so the dev server cannot serve them either. A setup that wrote
CVs into `public/` would reintroduce the exact leak the production configuration
prevents, on the machine where people actually experiment.

---

## File optimisation

`src/payload/optimize/` — a registry of strategies, one object each. Adding one
means writing an object and putting it in a list; nothing else in the CMS needs to
know.

The pipeline runs in a `beforeOperation` hook, which is the last point at which
`req.file` can still be replaced — Payload's own `generateFileData` reads it
immediately afterwards to compute the stored filename, probe the dimensions and
generate every `imageSizes` variant. So a file normalised to WebP here has its
thumbnails generated as WebP for free.

**There is no file-size limit.** A limit is a message to an editor saying "make
this smaller yourself", which they do by picking a worse export setting. The 1GB
ceiling in the config is a guard against a runaway upload exhausting server
memory, not an editorial limit.

Every result is recorded on the document (`optimization.strategy`,
`originalBytes`, `optimizedBytes`, `note`), so an editor who sees a 40MB scan
listed at 3MB can find out why without asking a developer.

### Images — public media

Converted to WebP at quality 82, capped at 2560px on the longest edge, with four
variants generated (240 square, 640, 1024, 1600 — the widths the design's `sizes`
attributes actually ask for). Metadata is stripped, which is a privacy measure as
much as a size one: a phone photograph carries GPS coordinates. EXIF orientation
is baked in first, or phone photographs appear on their side.

Measured on the seeded content: one 1.74MB source became 78KB.

It **declines** in three cases, each a real one:

- Already WebP or AVIF and within the cap — a second generation of lossy encoding
  costs visible quality on thin strokes and saves almost nothing.
- WebP came out larger — flat-colour line art, screenshots and diagrams do this.
- Animated — a still encode keeps the first frame and discards the rest, which is
  a bug rather than a saving.

SVG is never touched: no pixels to optimise, and Payload runs its own SVG
validation that this must not get in front of.

### Images — applicant documents

A different strategy, and the split is on **lossy versus lossless**, which took a
measurement to get right.

The obvious design was "cap the dimensions of anything too large". Measured on
realistic inputs that is a bad trade for a lossy format: a 4000px phone photograph
resized to 3508px and re-encoded at a quality safe for small print comes out
roughly **twice the size** of the original, because the original was encoded at a
camera's quality with 4:2:0 chroma. So the resize costs a second generation of
lossy encoding on a document that may be evidence in a hiring decision, and saves
nothing.

For a lossless format the calculus is opposite: re-encoding a PNG costs no
fidelity at all, and resizing an oversized scan reliably halves it — measured at
48% on a photographed certificate. So:

- **JPEG, WebP, HEIC** — stored exactly as uploaded. Always.
- **PNG, TIFF** — resized if over 3508px (A4 at 300dpi), re-encoded losslessly,
  and kept only if the result is actually smaller.

The upshot is that the overwhelmingly common case is byte-for-byte preservation,
which is what *"integrity takes priority over aggressive compression"* should mean
in practice.

### PDFs

Public media only, and restricted to the one transformation that cannot lose
anything: re-saving with cross-reference and object streams. That rewrites how the
PDF's internal objects are packed without altering any of them — text stays text,
vectors stay vectors, embedded images keep their original bytes. Typically 10–30%
off a Word or scanner export.

It does **not** re-encode the images inside a PDF, which is where the real savings
are. A publication or a terms-of-reference document is a record; re-encoding its
figures degrades exactly the charts and scans someone opened it to read, and the
damage is invisible until it matters.

Every result is verified — the output is re-opened and its page count compared
against the input — and anything surprising means the original is kept. Encrypted
and permission-restricted PDFs are never re-saved, because pdf-lib would write them
back without their protection.

**Applicant PDFs have no strategy at all.** A CV or a certificate is stored as it
arrived.

### Everything else

Word documents, spreadsheets and archives pass through untouched. A `.docx` is a
ZIP that is already deflated; rewriting one to save a fraction of a percent risks
handing back a file Word will not open.

### File-type verification

`src/payload/lib/fileType.ts` checks an upload's leading bytes against its declared
MIME type. The MIME type comes from the browser, which took it from the extension —
it is a hint, and an attacker controls it completely. This is what stops
`payload.pdf.exe` renamed to `payload.pdf`, and an HTML file dressed as a JPEG,
which matters because a stored HTML file served from the site's own origin is a
script running as the site.

It is **not** malware scanning. See
[decisions needed before production](#decisions-needed-before-production).

---

## Recruitment

```
Job posting ──▶ Applications ──▶ Applicant information
                             ──▶ Education documents      ┐
                             ──▶ Professional documents   ├─ private
                             ──▶ Internal notes           │
                             ──▶ Status + status history  ┘
                             ──▶ HR assignment
```

### Applying

`POST /api/job-applications/submit` is the only path by which an unauthenticated
request causes a write, so it is the security boundary and it does the work that
implies:

1. The job is loaded and checked — **published**, **open**, **deadline in the
   future**. All three, server-side. A hidden Apply button is a courtesy, not a
   control.
2. The applicant's fields are validated.
3. Each file's declared type is verified against its actual bytes, and the set of
   files is checked against what *this* job requires.
4. Duplicates are detected and either flagged or refused, per the job.
5. Documents are stored privately, then the application is created — and if that
   create fails, the documents just written are **deleted** rather than left
   orphaned. An orphaned CV is unreachable through the admin panel and still
   personal data the programme is responsible for.

It is a Payload endpoint rather than a Server Action for one concrete reason: a
Server Action body goes through Next's `bodySizeLimit`, which defaults to 1MB and
would reject a perfectly ordinary set of scanned certificates.

The receipt carries the reference number, the job title and the date, and nothing
else. An applicant learns what they need to follow up and nothing about how they
will be assessed.

### Document requirements are per-job

The application form's slots come from the job's own `requiredDocuments` and
`optionalDocuments`. A post that needs a Class X certificate shows a Class X
field; a consultancy that needs only a CV shows only that. A recruitment form is
the one place on a government site where every extra box is a small act of data
collection.

### Reference numbers

`APP-2026-00001`. Never the database id — a sequential primary key tells an
applicant how many people applied and invites enumeration of other people's
records.

Uniqueness is guaranteed by the unique index on the column, not by the generator.
That distinction is the design: `nextReference` reads the highest reference and
adds one, two simultaneous submissions can read the same value, the insert then
fails for one of them, and the endpoint retries with a freshly read number. The
zero-padding is what makes `sort: '-reference'` a numeric sort. An atomic counter
would be race-free on the first attempt but would mean reaching past Payload's
public API into the Drizzle instance and the request's transaction; at the volume
a national programme's vacancy attracts, a retry loop is both correct and much
less to go wrong.

### The pipeline

Twelve statuses, defined once in
`src/payload/collections/recruitment/pipeline.ts`. Adding one means adding an entry
there and nothing else — the select options, the admin filters, the history labels
and the terminal-state logic are all derived from it.

They are a typed constant rather than a collection, and the requirements raise
that option, so: the statuses are an internal workflow, not content. Nothing on
the public site reads them, so there is no frontend to "hard-code them throughout".
Against that, a select column is what makes Payload's list filters and `where`
clauses work directly on the status — *"show me everyone shortlisted for this
post"* is the single most useful thing HR does with this data, and a relationship
would turn it into a join.

### Status history and audit

Two mechanisms, deliberately. **`statusHistory`** on the application is the
timeline HR reads: read-only, appended by a `beforeChange` hook in the same
operation as the status itself, so there is no window in which the status has
moved and the timeline has not. Each entry records the previous status, the new
one, the time, the user, and the reason typed into a transient box that is cleared
afterwards so it does not repeat on the next change.

The initial "Submitted" entry is attributed to **nobody**, which is correct: the
applicant made that change and the applicant is not a CMS user.

**`audit-log`** is the wider record — assignments, notes, deletions — and is
append-only by construction: `create` and `update` are closed to every API caller
including superadmin. A log that can be edited by the people it records is not a
log. Audit writes never roll back the thing they record: refusing to accept an
application because the log write failed would be a worse outcome than an
incomplete log.

### HR's workflow

Open Careers → open a vacancy → **Applications received** (a `join` field, newest
first) → open an applicant → five tabs in the order a recruiter reads: Applicant,
Education, Experience, Documents, Recruitment.

Applications are searchable by reference, name and email, and filterable by status,
job, assignee and date. The list's default columns are the ones you scan down a
list of 124: who, for what, where in the pipeline, whose desk, when.

### Duplicates

Detected on (job, email). Per-job configuration decides what happens: with
resubmission allowed (the default) both records are kept and the later one is
flagged with `duplicateOf` — usually a correction, and it is for HR to decide
which to progress. With it off, the second attempt is refused and the message
quotes their existing reference so they can follow it up.

---

## Frontend integration

Every public page is **statically prerendered**, exactly as before the CMS. The
build output shows `○ (Static)` or `● (SSG)` for all of them; only `/admin` and
`/api` are dynamic.

Freshness comes from on-demand revalidation: Payload's `afterChange` and
`afterDelete` hooks call `revalidatePath` for the routes a document appears on
(`src/payload/hooks/revalidate.ts`), so publishing shows up in seconds. Each route
also carries a `revalidate` floor — a day for editorial content, an hour for
careers, where a deadline lapses on its own with no editor action to trigger
anything.

Draft saves do not revalidate. A draft cannot appear publicly, and an editor
working through a long article saves many times.

Queries set `select` and `depth` per call rather than taking the defaults: a
listing that fetched whole article bodies to render a card would be pulling tens
of kilobytes of Lexical JSON per row.

### Rich text

Article bodies are Lexical, rendered through `src/content/cms/richText.tsx`, which
overrides Payload's converters so every class is the one the hand-written markup
used. The editor's feature set is deliberately small — no H1 (the page's `h1` is
the headline field), no alignment or indent, no tables, no inline images. Every
feature offered is a way for an editor to produce something the renderer has to
have an answer for.

### Routes

Unchanged. The requirements list `/company/careers/[slug]` and
`/company/media-coverage/[slug]`; the existing site uses `/careers/[slug]` and
`/media-coverage`, and *"do not break existing routes"* takes precedence.

Media coverage has no detail route, which is the existing site's own decision and
is preserved: the article belongs to the outlet that published it, and a local page
restating someone else's reporting would be redundant. Entries carry a slug anyway,
so a detail route is available later without a migration.

---

## Environment variables

See `.env.example` for the annotated version.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PAYLOAD_SECRET` | ✅ | Signs auth tokens. Per-environment. Changing it signs everyone out. |
| `DATABASE_URI` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | — | Origin. `metadataBase`, Payload `serverURL`, CSRF and CORS origin |
| `DATABASE_PUSH` | — | Schema push instead of migrations. On outside production |
| `MEDIA_STORAGE` | — | `local` or `s3`. Inferred from `S3_BUCKET` if unset |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | — | CDN domain in front of the bucket |
| `S3_BUCKET` | prod | Setting this switches storage to S3 |
| `S3_REGION` | prod | |
| `S3_ACCESS_KEY_ID` | prod | Never `NEXT_PUBLIC_` |
| `S3_SECRET_ACCESS_KEY` | prod | Never `NEXT_PUBLIC_` |
| `S3_PRIVATE_BUCKET` | — | Separate bucket for applicant documents. Recommended |
| `S3_PUBLIC_PREFIX` | — | Default `media` |
| `S3_PRIVATE_PREFIX` | — | Default `applicant-documents` |
| `S3_PUBLIC_ACL` | — | `public-read` \| `private` \| `none` |
| `S3_ENDPOINT` | — | S3-compatible providers only (MinIO, R2, Spaces) |
| `S3_FORCE_PATH_STYLE` | — | S3-compatible providers only |
| `PAYLOAD_SEED_SUPERADMIN_EMAIL` | seed | First superadmin |
| `PAYLOAD_SEED_SUPERADMIN_PASSWORD` | seed | Change immediately after first sign-in |

All credentials are read in exactly one module, `src/payload/env.ts`, which throws
on a missing required value and refuses to load in a browser.

---

## Commands

```bash
pnpm dev                  # dev server, admin at /admin
pnpm build                # production build
pnpm start                # serve the build
pnpm lint
pnpm typecheck

pnpm migrate              # apply pending migrations
pnpm migrate:create name  # generate one from the current config
pnpm migrate:status
pnpm migrate:down         # roll the last one back

pnpm seed                 # idempotent; safe to re-run
pnpm generate:types       # regenerate src/payload-types.ts
pnpm generate:importmap   # after adding a custom admin component
```

**After changing a collection**, run `pnpm generate:types` and then
`pnpm migrate:create <name>`. Development uses schema push, so a missing migration
will not be noticed locally and will fail in production.

If a build serves stale content after a code change, clear Turbopack's build
cache: `rm -rf .next && pnpm build`.

---

## Assumptions

1. **Dates are Bhutan time.** Webinar times are stored as UTC and rendered as
   `BTT` with the zone named, rather than converted to the reader's timezone — a
   visitor in London is better served by a time that matches the invitation than
   by one that silently disagrees with every other reference to the session.
2. **Application deadlines are inclusive to the end of their UTC day.** Bhutan is
   UTC+6, so this is six hours of grace rather than a day lost — the forgiving
   direction to err in.
3. **Slugs are ASCII.** A Dzongkha slug percent-encodes to something unshareable,
   and transliterating it needs a mapping table nobody here can maintain
   responsibly. Titles that produce nothing usable need a manual slug, which the
   validation surfaces immediately.
4. **The seeded ToR content is illustrative.** The eligibility bars in the seeded
   vacancies — Class X and XII marks, degree percentages — are a worked example of
   the shape, not Bhutan NDI's actual hiring criteria. HR should replace every one.
5. **Four media-coverage fixtures were not seeded** because they carry no external
   URL, and `url` is required and validated. Inventing one would put a broken or
   misattributed link on a public page. The page's empty state handles it; the real
   URLs need supplying.
6. **Applicant data retention is stated but not automated.** The consent text says
   six months after the post is filled; nothing deletes it on that schedule yet.
7. **No email is configured.** Payload logs mail to the console. The application
   flow is built so a confirmation email is an addition rather than a restructure —
   the receipt data already exists at the point one would be sent.

---

## Decisions needed before production

1. **S3 bucket layout.** Two buckets (recommended) or one with two prefixes?
   Modern buckets have ACLs disabled by default (Object Ownership = *bucket owner
   enforced*), which rejects `public-read` outright — those need
   `S3_PUBLIC_ACL=none` plus a bucket policy or a CloudFront origin access control
   on the public prefix. The applicant bucket must have **no** public policy and
   Block Public Access fully on.
2. **CDN.** `NEXT_PUBLIC_MEDIA_BASE_URL` should point at CloudFront rather than
   the bucket directly. Without it images are served from S3, which works but is
   slower and costs more.
3. **Malware scanning.** File-type verification is not virus scanning. Applicant
   uploads are unscanned attachments that HR staff will open. An S3 event trigger
   into GuardDuty Malware Protection or ClamAV is the usual answer, and it is a
   deployment decision rather than an application one.
4. **Data retention.** Someone needs to own the six-month deletion the consent
   text promises — a scheduled job, or a documented manual process.
5. **Backups.** Applicant documents are the only data in this system that cannot
   be recreated. Bucket versioning and a tested restore.
6. **Whether HR may reassign another HR user's applications.** Currently only
   superadmin can; `canReassign` in `JobApplications.ts` is the one place to change
   it.
7. **`pnpm-lock.yaml` is the committed lockfile**, but an untracked
   `package-lock.json` exists in the tree from an earlier `npm install`. Delete it,
   or switch the project to npm deliberately — the `pnpm-workspace.yaml` build
   approvals only work under pnpm.
