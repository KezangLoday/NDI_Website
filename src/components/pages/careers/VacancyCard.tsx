import Link from "next/link";

import { Icon } from "@/components/ui/icons";
import type { Job } from "@/content/types";
import { formatCalendarDate } from "@/lib/format";

/** The frosted glass the use-case bento wears, so a vacancy is the same object. */
const GLASS =
  "linear-gradient(150deg, rgba(255,255,255,0.10), rgba(18,65,67,0.34) 46%, rgba(20,27,41,0.28))";

const GLASS_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.03), " +
  "0 22px 52px rgba(0,0,0,0.38)";

/**
 * One open position, built as a "What you can do today" card.
 *
 * Same glass, same mint border, same proximity-tracked arc, same icon-above /
 * copy-below split — a vacancy is a thing you can act on, so it should look
 * like the other things on this site you can act on rather than like a panel
 * of metadata.
 *
 * What the reference card does not have is facts to carry, so those take the
 * two places the layout leaves free: the pills ride the icon's line, and the
 * department, location and deadline collapse into one mono row above the call
 * to action. No divider — the card is one object, not a header and a footer.
 *
 * The closing date turns amber inside a fortnight. A deadline that only ever
 * reads as grey metadata is the one piece of a listing people miss.
 */
export function VacancyCard({ job }: { job: Job }) {
  const closes = new Date(`${job.closesAt}T00:00:00Z`);
  const daysLeft = Math.ceil((closes.getTime() - Date.now()) / 86_400_000);
  const closingSoon = daysLeft >= 0 && daysLeft <= 14;
  const closed = daysLeft < 0;

  return (
    <Link
      href={`/careers/${job.slug}`}
      className="ndi-uc relative flex min-h-[248px] flex-col justify-between gap-7 rounded-[20px] border p-[26px]"
      style={{
        borderColor: "rgba(90,201,148,0.20)",
        background: GLASS,
        backdropFilter: "blur(26px) saturate(150%)",
        WebkitBackdropFilter: "blur(26px) saturate(150%)",
        boxShadow: GLASS_SHADOW,
      }}
    >
      <div className="ndi-glow" />

      <div className="relative flex items-start justify-between gap-3">
        <span className="inline-flex flex-none items-center text-accent">
          <Icon name={job.icon} size={24} />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          <span
            className="ndi-vacancy-pill"
            data-tone={job.employmentType === "Contract" ? "alt" : "mint"}
          >
            {job.employmentType}
          </span>
          <span className="ndi-vacancy-pill" data-tone="plain">
            {job.slots} {job.slots === 1 ? "position" : "positions"}
          </span>
        </div>
      </div>

      <div className="relative">
        <h3 className="font-display text-[21px] font-semibold leading-[1.2] tracking-[-0.03em] text-strong [text-wrap:balance]">
          {job.title}
        </h3>
        <p className="mt-2.5 text-[14.5px] leading-[1.55] text-muted [text-wrap:pretty]">
          {job.summary}
        </p>

        {/* Two fixed lines rather than one wrapping row: at card width the
            deadline drops to a second line on some cards and not others, which
            left a separator dangling at the end of a line and set the titles at
            three different heights across the row. */}
        <div className="mt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          <div>
            {job.department} <Dot /> {job.location}
          </div>
          <div className={`mt-1 ${closingSoon ? "text-[#f0b866]" : ""}`}>
            {closed ? "Closed" : `Closes ${formatCalendarDate(job.closesAt)}`}
          </div>
        </div>

        <span className="ndi-tut mt-3.5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
          View details
          <Icon name="arrowRight" size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="opacity-50">
      ·
    </span>
  );
}
