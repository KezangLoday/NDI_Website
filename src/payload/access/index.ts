/**
 * Every access rule in the CMS, in one file.
 *
 * Two principles hold throughout:
 *
 *  1. **Rules return constraints, not booleans, wherever the answer is "some of
 *     them".** A rule that returns a `Where` lets Payload push the restriction
 *     into the SQL query, so an unauthorised row is never loaded, never
 *     serialised and never counted. Filtering after the fact would leak totals
 *     through pagination metadata even when the documents themselves are hidden.
 *
 *  2. **Nothing relies on the admin UI hiding a control.** `admin.hidden` and
 *     field-level `admin.condition` are cosmetic; the rules here are what the
 *     REST API, the GraphQL API, the Local API and static file requests all go
 *     through.
 */
import type { Access, AccessArgs, Where } from "payload";

import { isHR, isPR, isSuperadmin, type Role, type RoleBearer } from "./roles";

export { ROLES, ROLE_LABELS, hasRole, isHR, isPR, isSuperadmin } from "./roles";
export type { Role, RoleBearer } from "./roles";

/**
 * Narrows Payload's `req.user` to the shape the rules need.
 *
 * `req.user` is typed as the generated `User` document, but it is also `null`
 * for anonymous requests and — for a collection with auth disabled — could be a
 * different document type entirely. This is the one place that widening is
 * dealt with, so the rules below can read `user.roles` without a cast each time.
 */
function userOf({ req }: AccessArgs): RoleBearer | null {
  const user = req.user;
  if (!user || typeof user !== "object" || !("id" in user)) return null;
  const roles = "roles" in user ? user.roles : null;
  return {
    id: user.id,
    roles: Array.isArray(roles) ? (roles as Role[]) : null,
  };
}

/* ---- Blanket rules ---------------------------------------------- */

/** Anyone, signed in or not. Used for genuinely public content. */
export const anyone: Access = () => true;

/** Nobody, over any API. Used where only server-side code may act. */
export const noOne: Access = () => false;

export const superadminOnly: Access = (args) => isSuperadmin(userOf(args));

/** Any authenticated CMS user, whatever their role. */
export const authenticated: Access = (args) => userOf(args) !== null;

export const hrOnly: Access = (args) => isHR(userOf(args));

export const prOnly: Access = (args) => isPR(userOf(args));

/** Editorial content: PR writes it, HR does not. */
export const prEditable: Access = (args) => isPR(userOf(args));

/** Recruitment content: HR writes it, PR does not. */
export const hrEditable: Access = (args) => isHR(userOf(args));

/** Shared taxonomy and public media: either editorial role may maintain it. */
export const hrOrPrEditable: Access = (args) => {
  const user = userOf(args);
  return isHR(user) || isPR(user);
};

/* ---- Draft isolation -------------------------------------------- */

/**
 * Only published documents are visible to the public.
 *
 * This is the second of two independent guards on draft content. The first is
 * the query the frontend issues, which asks for published documents explicitly.
 * This one covers everything that is *not* that query — a hand-written REST
 * call, a GraphQL query, a `payload.find` in future code that forgets the
 * filter — by making the restriction part of the collection rather than part of
 * the caller.
 *
 * Signed-in users see everything, which is what makes the admin panel and
 * Payload's own preview work.
 */
export const publishedOrSignedIn: Access = (args) => {
  if (userOf(args) !== null) return true;
  return PUBLISHED_ONLY;
};

/** The constraint form, reused by the frontend query helpers. */
export const PUBLISHED_ONLY: Where = { _status: { equals: "published" } };

/* ---- Recruitment ------------------------------------------------ */

/**
 * Applications and applicant documents: HR and superadmin, nobody else.
 *
 * PR is excluded by omission rather than by an explicit deny, so a fourth role
 * added later starts with no access to recruitment data instead of inheriting
 * it. Applicants have no account and so never satisfy this.
 */
export const recruitmentAccess: Access = (args) => isHR(userOf(args));

/**
 * Deleting an application.
 *
 * Restricted to superadmin: an application is the applicant's submission and a
 * record of a hiring decision, and "Rejected" or "Withdrawn" is the status that
 * closes one out. HR moving a candidate through the pipeline should never need
 * to destroy the record.
 */
export const recruitmentDelete: Access = (args) => isSuperadmin(userOf(args));

/* ---- Users ------------------------------------------------------ */

/**
 * Reading user accounts.
 *
 * Superadmin sees everyone, because it manages the roster. Everyone else sees
 * only their own account, which is what the admin panel needs to render the
 * account page and to resolve the name against an "assigned to" field.
 */
export const readUsers: Access = (args) => {
  const user = userOf(args);
  if (!user) return false;
  if (isSuperadmin(user)) return true;
  return { id: { equals: user.id } } satisfies Where;
};

/**
 * Editing a user.
 *
 * Superadmin edits anyone; anyone else edits only themselves. Role changes are
 * additionally locked down at field level — see `Users.ts` — because a user who
 * can update their own document must not be able to grant themselves
 * superadmin through it.
 */
export const updateUsers: Access = (args) => {
  const user = userOf(args);
  if (!user) return false;
  if (isSuperadmin(user)) return true;
  return { id: { equals: user.id } } satisfies Where;
};
