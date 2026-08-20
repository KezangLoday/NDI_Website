/**
 * The slug field, and the one function that produces slugs.
 *
 * Slugs are the public URL of a document, which makes them the one field an
 * editor can change that breaks inbound links. So: generated from the title on
 * first save, left alone on every save after that, and always editable by hand
 * for the cases where the generated form reads badly.
 */
import type { Field, FieldHook, TypeWithID, Validate } from "payload";

/**
 * Turns a title into a URL segment.
 *
 * Deliberately ASCII-only. The site is bilingual in presentation, but a
 * Dzongkha slug percent-encodes to something unreadable and unshareable, and
 * transliterating it needs a mapping table nobody here can maintain
 * responsibly. Titles that produce nothing usable fall back to a manual slug,
 * which the required-field validation surfaces immediately.
 */
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

/**
 * Fills an empty slug from another field.
 *
 * Runs on `beforeValidate` so the generated value is what validation and the
 * uniqueness index see. It only ever fills a blank: renaming an article must
 * not silently move its URL, and an editor who clears the box is asking for it
 * to be regenerated.
 */
function generateFrom(sourceField: string): FieldHook<TypeWithID, string> {
  return ({ data, value }) => {
    if (typeof value === "string" && value.length > 0) return value;
    const source = data?.[sourceField as keyof typeof data];
    if (typeof source !== "string" || source.length === 0) {
      /*
       * Nothing to generate from. Returning the empty string rather than
       * `undefined` matters: `undefined` reads as "this hook has no opinion",
       * and Payload would leave the previous value in place — so clearing a
       * slug to have it regenerated would silently do nothing.
       */
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

/**
 * A unique, indexed slug in the sidebar.
 *
 * Indexed because every detail page is a lookup by slug and nothing else, so
 * this is the hottest query in the CMS; unique because two documents sharing a
 * slug means one of them is unreachable.
 *
 * Deliberately **not** `required`, even though a slug is mandatory. `validate`
 * is what enforces it — it rejects an empty or malformed value with the same
 * force, and rejects it whether the value was typed or generated. Declaring the
 * field `required` as well would add nothing at runtime and would cost
 * something real in the types: Payload marks a required field non-optional in
 * the generated types, so every caller would have to supply a slug that the
 * `beforeValidate` hook is about to compute for them. That is a lie the API
 * consumers, the seed and the tests would all have to work around.
 *
 * The admin panel loses its red asterisk on the field, which is if anything more
 * honest: an editor genuinely may leave it blank.
 */
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
