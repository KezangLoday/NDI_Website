import Link from "next/link";

import { Icon } from "@/components/ui/icons";
import type { Job } from "@/content/types";
import { formatCalendarDate } from "@/lib/format";

/**
 * One open position.
 *
 * The card previously carried department, title, summary and a location, and
 * linked nowhere. What an applicant actually decides on is missing from that
 * list: whether the job is permanent, how many are being hired, and how long
 * they have to apply. Those three now sit on the face of the card, and the
 * whole card is the link to the terms of reference.
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
      data-gov-card="1"
      className="ndi-vacancy ndi-role-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-grid p-[26px]"
    >
      <div className="relative flex flex-wrap items-center gap-2">
        <span className="ndi-vacancy-pill" data-tone="mint">
          {job.employmentType}
        </span>
        <span className="ndi-vacancy-pill" data-tone="plain">
          {job.slots} {job.slots === 1 ? "position" : "positions"}
        </span>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {job.department} · {job.level}
        </span>
        <h3 className="mt-2.5 font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.02em] text-strong [text-wrap:pretty]">
          {job.title}
        </h3>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
          {job.summary}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-body">
          <Icon name="mapPin" size={14} strokeWidth={1.8} className="flex-none text-faint" />
          {job.location}
        </span>
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-grid pt-4">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
            closingSoon ? "text-[#f0b866]" : "text-faint"
          }`}
        >
          {closed ? "Closed" : `Closes ${formatCalendarDate(job.closesAt)}`}
        </span>
        <span className="ndi-tut inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          View details
          <Icon name="arrowRight" size={13} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
