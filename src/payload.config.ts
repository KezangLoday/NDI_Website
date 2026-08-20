/**
 * The Payload configuration.
 *
 * Kept to wiring: every collection, access rule, field group and hook lives in
 * its own file under `src/payload/`, and this assembles them. The reason is
 * plain enough after the third time someone has to scroll past a thousand lines
 * of field definitions to change a database setting.
 *
 * The one thing that is decided here rather than delegated is ordering: the
 * order of `collections` is the order of the admin sidebar, so it is grouped the
 * way the people using it think — the two libraries, then the site's own
 * sections, then recruitment, then administration.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ApplicantDocuments } from "./payload/collections/ApplicantDocuments";
import { AuditLog } from "./payload/collections/AuditLog";
import { Categories } from "./payload/collections/Categories";
import { Faqs } from "./payload/collections/Faqs";
import { Glossary } from "./payload/collections/Glossary";
import { Insights } from "./payload/collections/Insights";
import { JobApplications } from "./payload/collections/JobApplications";
import { Jobs } from "./payload/collections/Jobs";
import { Media } from "./payload/collections/Media";
import { MediaCoverage } from "./payload/collections/MediaCoverage";
import { News } from "./payload/collections/News";
import { TeamMembers } from "./payload/collections/TeamMembers";
import { Users } from "./payload/collections/Users";
import { Webinars } from "./payload/collections/Webinars";
import { databasePush, databaseURI, payloadSecret, serverURL } from "./payload/env";
import { UpcomingEvents } from "./payload/globals/UpcomingEvents";
import { storagePlugins } from "./payload/storage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  serverURL: serverURL(),
  secret: payloadSecret(),

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · Bhutan NDI CMS",
    },
    /**
     * Live preview is not configured, and the `preview` functions on the
     * content collections open the real page instead. With drafts, that page
     * renders the published version — so the button is honest about what it
     * shows rather than implying an unpublished preview that does not exist.
     */
    components: {},
  },

  /**
   * `dirname` is derived from `import.meta.url` rather than hard-coded, because
   * this file is loaded from two very different places: Next's bundler, and the
   * Payload CLI running under Node. Only one of them has a predictable cwd.
   */
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: { connectionString: databaseURI() },
    /**
     * Schema push in development, migrations in production.
     *
     * The distinction matters: push diffs the config against the live database
     * and applies the difference, which is exactly what you want while adding
     * fields and exactly what you do not want anywhere near real data.
     */
    push: databasePush(),
    migrationDir: path.resolve(dirname, "payload/migrations"),
  }),

  /**
   * Lexical is the default editor for any `richText` field that does not name
   * one. The fields that matter each configure their own restricted feature set
   * — see `src/payload/fields/richText.ts`.
   */
  editor: lexicalEditor(),

  /**
   * Passed in rather than imported by Payload, which is how Payload keeps sharp
   * optional. It is not optional here: the image pipeline depends on it.
   */
  sharp,

  collections: [
    /* The libraries everything else draws on. */
    Media,
    Categories,

    /* Resources. */
    News,
    Webinars,
    Insights,
    Glossary,

    /* Company. */
    TeamMembers,
    Faqs,
    MediaCoverage,

    /* Recruitment. */
    Jobs,
    JobApplications,
    ApplicantDocuments,
    AuditLog,

    /* Administration. */
    Users,
  ],

  globals: [UpcomingEvents],

  plugins: storagePlugins(),

  /**
   * No application-level file-size limit.
   *
   * The requirement is explicit, and it is the right call: a limit here is a
   * message to an editor saying "make this smaller yourself", which they do by
   * choosing a worse export setting. The optimisation pipeline handles size, and
   * it does a better job than a person guessing at a quality slider.
   *
   * The number below is a guard against a runaway upload exhausting server
   * memory, not an editorial limit — a gigabyte is far beyond any legitimate
   * certificate, report or photograph.
   */
  upload: {
    limits: { fileSize: 1024 * 1024 * 1024 },
  },

  /**
   * GraphQL is disabled.
   *
   * Nothing uses it — the frontend reads through the Local API, which does not
   * go over the network at all — and it is a second, independently-implemented
   * surface over the same collections. That is a second place for an access rule
   * to be wrong, guarding recruitment data. Turning it off removes the risk
   * rather than doubling the review.
   */
  graphQL: {
    disable: true,
  },

  /**
   * CSRF protection for cookie-authenticated requests.
   *
   * Payload accepts its auth cookie only for requests originating from these
   * origins, which stops another site making authenticated calls on a signed-in
   * editor's behalf.
   */
  csrf: [serverURL()],

  cors: {
    origins: [serverURL()],
  },

  telemetry: false,
});
