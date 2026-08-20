/**
 * CMS accounts.
 *
 * The security-critical detail here is not the collection-level access — it is
 * the field-level rule on `roles`. Any user may edit their own document, which
 * is what makes the account page work; without a field rule, "edit your own
 * document" would include "add superadmin to your own roles", and every other
 * access rule in the CMS would be decoration.
 */
import type { CollectionConfig, FieldAccess } from "payload";

import { readUsers, ROLE_LABELS, ROLES, superadminOnly, updateUsers } from "../access";
import { isSuperadmin, type Role } from "../access/roles";

/**
 * Only a superadmin may read or write the roles array.
 *
 * Field access rules receive the same request as collection rules but return a
 * plain boolean — there is no row to constrain, only a column to allow or deny.
 */
const superadminField: FieldAccess = ({ req }) => {
  const user = req.user;
  if (!user || typeof user !== "object" || !("roles" in user)) return false;
  const roles = user.roles;
  return isSuperadmin({ id: user.id, roles: Array.isArray(roles) ? (roles as Role[]) : null });
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    /**
     * Tokens last a working day. Long enough that an editor is not signed out
     * mid-article, short enough that a session left open on a shared machine
     * does not stay valid overnight.
     */
    tokenExpiration: 60 * 60 * 8,
    /**
     * Five attempts, then a ten-minute lock. This is the only endpoint in the
     * CMS an unauthenticated stranger can usefully hammer.
     */
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles", "updatedAt"],
    group: "Administration",
    description: "Who can sign in to the CMS, and what each of them may do.",
  },
  access: {
    /** Accounts are created by a superadmin, never by self-registration. */
    create: superadminOnly,
    read: readUsers,
    update: updateUsers,
    delete: superadminOnly,
    /** Nobody but a superadmin needs to see the roles matrix in the API. */
    admin: ({ req }) => req.user !== null,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Shown on assigned applications and in the audit trail." },
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      index: true,
      defaultValue: ["pr"] satisfies Role[],
      options: ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
      access: {
        create: superadminField,
        update: superadminField,
      },
      admin: {
        description:
          "Superadmin: everything, including accounts. HR: careers, applications, team, FAQs. PR: newsroom, webinars, publications, glossary, media coverage.",
      },
    },
    {
      name: "jobTitle",
      type: "text",
      label: "Job title",
      admin: {
        position: "sidebar",
        description: "Optional. Context for whoever inherits an assigned application.",
      },
    },
  ],
  timestamps: true,
};
