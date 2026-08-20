/**
 * The three CMS roles, and the predicates every access rule is built from.
 *
 * Roles are a `hasMany` select rather than a single value, because the three
 * are responsibilities and not a hierarchy: a small communications team may
 * well have one person who is both HR and PR, and modelling that as a third
 * combined role would mean a fourth the moment another pair overlaps.
 *
 * Superadmin is not "HR plus PR" either — it additionally owns user management
 * and configuration — so it is checked separately rather than expanded into the
 * other two at assignment time.
 */
export const ROLES = ["superadmin", "hr", "pr"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Superadmin",
  hr: "HR",
  pr: "PR",
};

/**
 * The authenticated user as access rules see it.
 *
 * Payload types `req.user` as the generated `User` union, which is wider than
 * anything an access rule needs. Narrowing to this shape keeps the rules
 * readable and means they do not have to be regenerated when unrelated fields
 * are added to the collection.
 */
export interface RoleBearer {
  readonly id: number | string;
  readonly roles?: Role[] | null;
}

export function hasRole(user: RoleBearer | null | undefined, ...roles: Role[]): boolean {
  if (!user?.roles) return false;
  return roles.some((role) => user.roles!.includes(role));
}

export function isSuperadmin(user: RoleBearer | null | undefined): boolean {
  return hasRole(user, "superadmin");
}

/** Superadmin is deliberately included: it can do anything HR can. */
export function isHR(user: RoleBearer | null | undefined): boolean {
  return hasRole(user, "hr", "superadmin");
}

export function isPR(user: RoleBearer | null | undefined): boolean {
  return hasRole(user, "pr", "superadmin");
}
