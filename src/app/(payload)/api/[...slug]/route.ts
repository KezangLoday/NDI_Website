/**
 * Payload's REST API, and the file route that serves uploads.
 *
 * This is what enforces access control on an applicant document: a request for
 * `/api/applicant-documents/file/<name>` is handled here, and Payload runs the
 * collection's `read` rule before returning a byte.
 */
import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
