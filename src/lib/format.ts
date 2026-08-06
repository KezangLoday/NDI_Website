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
