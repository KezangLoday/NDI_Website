/**
 * The field and label treatment shared by the two enquiry forms — Home's
 * contact card and the Organizations business inquiry.
 *
 * They are the same form in two places, so the styling lives once. Kept apart,
 * the two had already drifted: different radii, fills, padding and type sizes,
 * and one of them had no visible labels at all.
 */
export const FIELD_CLASS =
  "ndi-field box-border w-full rounded-[10px] border border-grid bg-raised px-[14px] font-body text-sm text-strong outline-none";

export const LABEL_CLASS = "font-mono text-[10px] uppercase tracking-[0.16em] text-muted";

/** Label above field, as both forms lay them out. */
export const FIELD_BLOCK_CLASS = "flex min-w-0 flex-col gap-[7px]";
