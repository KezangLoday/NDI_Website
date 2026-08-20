/** Every access rule in the CMS, in one file. */
import type { Access, AccessArgs, Where } from "payload";

import { isHR, isPR, isSuperadmin, type Role, type RoleBearer } from "./roles";

export { ROLES, ROLE_LABELS, hasRole, isHR, isPR, isSuperadmin } from "./roles";
export type { Role, RoleBearer } from "./roles";

/** Narrows Payload's `req.user` to the shape the rules need. */
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

/** Only published documents are visible to the public. */
export const publishedOrSignedIn: Access = (args) => {
  if (userOf(args) !== null) return true;
  return PUBLISHED_ONLY;
};

/** The constraint form, reused by the frontend query helpers. */
export const PUBLISHED_ONLY: Where = { _status: { equals: "published" } };

/* ---- Recruitment ------------------------------------------------ */

/** Applications and applicant documents: HR and superadmin, nobody else. */
export const recruitmentAccess: Access = (args) => isHR(userOf(args));

/** Deleting an application. */
export const recruitmentDelete: Access = (args) => isSuperadmin(userOf(args));

/* ---- Users ------------------------------------------------------ */

/** Reading user accounts. */
export const readUsers: Access = (args) => {
  const user = userOf(args);
  if (!user) return false;
  if (isSuperadmin(user)) return true;
  return { id: { equals: user.id } } satisfies Where;
};

/** Editing a user. */
export const updateUsers: Access = (args) => {
  const user = userOf(args);
  if (!user) return false;
  if (isSuperadmin(user)) return true;
  return { id: { equals: user.id } } satisfies Where;
};
