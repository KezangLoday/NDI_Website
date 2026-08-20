/**
 * The Payload instance the frontend reads through.
 *
 * `getPayload` is memoised inside Payload itself, so calling this per request is
 * cheap — but it is worth being explicit about what it is: the **Local API**,
 * which talks to Postgres in-process. No HTTP, no serialisation, no port. That
 * is what makes it safe to query from a Server Component that is being
 * prerendered at build time, and it is why none of the public pages needs an
 * API route.
 *
 * It also means access control is *off* by default on these calls
 * (`overrideAccess` defaults to true in the Local API), which is exactly why
 * every public query in `src/content/cms/` filters for published documents
 * explicitly rather than relying on the collection's `read` rule to do it.
 */
import configPromise from "@payload-config";
import { getPayload, type Payload } from "payload";

export function getPayloadClient(): Promise<Payload> {
  return getPayload({ config: configPromise });
}
