/** The Payload configuration. */
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
    /** Live preview is not configured, and the `preview` functions on the content collections open the real page instead. */
    components: {},
  },

  /** `dirname` is derived from `import.meta.url` rather than hard-coded, because this file is loaded from two very different places: Next's bundler, and the Payload CLI running under Node. */
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: { connectionString: databaseURI() },
    /** Schema push in development, migrations in production. */
    push: databasePush(),
    migrationDir: path.resolve(dirname, "payload/migrations"),
  }),

  /** Lexical is the default editor for any `richText` field that does not name one. */
  editor: lexicalEditor(),

  /** Passed in rather than imported by Payload, which is how Payload keeps sharp optional. */
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

  /** No application-level file-size limit. */
  upload: {
    limits: { fileSize: 1024 * 1024 * 1024 },
  },

  /** GraphQL is disabled. */
  graphQL: {
    disable: true,
  },

  /** CSRF protection for cookie-authenticated requests. */
  csrf: [serverURL()],

  cors: {
    origins: [serverURL()],
  },

  telemetry: false,
});
