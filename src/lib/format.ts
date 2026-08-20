const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Formats an ISO date the way the design does — "Mon Jul 06 2026".
 *
 * Deliberately UTC-based and hand-rolled rather than Intl: the value has to be
 * byte-identical between the server render and the client hydration, and a
 * locale- or timezone-sensitive formatter would drift between the two.
 */
export function formatNewsDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  const day = DAYS[date.getUTCDay()];
  const month = MONTHS[date.getUTCMonth()];
  const dayOfMonth = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${month} ${dayOfMonth} ${date.getUTCFullYear()}`;
}

/**
 * A calendar date without the weekday — "12 Sep 2026".
 *
 * The newsroom format leads with the day of the week, which is right for a
 * story ("Mon Jul 06 2026" reads as a dateline) and wrong for a deadline: what
 * an applicant is working out is how many days are left, and the weekday is
 * three characters in the way of the number. Same UTC discipline as above.
 */
export function formatCalendarDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * A file size for a download link — "PDF · 2.4 MB".
 *
 * Worth showing next to a document link: a research report can be 40MB, and
 * somebody on a metered connection deserves to know before they tap it.
 *
 * Powers of 1024 with the decimal-ish labels everyone actually reads, and no
 * `Intl` — the same server/client determinism the date formatters above need.
 */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes <= 0) return "Download";
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;

  const mb = kb / 1024;
  /* One decimal below 10MB, none above: "2.4 MB" is useful, "41.7 MB" is
     precision nobody acts on. */
  return mb < 10 ? `${mb.toFixed(1)} MB` : `${Math.round(mb)} MB`;
}

/**
 * A webinar's start, as the design prints it — "21 Aug 2026 · 14:00 BTT".
 *
 * The only date on this site that carries a time of day, because it is the only
 * one a reader acts on: a day alone is not enough to attend a session.
 *
 * Fixed to Bhutan time rather than converted to the reader's, and named as such.
 * A visitor in London is better served by "14:00 BTT" — which they can convert,
 * and which matches what the invitation and the host will say — than by an
 * "09:00" that silently disagrees with every other reference to the same
 * session. Hand-rolled for the same server/client determinism as the formatters
 * above: `Intl` with a timezone would drift between the two.
 */
const BHUTAN_OFFSET_MINUTES = 6 * 60;

export function formatSessionTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const utc = new Date(iso);
  if (Number.isNaN(utc.getTime())) return "";

  /* Shifting the instant and then reading UTC fields is what keeps this free of
     the host's own timezone. */
  const local = new Date(utc.getTime() + BHUTAN_OFFSET_MINUTES * 60_000);
  const day = local.getUTCDate();
  const month = MONTHS[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  const hours = String(local.getUTCHours()).padStart(2, "0");
  const minutes = String(local.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hours}:${minutes} BTT`;
}
