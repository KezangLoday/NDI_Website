const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Formats an ISO date the way the design does — "Mon Jul 06 2026". */
export function formatNewsDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  const day = DAYS[date.getUTCDay()];
  const month = MONTHS[date.getUTCMonth()];
  const dayOfMonth = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${month} ${dayOfMonth} ${date.getUTCFullYear()}`;
}

/** A calendar date without the weekday — "12 Sep 2026". */
export function formatCalendarDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** A file size for a download link — "PDF · 2.4 MB". */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes <= 0) return "Download";
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;

  const mb = kb / 1024;
  /* One decimal below 10MB, none above: "2.4 MB" is useful, "41.7 MB" is precision nobody acts on. */
  return mb < 10 ? `${mb.toFixed(1)} MB` : `${Math.round(mb)} MB`;
}

/** A webinar's start, as the design prints it — "21 Aug 2026 · 14:00 BTT". */
const BHUTAN_OFFSET_MINUTES = 6 * 60;

export function formatSessionTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const utc = new Date(iso);
  if (Number.isNaN(utc.getTime())) return "";

  /* Shifting the instant and then reading UTC fields is what keeps this free of the host's own timezone. */
  const local = new Date(utc.getTime() + BHUTAN_OFFSET_MINUTES * 60_000);
  const day = local.getUTCDate();
  const month = MONTHS[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  const hours = String(local.getUTCHours()).padStart(2, "0");
  const minutes = String(local.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hours}:${minutes} BTT`;
}
