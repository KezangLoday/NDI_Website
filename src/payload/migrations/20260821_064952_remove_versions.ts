import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_news_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v_version_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v_version_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_glossary_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_glossary_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v_version_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faqs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_coverage_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_version_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_version_required_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_version_optional_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_news_v_version_gallery" CASCADE;
  DROP TABLE "_news_v_version_attachments" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_webinars_v_version_speakers" CASCADE;
  DROP TABLE "_webinars_v_version_gallery" CASCADE;
  DROP TABLE "_webinars_v_version_attachments" CASCADE;
  DROP TABLE "_webinars_v" CASCADE;
  DROP TABLE "_insights_v_version_authors" CASCADE;
  DROP TABLE "_insights_v_version_attachments" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "_glossary_v" CASCADE;
  DROP TABLE "_glossary_v_rels" CASCADE;
  DROP TABLE "_team_members_v_version_social_links" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_media_coverage_v" CASCADE;
  DROP TABLE "_jobs_v_version_sections_items" CASCADE;
  DROP TABLE "_jobs_v_version_sections" CASCADE;
  DROP TABLE "_jobs_v_version_attachments" CASCADE;
  DROP TABLE "_jobs_v_version_required_documents" CASCADE;
  DROP TABLE "_jobs_v_version_optional_documents" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP INDEX "news__status_idx";
  DROP INDEX "webinars__status_idx";
  DROP INDEX "insights__status_idx";
  DROP INDEX "glossary__status_idx";
  DROP INDEX "team_members__status_idx";
  DROP INDEX "faqs__status_idx";
  DROP INDEX "media_coverage__status_idx";
  DROP INDEX "jobs__status_idx";

  -- Drafts were exempt from validation, so a draft row may be missing values
  -- that are about to become NOT NULL. Backfill rather than delete: the rows are
  -- somebody's unfinished work, and a marker they can see and fix is better than
  -- a row that silently disappeared.
  UPDATE "jobs" SET "level" = '(not set)' WHERE "level" IS NULL;
  UPDATE "jobs" SET "closes_at" = '1970-01-01T00:00:00.000Z' WHERE "closes_at" IS NULL;

  -- The safety line. Removing the draft state would otherwise turn every
  -- unfinished vacancy into a live one the moment this migration lands. Closing
  -- them keeps them off the careers listing and refuses applications until HR
  -- opens them deliberately.
  UPDATE "jobs" SET "recruitment_status" = 'closed' WHERE "_status" = 'draft';
  ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "news_gallery" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "news_attachments" ALTER COLUMN "file_id" SET NOT NULL;
  ALTER TABLE "news_attachments" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "format" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "published_at" SET NOT NULL;
  ALTER TABLE "webinars_speakers" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "webinars_gallery" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "webinars_attachments" ALTER COLUMN "file_id" SET NOT NULL;
  ALTER TABLE "webinars_attachments" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "session_status" SET NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "starts_at" SET NOT NULL;
  ALTER TABLE "insights_authors" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "insights_attachments" ALTER COLUMN "file_id" SET NOT NULL;
  ALTER TABLE "insights_attachments" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "kind" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "published_at" SET NOT NULL;
  ALTER TABLE "glossary" ALTER COLUMN "term" SET NOT NULL;
  ALTER TABLE "glossary" ALTER COLUMN "definition" SET NOT NULL;
  ALTER TABLE "team_members_social_links" ALTER COLUMN "platform" SET NOT NULL;
  ALTER TABLE "team_members_social_links" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "tier" SET NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "order" SET NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "order" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "outlet" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "published_at" SET NOT NULL;
  ALTER TABLE "jobs_sections_items" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "jobs_sections" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "jobs_attachments" ALTER COLUMN "file_id" SET NOT NULL;
  ALTER TABLE "jobs_attachments" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "about" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "department" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "level" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "location" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "employment_type" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "slots" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "posted_at" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "recruitment_status" SET NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "closes_at" SET NOT NULL;
  ALTER TABLE "news" DROP COLUMN "_status";
  ALTER TABLE "webinars" DROP COLUMN "_status";
  ALTER TABLE "insights" DROP COLUMN "_status";
  ALTER TABLE "glossary" DROP COLUMN "_status";
  ALTER TABLE "team_members" DROP COLUMN "_status";
  ALTER TABLE "faqs" DROP COLUMN "_status";
  ALTER TABLE "media_coverage" DROP COLUMN "_status";
  ALTER TABLE "jobs" DROP COLUMN "_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_format";
  DROP TYPE "public"."enum__news_v_version_source_kind";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_webinars_status";
  DROP TYPE "public"."enum__webinars_v_version_session_status";
  DROP TYPE "public"."enum__webinars_v_version_status";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_glossary_status";
  DROP TYPE "public"."enum__glossary_v_version_status";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_social_links_platform";
  DROP TYPE "public"."enum__team_members_v_version_tier";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum__media_coverage_v_version_coverage_type";
  DROP TYPE "public"."enum__media_coverage_v_version_status";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_required_documents";
  DROP TYPE "public"."enum__jobs_v_version_optional_documents";
  DROP TYPE "public"."enum__jobs_v_version_employment_type";
  DROP TYPE "public"."enum__jobs_v_version_recruitment_status";
  DROP TYPE "public"."enum__jobs_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_format" AS ENUM('story', 'notice');
  CREATE TYPE "public"."enum__news_v_version_source_kind" AS ENUM('article', 'video');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_webinars_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__webinars_v_version_session_status" AS ENUM('upcoming', 'recorded');
  CREATE TYPE "public"."enum__webinars_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_glossary_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__glossary_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_social_links_platform" AS ENUM('linkedin', 'x', 'github', 'website');
  CREATE TYPE "public"."enum__team_members_v_version_tier" AS ENUM('leadership', 'team');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_version_coverage_type" AS ENUM('article', 'interview', 'broadcast', 'podcast', 'report');
  CREATE TYPE "public"."enum__media_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_required_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum__jobs_v_version_optional_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum__jobs_v_version_employment_type" AS ENUM('full-time', 'part-time', 'contract');
  CREATE TYPE "public"."enum__jobs_v_version_recruitment_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_news_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_format" "enum__news_v_version_format" DEFAULT 'story',
  	"version_title" varchar,
  	"version_headline" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_category_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_body" jsonb,
  	"version_byline" varchar,
  	"version_external_url" varchar,
  	"version_source_url" varchar,
  	"version_source_label" varchar DEFAULT 'Read the full release',
  	"version_source_kind" "enum__news_v_version_source_kind" DEFAULT 'article',
  	"version_featured" boolean DEFAULT false,
  	"version_popular_rank" numeric,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_webinars_v_version_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_webinars_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_webinars_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_webinars_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_session_status" "enum__webinars_v_version_session_status" DEFAULT 'upcoming',
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_category_id" integer,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_platform" varchar,
  	"version_registration_url" varchar,
  	"version_registration_label" varchar DEFAULT 'Register to attend',
  	"version_registration_note" varchar,
  	"version_recording_url" varchar,
  	"version_recording_duration_minutes" numeric,
  	"version_thumbnail_id" integer,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__webinars_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_insights_v_version_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"affiliation" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_insights_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_category_id" integer,
  	"version_kind" varchar DEFAULT 'Research paper',
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_document_id" integer,
  	"version_reading_minutes" numeric,
  	"version_canonical_url" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_glossary_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_term" varchar,
  	"version_slug" varchar,
  	"version_definition" jsonb,
  	"version_abbreviation" varchar,
  	"version_category_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__glossary_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_glossary_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"glossary_id" integer
  );
  
  CREATE TABLE "_team_members_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__team_members_v_version_social_links_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_tier" "enum__team_members_v_version_tier" DEFAULT 'team',
  	"version_photo_id" integer,
  	"version_photo_position" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_department" varchar,
  	"version_biography" varchar,
  	"version_email" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" jsonb,
  	"version_category_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_media_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_url" varchar,
  	"version_outlet" varchar,
  	"version_excerpt" varchar,
  	"version_category_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_coverage_type" "enum__media_coverage_v_version_coverage_type" DEFAULT 'article',
  	"version_language" varchar DEFAULT 'English',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_jobs_v_version_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_version_required_documents" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__jobs_v_version_required_documents",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_jobs_v_version_optional_documents" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__jobs_v_version_optional_documents",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_about" varchar,
  	"version_department" varchar,
  	"version_level" varchar,
  	"version_location" varchar DEFAULT 'Thimphu',
  	"version_employment_type" "enum__jobs_v_version_employment_type" DEFAULT 'full-time',
  	"version_slots" numeric DEFAULT 1,
  	"version_posted_at" timestamp(3) with time zone,
  	"version_tor_document_id" integer,
  	"version_recruitment_status" "enum__jobs_v_version_recruitment_status" DEFAULT 'open',
  	"version_closes_at" timestamp(3) with time zone,
  	"version_allow_resubmission" boolean DEFAULT true,
  	"version_application_instructions" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "news_gallery" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "news_attachments" ALTER COLUMN "file_id" DROP NOT NULL;
  ALTER TABLE "news_attachments" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "format" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "published_at" DROP NOT NULL;
  ALTER TABLE "webinars_speakers" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "webinars_gallery" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "webinars_attachments" ALTER COLUMN "file_id" DROP NOT NULL;
  ALTER TABLE "webinars_attachments" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "session_status" DROP NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "webinars" ALTER COLUMN "starts_at" DROP NOT NULL;
  ALTER TABLE "insights_authors" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "insights_attachments" ALTER COLUMN "file_id" DROP NOT NULL;
  ALTER TABLE "insights_attachments" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "kind" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "published_at" DROP NOT NULL;
  ALTER TABLE "glossary" ALTER COLUMN "term" DROP NOT NULL;
  ALTER TABLE "glossary" ALTER COLUMN "definition" DROP NOT NULL;
  ALTER TABLE "team_members_social_links" ALTER COLUMN "platform" DROP NOT NULL;
  ALTER TABLE "team_members_social_links" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "tier" DROP NOT NULL;
  ALTER TABLE "team_members" ALTER COLUMN "order" DROP NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "faqs" ALTER COLUMN "order" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "outlet" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "media_coverage" ALTER COLUMN "published_at" DROP NOT NULL;
  ALTER TABLE "jobs_sections_items" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "jobs_sections" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "jobs_attachments" ALTER COLUMN "file_id" DROP NOT NULL;
  ALTER TABLE "jobs_attachments" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "summary" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "about" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "department" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "level" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "location" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "employment_type" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "slots" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "posted_at" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "recruitment_status" DROP NOT NULL;
  ALTER TABLE "jobs" ALTER COLUMN "closes_at" DROP NOT NULL;
  ALTER TABLE "news" ADD COLUMN "_status" "enum_news_status" DEFAULT 'draft';
  ALTER TABLE "webinars" ADD COLUMN "_status" "enum_webinars_status" DEFAULT 'draft';
  ALTER TABLE "insights" ADD COLUMN "_status" "enum_insights_status" DEFAULT 'draft';
  ALTER TABLE "glossary" ADD COLUMN "_status" "enum_glossary_status" DEFAULT 'draft';
  ALTER TABLE "team_members" ADD COLUMN "_status" "enum_team_members_status" DEFAULT 'draft';
  ALTER TABLE "faqs" ADD COLUMN "_status" "enum_faqs_status" DEFAULT 'draft';
  ALTER TABLE "media_coverage" ADD COLUMN "_status" "enum_media_coverage_status" DEFAULT 'draft';
  ALTER TABLE "jobs" ADD COLUMN "_status" "enum_jobs_status" DEFAULT 'draft';
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_speakers" ADD CONSTRAINT "_webinars_v_version_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_speakers" ADD CONSTRAINT "_webinars_v_version_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_webinars_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_gallery" ADD CONSTRAINT "_webinars_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_gallery" ADD CONSTRAINT "_webinars_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_webinars_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_attachments" ADD CONSTRAINT "_webinars_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_attachments" ADD CONSTRAINT "_webinars_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_webinars_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_parent_id_webinars_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."webinars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_version_authors" ADD CONSTRAINT "_insights_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_version_attachments" ADD CONSTRAINT "_insights_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_version_attachments" ADD CONSTRAINT "_insights_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_parent_id_glossary_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_glossary_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v_version_social_links" ADD CONSTRAINT "_team_members_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_parent_id_media_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_sections_items" ADD CONSTRAINT "_jobs_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_sections" ADD CONSTRAINT "_jobs_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_attachments" ADD CONSTRAINT "_jobs_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_attachments" ADD CONSTRAINT "_jobs_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_required_documents" ADD CONSTRAINT "_jobs_v_version_required_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_optional_documents" ADD CONSTRAINT "_jobs_v_version_optional_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_tor_document_id_media_id_fk" FOREIGN KEY ("version_tor_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_news_v_version_gallery_order_idx" ON "_news_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_news_v_version_gallery_parent_id_idx" ON "_news_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_gallery_image_idx" ON "_news_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_news_v_version_attachments_order_idx" ON "_news_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_news_v_version_attachments_parent_id_idx" ON "_news_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_attachments_file_idx" ON "_news_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_format_idx" ON "_news_v" USING btree ("version_format");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_category_idx" ON "_news_v" USING btree ("version_category_id");
  CREATE INDEX "_news_v_version_version_published_at_idx" ON "_news_v" USING btree ("version_published_at");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_featured_idx" ON "_news_v" USING btree ("version_featured");
  CREATE INDEX "_news_v_version_version_popular_rank_idx" ON "_news_v" USING btree ("version_popular_rank");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_webinars_v_version_speakers_order_idx" ON "_webinars_v_version_speakers" USING btree ("_order");
  CREATE INDEX "_webinars_v_version_speakers_parent_id_idx" ON "_webinars_v_version_speakers" USING btree ("_parent_id");
  CREATE INDEX "_webinars_v_version_speakers_photo_idx" ON "_webinars_v_version_speakers" USING btree ("photo_id");
  CREATE INDEX "_webinars_v_version_gallery_order_idx" ON "_webinars_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_webinars_v_version_gallery_parent_id_idx" ON "_webinars_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_webinars_v_version_gallery_image_idx" ON "_webinars_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_webinars_v_version_attachments_order_idx" ON "_webinars_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_webinars_v_version_attachments_parent_id_idx" ON "_webinars_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_webinars_v_version_attachments_file_idx" ON "_webinars_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_webinars_v_parent_idx" ON "_webinars_v" USING btree ("parent_id");
  CREATE INDEX "_webinars_v_version_version_session_status_idx" ON "_webinars_v" USING btree ("version_session_status");
  CREATE INDEX "_webinars_v_version_version_slug_idx" ON "_webinars_v" USING btree ("version_slug");
  CREATE INDEX "_webinars_v_version_version_category_idx" ON "_webinars_v" USING btree ("version_category_id");
  CREATE INDEX "_webinars_v_version_version_starts_at_idx" ON "_webinars_v" USING btree ("version_starts_at");
  CREATE INDEX "_webinars_v_version_version_thumbnail_idx" ON "_webinars_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_webinars_v_version_meta_version_meta_image_idx" ON "_webinars_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_webinars_v_version_version_updated_at_idx" ON "_webinars_v" USING btree ("version_updated_at");
  CREATE INDEX "_webinars_v_version_version_created_at_idx" ON "_webinars_v" USING btree ("version_created_at");
  CREATE INDEX "_webinars_v_version_version__status_idx" ON "_webinars_v" USING btree ("version__status");
  CREATE INDEX "_webinars_v_created_at_idx" ON "_webinars_v" USING btree ("created_at");
  CREATE INDEX "_webinars_v_updated_at_idx" ON "_webinars_v" USING btree ("updated_at");
  CREATE INDEX "_webinars_v_latest_idx" ON "_webinars_v" USING btree ("latest");
  CREATE INDEX "_insights_v_version_authors_order_idx" ON "_insights_v_version_authors" USING btree ("_order");
  CREATE INDEX "_insights_v_version_authors_parent_id_idx" ON "_insights_v_version_authors" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_version_attachments_order_idx" ON "_insights_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_insights_v_version_attachments_parent_id_idx" ON "_insights_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_version_attachments_file_idx" ON "_insights_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_category_idx" ON "_insights_v" USING btree ("version_category_id");
  CREATE INDEX "_insights_v_version_version_published_at_idx" ON "_insights_v" USING btree ("version_published_at");
  CREATE INDEX "_insights_v_version_version_image_idx" ON "_insights_v" USING btree ("version_image_id");
  CREATE INDEX "_insights_v_version_version_document_idx" ON "_insights_v" USING btree ("version_document_id");
  CREATE INDEX "_insights_v_version_meta_version_meta_image_idx" ON "_insights_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE INDEX "_glossary_v_parent_idx" ON "_glossary_v" USING btree ("parent_id");
  CREATE INDEX "_glossary_v_version_version_term_idx" ON "_glossary_v" USING btree ("version_term");
  CREATE INDEX "_glossary_v_version_version_slug_idx" ON "_glossary_v" USING btree ("version_slug");
  CREATE INDEX "_glossary_v_version_version_category_idx" ON "_glossary_v" USING btree ("version_category_id");
  CREATE INDEX "_glossary_v_version_version_updated_at_idx" ON "_glossary_v" USING btree ("version_updated_at");
  CREATE INDEX "_glossary_v_version_version_created_at_idx" ON "_glossary_v" USING btree ("version_created_at");
  CREATE INDEX "_glossary_v_version_version__status_idx" ON "_glossary_v" USING btree ("version__status");
  CREATE INDEX "_glossary_v_created_at_idx" ON "_glossary_v" USING btree ("created_at");
  CREATE INDEX "_glossary_v_updated_at_idx" ON "_glossary_v" USING btree ("updated_at");
  CREATE INDEX "_glossary_v_latest_idx" ON "_glossary_v" USING btree ("latest");
  CREATE INDEX "_glossary_v_rels_order_idx" ON "_glossary_v_rels" USING btree ("order");
  CREATE INDEX "_glossary_v_rels_parent_idx" ON "_glossary_v_rels" USING btree ("parent_id");
  CREATE INDEX "_glossary_v_rels_path_idx" ON "_glossary_v_rels" USING btree ("path");
  CREATE INDEX "_glossary_v_rels_glossary_id_idx" ON "_glossary_v_rels" USING btree ("glossary_id");
  CREATE INDEX "_team_members_v_version_social_links_order_idx" ON "_team_members_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_team_members_v_version_social_links_parent_id_idx" ON "_team_members_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_tier_idx" ON "_team_members_v" USING btree ("version_tier");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_category_idx" ON "_faqs_v" USING btree ("version_category_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_media_coverage_v_parent_idx" ON "_media_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_media_coverage_v_version_version_slug_idx" ON "_media_coverage_v" USING btree ("version_slug");
  CREATE INDEX "_media_coverage_v_version_version_outlet_idx" ON "_media_coverage_v" USING btree ("version_outlet");
  CREATE INDEX "_media_coverage_v_version_version_category_idx" ON "_media_coverage_v" USING btree ("version_category_id");
  CREATE INDEX "_media_coverage_v_version_version_published_at_idx" ON "_media_coverage_v" USING btree ("version_published_at");
  CREATE INDEX "_media_coverage_v_version_version_image_idx" ON "_media_coverage_v" USING btree ("version_image_id");
  CREATE INDEX "_media_coverage_v_version_version_updated_at_idx" ON "_media_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_coverage_v_version_version_created_at_idx" ON "_media_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_media_coverage_v_version_version__status_idx" ON "_media_coverage_v" USING btree ("version__status");
  CREATE INDEX "_media_coverage_v_created_at_idx" ON "_media_coverage_v" USING btree ("created_at");
  CREATE INDEX "_media_coverage_v_updated_at_idx" ON "_media_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_media_coverage_v_latest_idx" ON "_media_coverage_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_version_sections_items_order_idx" ON "_jobs_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_sections_items_parent_id_idx" ON "_jobs_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_version_sections_order_idx" ON "_jobs_v_version_sections" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_sections_parent_id_idx" ON "_jobs_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_version_attachments_order_idx" ON "_jobs_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_attachments_parent_id_idx" ON "_jobs_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_version_attachments_file_idx" ON "_jobs_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_jobs_v_version_required_documents_order_idx" ON "_jobs_v_version_required_documents" USING btree ("order");
  CREATE INDEX "_jobs_v_version_required_documents_parent_idx" ON "_jobs_v_version_required_documents" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_optional_documents_order_idx" ON "_jobs_v_version_optional_documents" USING btree ("order");
  CREATE INDEX "_jobs_v_version_optional_documents_parent_idx" ON "_jobs_v_version_optional_documents" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_department_idx" ON "_jobs_v" USING btree ("version_department");
  CREATE INDEX "_jobs_v_version_version_posted_at_idx" ON "_jobs_v" USING btree ("version_posted_at");
  CREATE INDEX "_jobs_v_version_version_tor_document_idx" ON "_jobs_v" USING btree ("version_tor_document_id");
  CREATE INDEX "_jobs_v_version_version_recruitment_status_idx" ON "_jobs_v" USING btree ("version_recruitment_status");
  CREATE INDEX "_jobs_v_version_version_closes_at_idx" ON "_jobs_v" USING btree ("version_closes_at");
  CREATE INDEX "_jobs_v_version_meta_version_meta_image_idx" ON "_jobs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "webinars__status_idx" ON "webinars" USING btree ("_status");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "glossary__status_idx" ON "glossary" USING btree ("_status");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "media_coverage__status_idx" ON "media_coverage" USING btree ("_status");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");`)
}
