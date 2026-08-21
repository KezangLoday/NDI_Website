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

/* ---- Nav visibility ---------------------------------------------- */

/**
 * `admin.hidden` for a collection only one role should see.
 *
 * This is the *second* of the two layers every collection gets, and it is the
 * cosmetic one: it keeps a collection out of the sidebar (and out of the admin
 * routes) for people who cannot use it. The `access` rules beside it are what
 * actually enforce anything — a hidden collection is still reachable over the
 * REST API, so hiding alone would be security theatre.
 *
 * Both layers read the same predicates from `roles.ts`, so a role can never be
 * shown a collection it cannot open, or denied one it can see.
 */
export function visibleTo(
  predicate: (user: RoleBearer | null) => boolean,
): (args: { user: AdminUser }) => boolean {
  return ({ user }) => !predicate(narrow(user));
}

/**
 * The user as `admin.hidden` receives it.
 *
 * Deliberately structural rather than Payload's `ClientUser` or the generated
 * `User`, because collections and globals type this callback differently —
 * `{ user: ClientUser }` versus `{ user: User | null }`. A parameter wide enough
 * to accept either is assignable to both, which is what lets one helper serve
 * every collection and the global.
 */
type AdminUser = { id?: unknown; roles?: unknown } | null;

/**
 * Narrows the admin panel's user to the role shape.
 *
 * The sanitised user Payload ships to the browser carries `roles`, but is typed
 * loosely enough that reading it needs the same care as `req.user`.
 */
function narrow(user: AdminUser | undefined): RoleBearer | null {
  if (!user || typeof user !== "object") return null;
  const { id, roles } = user;
  if (typeof id !== "number" && typeof id !== "string") return null;
  return { id, roles: Array.isArray(roles) ? (roles as Role[]) : null };
}

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
