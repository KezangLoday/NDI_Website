import Image from "next/image";

import { Icon } from "@/components/ui/icons";
import type { UpcomingEventSlot, Webinar } from "@/content/types";
import { mediaUrl } from "@/lib/media";

/**
 * The webinars page: the upcoming session as a banner, recordings as a grid.
 *
 * The banner takes a resolved `UpcomingEventSlot` rather than filtering the list
 * itself. That is the point of the slot type: whether a session is featured, and
 * whether the featured one has already happened, are decisions made on the
 * server from the CMS global — so this component either has an event or has the
 * empty-state copy, and cannot accidentally advertise last month's webinar.
 *
 * A session with no registration link still renders, without a button. That is
 * the honest shape for "this is happening, details to follow", and it is better
 * than a button pointing nowhere.
 */
export function WebinarsPanel({
  webinars,
  upcoming,
}: {
  webinars: Webinar[];
  upcoming: UpcomingEventSlot;
}) {
  const recordings = webinars.filter((item) => item.sessionStatus === "recorded");
  const event = upcoming.event?.webinar;

  return (
    <>
      {event ? (
        <div
          className="flex flex-col gap-5 rounded-2xl border p-7 min-[901px]:flex-row min-[901px]:items-center"
          style={{
            borderColor: "rgba(90,201,148,0.32)",
            background:
              "radial-gradient(115% 78% at 26% -6%, rgba(111,224,169,0.16) 0%, rgba(90,201,148,0.05) 42%, rgba(90,201,148,0) 68%), rgba(255,255,255,0.02)",
          }}
        >
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                style={{ boxShadow: "var(--glow-sm)" }}
              />
              Upcoming session
            </span>
            <h3 className="mt-3 font-display text-[21px] font-semibold leading-[1.25] tracking-[-0.02em] text-strong">
              {event.title}
            </h3>
            <p className="mt-2.5 max-w-[620px] text-[14.5px] leading-[1.6] text-muted">
              {event.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] tracking-[0.12em] text-faint">
              <span>{event.when}</span>
              {event.platform ? <span>{event.platform}</span> : null}
            </div>
            {event.speakers.length ? (
              <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                {event.speakers
                  .map((speaker) => (speaker.role ? `${speaker.name} · ${speaker.role}` : speaker.name))
                  .join("  ·  ")}
              </div>
            ) : null}
          </div>

          {event.registration ? (
            <div className="flex flex-none flex-col items-start gap-2 min-[901px]:items-end">
              <a
                href={event.registration.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-semibold"
                style={{ background: "var(--accent)", color: "var(--text-on-mint)" }}
              >
                {event.registration.label}
                <Icon name="arrowUpRight" size={16} strokeWidth={2} />
              </a>
              {event.registration.note ? (
                <span className="text-[11.5px] leading-[1.5] text-faint">
                  {event.registration.note}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        /* No banner, no empty card outline — a bordered box containing an
           apology draws more attention to the absence than the absence does.
           The note sits as plain copy where the banner would have been. */
        <p className="max-w-[62ch] text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
          {upcoming.emptyStateNote}
        </p>
      )}

      {recordings.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 min-[701px]:grid-cols-3">
          {recordings.map((item) => (
            <RecordingCard key={item.id} webinar={item} />
          ))}
        </div>
      ) : null}
    </>
  );
}

/**
 * One recording.
 *
 * Rendered as a link only when there is something to watch. A recorded session
 * whose video has not been posted yet is still worth listing — it tells someone
 * the session happened — but a card that looks clickable and does nothing is
 * worse than one that plainly is not.
 */
function RecordingCard({ webinar }: { webinar: Webinar }) {
  const inner = (
    <>
      <div
        className="relative flex aspect-video items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #16303c 0%, #131b28 70%)" }}
      >
        {webinar.thumbnail ? (
          <Image
            src={mediaUrl(webinar.thumbnail)}
            alt=""
            fill
            sizes="(max-width: 700px) 92vw, 360px"
            className="object-cover"
          />
        ) : null}
        {/* The play mark sits over the artwork where there is some, and over the
            design's gradient where there is not. */}
        <span className="relative text-accent/60">
          <Icon name="playCircle" size={34} />
        </span>
      </div>
      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          {webinar.kind ?? webinar.category}
        </div>
        <div className="mt-2 font-display text-[15.5px] font-semibold leading-[1.3] text-strong">
          {webinar.title}
        </div>
      </div>
    </>
  );

  const className = "ndi-role-card overflow-hidden rounded-2xl border border-grid bg-white/[0.02]";

  return webinar.recording ? (
    <a
      href={webinar.recording.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}
