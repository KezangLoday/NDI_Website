/** The slug field, and the one function that produces slugs. */
import type { Field, FieldHook, TypeWithID, Validate } from "payload";

/** Turns a title into a URL segment. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    // Strip the combining marks NFKD just separated out, so "Café" → "Cafe".
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    // A trailing hyphen can reappear after the length cap.
    .replace(/-+$/, "");
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateSlug: Validate<string | null | undefined> = (value) => {
  if (typeof value !== "string" || value.length === 0) {
    return "A slug is required — it is the page's URL.";
  }
  if (!SLUG_PATTERN.test(value)) {
    return "Use lower-case letters, numbers and single hyphens, e.g. wallet-backup-recovery.";
  }
  return true;
};

/** Fills an empty slug from another field. */
function generateFrom(sourceField: string): FieldHook<TypeWithID, string> {
  return ({ data, value }) => {
    if (typeof value === "string" && value.length > 0) return value;
    const source = data?.[sourceField as keyof typeof data];
    if (typeof source !== "string" || source.length === 0) {
      /* Nothing to generate from. */
      return typeof value === "string" ? value : "";
    }
    return slugify(source);
  };
}

export interface SlugFieldOptions {
  /** Field the slug is generated from when left blank. */
  readonly from?: string;
  /** Route the slug appears in, shown in the admin sidebar as a hint. */
  readonly urlPrefix?: string;
  /** Collections whose slug column this shares a uniqueness scope with. */
  readonly unique?: boolean;
}

/** A unique, indexed slug in the sidebar. */
export function slugField(options: SlugFieldOptions = {}): Field {
  const { from = "title", urlPrefix, unique = true } = options;
  return {
    name: "slug",
    type: "text",
    unique,
    index: true,
    validate: validateSlug,
    hooks: { beforeValidate: [generateFrom(from)] },
    admin: {
      position: "sidebar",
      description: urlPrefix
        ? `The page's address: ${urlPrefix}/…  Leave blank to generate it from the title.`
        : "Leave blank to generate it from the title.",
    },
    label: "Slug (URL)",
  };
}
