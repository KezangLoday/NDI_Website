/** The three CMS roles, and the predicates every access rule is built from. */
export const ROLES = ["superadmin", "hr", "pr"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Superadmin",
  hr: "HR",
  pr: "PR",
};

/** The authenticated user as access rules see it. */
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
