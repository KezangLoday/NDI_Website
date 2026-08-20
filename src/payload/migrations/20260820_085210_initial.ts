import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_categories_taxonomy" AS ENUM('news', 'webinar', 'insight', 'faq', 'media-coverage', 'glossary');
  CREATE TYPE "public"."enum_news_format" AS ENUM('story', 'notice');
  CREATE TYPE "public"."enum_news_source_kind" AS ENUM('article', 'video');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_format" AS ENUM('story', 'notice');
  CREATE TYPE "public"."enum__news_v_version_source_kind" AS ENUM('article', 'video');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_webinars_session_status" AS ENUM('upcoming', 'recorded');
  CREATE TYPE "public"."enum_webinars_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__webinars_v_version_session_status" AS ENUM('upcoming', 'recorded');
  CREATE TYPE "public"."enum__webinars_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_glossary_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__glossary_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_social_links_platform" AS ENUM('linkedin', 'x', 'github', 'website');
  CREATE TYPE "public"."enum_team_members_tier" AS ENUM('leadership', 'team');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_social_links_platform" AS ENUM('linkedin', 'x', 'github', 'website');
  CREATE TYPE "public"."enum__team_members_v_version_tier" AS ENUM('leadership', 'team');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_coverage_coverage_type" AS ENUM('article', 'interview', 'broadcast', 'podcast', 'report');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_version_coverage_type" AS ENUM('article', 'interview', 'broadcast', 'podcast', 'report');
  CREATE TYPE "public"."enum__media_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_required_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum_jobs_optional_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum_jobs_employment_type" AS ENUM('full-time', 'part-time', 'contract');
  CREATE TYPE "public"."enum_jobs_recruitment_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_required_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum__jobs_v_version_optional_documents" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum__jobs_v_version_employment_type" AS ENUM('full-time', 'part-time', 'contract');
  CREATE TYPE "public"."enum__jobs_v_version_recruitment_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_job_applications_documents_kind" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('submitted', 'under-review', 'shortlisted', 'interview-scheduled', 'interviewed', 'assessment', 'reference-check', 'selected', 'offer-sent', 'hired', 'rejected', 'withdrawn');
  CREATE TYPE "public"."enum_job_applications_education_highest_level" AS ENUM('class-10', 'class-12', 'diploma', 'bachelors', 'masters', 'doctorate');
  CREATE TYPE "public"."enum_job_applications_interview_mode" AS ENUM('in-person', 'video', 'phone');
  CREATE TYPE "public"."enum_applicant_documents_kind" AS ENUM('cv', 'cover-letter', 'class-10', 'class-12', 'higher-education', 'experience', 'other-education', 'other');
  CREATE TYPE "public"."enum_audit_log_action" AS ENUM('application.submitted', 'application.status-changed', 'application.assigned', 'application.note-added', 'application.updated', 'application.deleted', 'job.closed', 'job.reopened');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('superadmin', 'hr', 'pr');
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"optimization_strategy" varchar,
  	"optimization_original_bytes" numeric,
  	"optimization_optimized_bytes" numeric,
  	"optimization_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_content_url" varchar,
  	"sizes_content_width" numeric,
  	"sizes_content_height" numeric,
  	"sizes_content_mime_type" varchar,
  	"sizes_content_filesize" numeric,
  	"sizes_content_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"taxonomy" "enum_categories_taxonomy" NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "news_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" "enum_news_format" DEFAULT 'story',
  	"title" varchar,
  	"headline" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"category_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"body" jsonb,
  	"byline" varchar,
  	"external_url" varchar,
  	"source_url" varchar,
  	"source_label" varchar DEFAULT 'Read the full release',
  	"source_kind" "enum_news_source_kind" DEFAULT 'article',
  	"featured" boolean DEFAULT false,
  	"popular_rank" numeric,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
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
  
  CREATE TABLE "webinars_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "webinars_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "webinars_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "webinars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_status" "enum_webinars_session_status" DEFAULT 'upcoming',
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"category_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"platform" varchar,
  	"registration_url" varchar,
  	"registration_label" varchar DEFAULT 'Register to attend',
  	"registration_note" varchar,
  	"recording_url" varchar,
  	"recording_duration_minutes" numeric,
  	"thumbnail_id" integer,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_webinars_status" DEFAULT 'draft'
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
  
  CREATE TABLE "insights_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"affiliation" varchar
  );
  
  CREATE TABLE "insights_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"category_id" integer,
  	"kind" varchar DEFAULT 'Research paper',
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"document_id" integer,
  	"reading_minutes" numeric,
  	"canonical_url" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_insights_status" DEFAULT 'draft'
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
  
  CREATE TABLE "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"slug" varchar,
  	"definition" jsonb,
  	"abbreviation" varchar,
  	"category_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_glossary_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "glossary_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"glossary_id" integer
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
  
  CREATE TABLE "team_members_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_team_members_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"tier" "enum_team_members_tier" DEFAULT 'team',
  	"photo_id" integer,
  	"photo_position" varchar,
  	"order" numeric DEFAULT 0,
  	"department" varchar,
  	"biography" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
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
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
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
  
  CREATE TABLE "media_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"url" varchar,
  	"outlet" varchar,
  	"excerpt" varchar,
  	"category_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"coverage_type" "enum_media_coverage_coverage_type" DEFAULT 'article',
  	"language" varchar DEFAULT 'English',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_coverage_status" DEFAULT 'draft'
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
  
  CREATE TABLE "jobs_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "jobs_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "jobs_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "jobs_required_documents" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_jobs_required_documents",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "jobs_optional_documents" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_jobs_optional_documents",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"about" varchar,
  	"department" varchar,
  	"level" varchar,
  	"location" varchar DEFAULT 'Thimphu',
  	"employment_type" "enum_jobs_employment_type" DEFAULT 'full-time',
  	"slots" numeric DEFAULT 1,
  	"posted_at" timestamp(3) with time zone,
  	"tor_document_id" integer,
  	"recruitment_status" "enum_jobs_recruitment_status" DEFAULT 'open',
  	"closes_at" timestamp(3) with time zone,
  	"allow_resubmission" boolean DEFAULT true,
  	"application_instructions" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_no_index" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_jobs_status" DEFAULT 'draft'
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
  
  CREATE TABLE "job_applications_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_job_applications_documents_kind" NOT NULL,
  	"document_id" integer NOT NULL
  );
  
  CREATE TABLE "job_applications_internal_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document_id" integer NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "job_applications_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"changed_by_id" integer,
  	"note" varchar
  );
  
  CREATE TABLE "job_applications_internal_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"author_id" integer,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"status" "enum_job_applications_status" DEFAULT 'submitted' NOT NULL,
  	"assigned_to_id" integer,
  	"job_id" integer NOT NULL,
  	"job_title_snapshot" varchar,
  	"applicant_name" varchar NOT NULL,
  	"applicant_full_name" varchar NOT NULL,
  	"applicant_email" varchar NOT NULL,
  	"applicant_phone" varchar NOT NULL,
  	"applicant_citizenship_id" varchar,
  	"applicant_location" varchar NOT NULL,
  	"applicant_address" varchar,
  	"applicant_date_of_birth" timestamp(3) with time zone,
  	"applicant_nationality" varchar,
  	"education_highest_level" "enum_job_applications_education_highest_level",
  	"education_graduation_year" numeric,
  	"education_qualification" varchar,
  	"education_class_x_percent" numeric,
  	"education_class_x_i_i_percent" numeric,
  	"education_degree_percent" numeric,
  	"experience_years" numeric,
  	"experience_current_employer" varchar,
  	"experience_portfolio_url" varchar,
  	"experience_statement" varchar,
  	"status_change_note" varchar,
  	"interview_scheduled_at" timestamp(3) with time zone,
  	"interview_mode" "enum_job_applications_interview_mode",
  	"interview_panel" varchar,
  	"interview_notes" varchar,
  	"assessment_score" numeric,
  	"assessment_notes" varchar,
  	"reference_check_completed" boolean DEFAULT false,
  	"reference_check_notes" varchar,
  	"rejection_reason" varchar,
  	"duplicate_of_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"consent_given" boolean DEFAULT false,
  	"consent_at" timestamp(3) with time zone,
  	"consent_statement" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "applicant_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_applicant_documents_kind" NOT NULL,
  	"original_filename" varchar,
  	"optimization_strategy" varchar,
  	"optimization_original_bytes" numeric,
  	"optimization_optimized_bytes" numeric,
  	"optimization_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"occurred_at" timestamp(3) with time zone NOT NULL,
  	"action" "enum_audit_log_action" NOT NULL,
  	"summary" varchar NOT NULL,
  	"actor_id" integer,
  	"collection_slug" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"reference" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"job_title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"categories_id" integer,
  	"news_id" integer,
  	"webinars_id" integer,
  	"insights_id" integer,
  	"glossary_id" integer,
  	"team_members_id" integer,
  	"faqs_id" integer,
  	"media_coverage_id" integer,
  	"jobs_id" integer,
  	"job_applications_id" integer,
  	"applicant_documents_id" integer,
  	"audit_log_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "upcoming_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fallback" boolean DEFAULT true,
  	"empty_state_note" varchar DEFAULT 'There is no session scheduled at the moment. Recordings of past sessions are below, and the next one will be announced here.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "upcoming_events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"webinars_id" integer
  );
  
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_attachments" ADD CONSTRAINT "news_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_attachments" ADD CONSTRAINT "news_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars_speakers" ADD CONSTRAINT "webinars_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars_speakers" ADD CONSTRAINT "webinars_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "webinars_gallery" ADD CONSTRAINT "webinars_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars_gallery" ADD CONSTRAINT "webinars_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "webinars_attachments" ADD CONSTRAINT "webinars_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars_attachments" ADD CONSTRAINT "webinars_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "webinars" ADD CONSTRAINT "webinars_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars" ADD CONSTRAINT "webinars_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars" ADD CONSTRAINT "webinars_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "insights_authors" ADD CONSTRAINT "insights_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_attachments" ADD CONSTRAINT "insights_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights_attachments" ADD CONSTRAINT "insights_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_version_authors" ADD CONSTRAINT "_insights_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_version_attachments" ADD CONSTRAINT "_insights_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_version_attachments" ADD CONSTRAINT "_insights_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "glossary" ADD CONSTRAINT "glossary_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_parent_id_glossary_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_glossary_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_social_links" ADD CONSTRAINT "team_members_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v_version_social_links" ADD CONSTRAINT "_team_members_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_parent_id_media_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_sections_items" ADD CONSTRAINT "jobs_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_sections" ADD CONSTRAINT "jobs_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_attachments" ADD CONSTRAINT "jobs_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_attachments" ADD CONSTRAINT "jobs_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_required_documents" ADD CONSTRAINT "jobs_required_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_optional_documents" ADD CONSTRAINT "jobs_optional_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tor_document_id_media_id_fk" FOREIGN KEY ("tor_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_sections_items" ADD CONSTRAINT "_jobs_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_sections" ADD CONSTRAINT "_jobs_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_attachments" ADD CONSTRAINT "_jobs_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_attachments" ADD CONSTRAINT "_jobs_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_required_documents" ADD CONSTRAINT "_jobs_v_version_required_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_optional_documents" ADD CONSTRAINT "_jobs_v_version_optional_documents_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_tor_document_id_media_id_fk" FOREIGN KEY ("version_tor_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications_documents" ADD CONSTRAINT "job_applications_documents_document_id_applicant_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."applicant_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications_documents" ADD CONSTRAINT "job_applications_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications_internal_documents" ADD CONSTRAINT "job_applications_internal_documents_document_id_applicant_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."applicant_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications_internal_documents" ADD CONSTRAINT "job_applications_internal_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications_status_history" ADD CONSTRAINT "job_applications_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications_status_history" ADD CONSTRAINT "job_applications_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications_internal_notes" ADD CONSTRAINT "job_applications_internal_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications_internal_notes" ADD CONSTRAINT "job_applications_internal_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_duplicate_of_id_job_applications_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webinars_fk" FOREIGN KEY ("webinars_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_coverage_fk" FOREIGN KEY ("media_coverage_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applicant_documents_fk" FOREIGN KEY ("applicant_documents_id") REFERENCES "public"."applicant_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "upcoming_events_rels" ADD CONSTRAINT "upcoming_events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."upcoming_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "upcoming_events_rels" ADD CONSTRAINT "upcoming_events_rels_webinars_fk" FOREIGN KEY ("webinars_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_content_sizes_content_filename_idx" ON "media" USING btree ("sizes_content_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE INDEX "categories_taxonomy_idx" ON "categories" USING btree ("taxonomy");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "taxonomy_slug_idx" ON "categories" USING btree ("taxonomy","slug");
  CREATE INDEX "news_gallery_order_idx" ON "news_gallery" USING btree ("_order");
  CREATE INDEX "news_gallery_parent_id_idx" ON "news_gallery" USING btree ("_parent_id");
  CREATE INDEX "news_gallery_image_idx" ON "news_gallery" USING btree ("image_id");
  CREATE INDEX "news_attachments_order_idx" ON "news_attachments" USING btree ("_order");
  CREATE INDEX "news_attachments_parent_id_idx" ON "news_attachments" USING btree ("_parent_id");
  CREATE INDEX "news_attachments_file_idx" ON "news_attachments" USING btree ("file_id");
  CREATE INDEX "news_format_idx" ON "news" USING btree ("format");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_category_idx" ON "news" USING btree ("category_id");
  CREATE INDEX "news_published_at_idx" ON "news" USING btree ("published_at");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_featured_idx" ON "news" USING btree ("featured");
  CREATE INDEX "news_popular_rank_idx" ON "news" USING btree ("popular_rank");
  CREATE INDEX "news_meta_meta_image_idx" ON "news" USING btree ("meta_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
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
  CREATE INDEX "webinars_speakers_order_idx" ON "webinars_speakers" USING btree ("_order");
  CREATE INDEX "webinars_speakers_parent_id_idx" ON "webinars_speakers" USING btree ("_parent_id");
  CREATE INDEX "webinars_speakers_photo_idx" ON "webinars_speakers" USING btree ("photo_id");
  CREATE INDEX "webinars_gallery_order_idx" ON "webinars_gallery" USING btree ("_order");
  CREATE INDEX "webinars_gallery_parent_id_idx" ON "webinars_gallery" USING btree ("_parent_id");
  CREATE INDEX "webinars_gallery_image_idx" ON "webinars_gallery" USING btree ("image_id");
  CREATE INDEX "webinars_attachments_order_idx" ON "webinars_attachments" USING btree ("_order");
  CREATE INDEX "webinars_attachments_parent_id_idx" ON "webinars_attachments" USING btree ("_parent_id");
  CREATE INDEX "webinars_attachments_file_idx" ON "webinars_attachments" USING btree ("file_id");
  CREATE INDEX "webinars_session_status_idx" ON "webinars" USING btree ("session_status");
  CREATE UNIQUE INDEX "webinars_slug_idx" ON "webinars" USING btree ("slug");
  CREATE INDEX "webinars_category_idx" ON "webinars" USING btree ("category_id");
  CREATE INDEX "webinars_starts_at_idx" ON "webinars" USING btree ("starts_at");
  CREATE INDEX "webinars_thumbnail_idx" ON "webinars" USING btree ("thumbnail_id");
  CREATE INDEX "webinars_meta_meta_image_idx" ON "webinars" USING btree ("meta_image_id");
  CREATE INDEX "webinars_updated_at_idx" ON "webinars" USING btree ("updated_at");
  CREATE INDEX "webinars_created_at_idx" ON "webinars" USING btree ("created_at");
  CREATE INDEX "webinars__status_idx" ON "webinars" USING btree ("_status");
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
  CREATE INDEX "insights_authors_order_idx" ON "insights_authors" USING btree ("_order");
  CREATE INDEX "insights_authors_parent_id_idx" ON "insights_authors" USING btree ("_parent_id");
  CREATE INDEX "insights_attachments_order_idx" ON "insights_attachments" USING btree ("_order");
  CREATE INDEX "insights_attachments_parent_id_idx" ON "insights_attachments" USING btree ("_parent_id");
  CREATE INDEX "insights_attachments_file_idx" ON "insights_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_category_idx" ON "insights" USING btree ("category_id");
  CREATE INDEX "insights_published_at_idx" ON "insights" USING btree ("published_at");
  CREATE INDEX "insights_image_idx" ON "insights" USING btree ("image_id");
  CREATE INDEX "insights_document_idx" ON "insights" USING btree ("document_id");
  CREATE INDEX "insights_meta_meta_image_idx" ON "insights" USING btree ("meta_image_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
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
  CREATE INDEX "glossary_term_idx" ON "glossary" USING btree ("term");
  CREATE UNIQUE INDEX "glossary_slug_idx" ON "glossary" USING btree ("slug");
  CREATE INDEX "glossary_category_idx" ON "glossary" USING btree ("category_id");
  CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE INDEX "glossary__status_idx" ON "glossary" USING btree ("_status");
  CREATE INDEX "glossary_rels_order_idx" ON "glossary_rels" USING btree ("order");
  CREATE INDEX "glossary_rels_parent_idx" ON "glossary_rels" USING btree ("parent_id");
  CREATE INDEX "glossary_rels_path_idx" ON "glossary_rels" USING btree ("path");
  CREATE INDEX "glossary_rels_glossary_id_idx" ON "glossary_rels" USING btree ("glossary_id");
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
  CREATE INDEX "team_members_social_links_order_idx" ON "team_members_social_links" USING btree ("_order");
  CREATE INDEX "team_members_social_links_parent_id_idx" ON "team_members_social_links" USING btree ("_parent_id");
  CREATE INDEX "team_members_tier_idx" ON "team_members" USING btree ("tier");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
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
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_category_idx" ON "_faqs_v" USING btree ("version_category_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "media_coverage_slug_idx" ON "media_coverage" USING btree ("slug");
  CREATE INDEX "media_coverage_outlet_idx" ON "media_coverage" USING btree ("outlet");
  CREATE INDEX "media_coverage_category_idx" ON "media_coverage" USING btree ("category_id");
  CREATE INDEX "media_coverage_published_at_idx" ON "media_coverage" USING btree ("published_at");
  CREATE INDEX "media_coverage_image_idx" ON "media_coverage" USING btree ("image_id");
  CREATE INDEX "media_coverage_updated_at_idx" ON "media_coverage" USING btree ("updated_at");
  CREATE INDEX "media_coverage_created_at_idx" ON "media_coverage" USING btree ("created_at");
  CREATE INDEX "media_coverage__status_idx" ON "media_coverage" USING btree ("_status");
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
  CREATE INDEX "jobs_sections_items_order_idx" ON "jobs_sections_items" USING btree ("_order");
  CREATE INDEX "jobs_sections_items_parent_id_idx" ON "jobs_sections_items" USING btree ("_parent_id");
  CREATE INDEX "jobs_sections_order_idx" ON "jobs_sections" USING btree ("_order");
  CREATE INDEX "jobs_sections_parent_id_idx" ON "jobs_sections" USING btree ("_parent_id");
  CREATE INDEX "jobs_attachments_order_idx" ON "jobs_attachments" USING btree ("_order");
  CREATE INDEX "jobs_attachments_parent_id_idx" ON "jobs_attachments" USING btree ("_parent_id");
  CREATE INDEX "jobs_attachments_file_idx" ON "jobs_attachments" USING btree ("file_id");
  CREATE INDEX "jobs_required_documents_order_idx" ON "jobs_required_documents" USING btree ("order");
  CREATE INDEX "jobs_required_documents_parent_idx" ON "jobs_required_documents" USING btree ("parent_id");
  CREATE INDEX "jobs_optional_documents_order_idx" ON "jobs_optional_documents" USING btree ("order");
  CREATE INDEX "jobs_optional_documents_parent_idx" ON "jobs_optional_documents" USING btree ("parent_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_department_idx" ON "jobs" USING btree ("department");
  CREATE INDEX "jobs_posted_at_idx" ON "jobs" USING btree ("posted_at");
  CREATE INDEX "jobs_tor_document_idx" ON "jobs" USING btree ("tor_document_id");
  CREATE INDEX "jobs_recruitment_status_idx" ON "jobs" USING btree ("recruitment_status");
  CREATE INDEX "jobs_closes_at_idx" ON "jobs" USING btree ("closes_at");
  CREATE INDEX "jobs_meta_meta_image_idx" ON "jobs" USING btree ("meta_image_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
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
  CREATE INDEX "job_applications_documents_order_idx" ON "job_applications_documents" USING btree ("_order");
  CREATE INDEX "job_applications_documents_parent_id_idx" ON "job_applications_documents" USING btree ("_parent_id");
  CREATE INDEX "job_applications_documents_document_idx" ON "job_applications_documents" USING btree ("document_id");
  CREATE INDEX "job_applications_internal_documents_order_idx" ON "job_applications_internal_documents" USING btree ("_order");
  CREATE INDEX "job_applications_internal_documents_parent_id_idx" ON "job_applications_internal_documents" USING btree ("_parent_id");
  CREATE INDEX "job_applications_internal_documents_document_idx" ON "job_applications_internal_documents" USING btree ("document_id");
  CREATE INDEX "job_applications_status_history_order_idx" ON "job_applications_status_history" USING btree ("_order");
  CREATE INDEX "job_applications_status_history_parent_id_idx" ON "job_applications_status_history" USING btree ("_parent_id");
  CREATE INDEX "job_applications_status_history_changed_by_idx" ON "job_applications_status_history" USING btree ("changed_by_id");
  CREATE INDEX "job_applications_internal_notes_order_idx" ON "job_applications_internal_notes" USING btree ("_order");
  CREATE INDEX "job_applications_internal_notes_parent_id_idx" ON "job_applications_internal_notes" USING btree ("_parent_id");
  CREATE INDEX "job_applications_internal_notes_author_idx" ON "job_applications_internal_notes" USING btree ("author_id");
  CREATE UNIQUE INDEX "job_applications_reference_idx" ON "job_applications" USING btree ("reference");
  CREATE INDEX "job_applications_status_idx" ON "job_applications" USING btree ("status");
  CREATE INDEX "job_applications_assigned_to_idx" ON "job_applications" USING btree ("assigned_to_id");
  CREATE INDEX "job_applications_job_idx" ON "job_applications" USING btree ("job_id");
  CREATE INDEX "job_applications_applicant_name_idx" ON "job_applications" USING btree ("applicant_name");
  CREATE INDEX "job_applications_duplicate_of_idx" ON "job_applications" USING btree ("duplicate_of_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "job_status_idx" ON "job_applications" USING btree ("job_id","status");
  CREATE INDEX "applicant_documents_kind_idx" ON "applicant_documents" USING btree ("kind");
  CREATE INDEX "applicant_documents_updated_at_idx" ON "applicant_documents" USING btree ("updated_at");
  CREATE INDEX "applicant_documents_created_at_idx" ON "applicant_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "applicant_documents_filename_idx" ON "applicant_documents" USING btree ("filename");
  CREATE INDEX "audit_log_occurred_at_idx" ON "audit_log" USING btree ("occurred_at");
  CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");
  CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");
  CREATE INDEX "audit_log_collection_slug_idx" ON "audit_log" USING btree ("collection_slug");
  CREATE INDEX "audit_log_document_id_idx" ON "audit_log" USING btree ("document_id");
  CREATE INDEX "audit_log_reference_idx" ON "audit_log" USING btree ("reference");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_roles_value_idx" ON "users_roles" USING btree ("value");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_webinars_id_idx" ON "payload_locked_documents_rels" USING btree ("webinars_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("media_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_applicant_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("applicant_documents_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "upcoming_events_rels_order_idx" ON "upcoming_events_rels" USING btree ("order");
  CREATE INDEX "upcoming_events_rels_parent_idx" ON "upcoming_events_rels" USING btree ("parent_id");
  CREATE INDEX "upcoming_events_rels_path_idx" ON "upcoming_events_rels" USING btree ("path");
  CREATE INDEX "upcoming_events_rels_webinars_id_idx" ON "upcoming_events_rels" USING btree ("webinars_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "news_gallery" CASCADE;
  DROP TABLE "news_attachments" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v_version_gallery" CASCADE;
  DROP TABLE "_news_v_version_attachments" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "webinars_speakers" CASCADE;
  DROP TABLE "webinars_gallery" CASCADE;
  DROP TABLE "webinars_attachments" CASCADE;
  DROP TABLE "webinars" CASCADE;
  DROP TABLE "_webinars_v_version_speakers" CASCADE;
  DROP TABLE "_webinars_v_version_gallery" CASCADE;
  DROP TABLE "_webinars_v_version_attachments" CASCADE;
  DROP TABLE "_webinars_v" CASCADE;
  DROP TABLE "insights_authors" CASCADE;
  DROP TABLE "insights_attachments" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v_version_authors" CASCADE;
  DROP TABLE "_insights_v_version_attachments" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "glossary_rels" CASCADE;
  DROP TABLE "_glossary_v" CASCADE;
  DROP TABLE "_glossary_v_rels" CASCADE;
  DROP TABLE "team_members_social_links" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v_version_social_links" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "media_coverage" CASCADE;
  DROP TABLE "_media_coverage_v" CASCADE;
  DROP TABLE "jobs_sections_items" CASCADE;
  DROP TABLE "jobs_sections" CASCADE;
  DROP TABLE "jobs_attachments" CASCADE;
  DROP TABLE "jobs_required_documents" CASCADE;
  DROP TABLE "jobs_optional_documents" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "_jobs_v_version_sections_items" CASCADE;
  DROP TABLE "_jobs_v_version_sections" CASCADE;
  DROP TABLE "_jobs_v_version_attachments" CASCADE;
  DROP TABLE "_jobs_v_version_required_documents" CASCADE;
  DROP TABLE "_jobs_v_version_optional_documents" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "job_applications_documents" CASCADE;
  DROP TABLE "job_applications_internal_documents" CASCADE;
  DROP TABLE "job_applications_status_history" CASCADE;
  DROP TABLE "job_applications_internal_notes" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "applicant_documents" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "upcoming_events" CASCADE;
  DROP TABLE "upcoming_events_rels" CASCADE;
  DROP TYPE "public"."enum_categories_taxonomy";
  DROP TYPE "public"."enum_news_format";
  DROP TYPE "public"."enum_news_source_kind";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_format";
  DROP TYPE "public"."enum__news_v_version_source_kind";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_webinars_session_status";
  DROP TYPE "public"."enum_webinars_status";
  DROP TYPE "public"."enum__webinars_v_version_session_status";
  DROP TYPE "public"."enum__webinars_v_version_status";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_glossary_status";
  DROP TYPE "public"."enum__glossary_v_version_status";
  DROP TYPE "public"."enum_team_members_social_links_platform";
  DROP TYPE "public"."enum_team_members_tier";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_social_links_platform";
  DROP TYPE "public"."enum__team_members_v_version_tier";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum_media_coverage_coverage_type";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum__media_coverage_v_version_coverage_type";
  DROP TYPE "public"."enum__media_coverage_v_version_status";
  DROP TYPE "public"."enum_jobs_required_documents";
  DROP TYPE "public"."enum_jobs_optional_documents";
  DROP TYPE "public"."enum_jobs_employment_type";
  DROP TYPE "public"."enum_jobs_recruitment_status";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_required_documents";
  DROP TYPE "public"."enum__jobs_v_version_optional_documents";
  DROP TYPE "public"."enum__jobs_v_version_employment_type";
  DROP TYPE "public"."enum__jobs_v_version_recruitment_status";
  DROP TYPE "public"."enum__jobs_v_version_status";
  DROP TYPE "public"."enum_job_applications_documents_kind";
  DROP TYPE "public"."enum_job_applications_status";
  DROP TYPE "public"."enum_job_applications_education_highest_level";
  DROP TYPE "public"."enum_job_applications_interview_mode";
  DROP TYPE "public"."enum_applicant_documents_kind";
  DROP TYPE "public"."enum_audit_log_action";
  DROP TYPE "public"."enum_users_roles";`)
}
