import { Icon } from "@/components/ui/icons";
import type { Webinar } from "@/content/types";

/** Upcoming sessions as banners, recordings as a row of thumbnails. */
export function WebinarsPanel({ webinars }: { webinars: Webinar[] }) {
  const upcoming = webinars.filter((item) => item.status === "upcoming");
  const recordings = webinars.filter((item) => item.status === "recorded");

  return (
    <>
        {upcoming.map((item) => (
          <div
            key={item.id}
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
                {item.title}
              </h3>
              <p className="mt-2.5 max-w-[620px] text-[14.5px] leading-[1.6] text-muted">
                {item.description}
              </p>
              <div className="mt-3 font-mono text-[11px] tracking-[0.12em] text-faint">
                {item.when}
              </div>
            </div>
            <a
              href={item.href}
              className="inline-flex flex-none items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-semibold"
              style={{ background: "var(--accent)", color: "var(--text-on-mint)" }}
            >
              {item.ctaLabel}
              <Icon name="arrowRight" size={16} strokeWidth={2} />
            </a>
          </div>
        ))}

        <div className="mt-4 grid grid-cols-1 gap-4 min-[701px]:grid-cols-3">
          {recordings.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="ndi-role-card overflow-hidden rounded-2xl border border-grid bg-white/[0.02]"
            >
              <div
                className="flex aspect-video items-center justify-center"
                style={{ background: "linear-gradient(160deg, #16303c 0%, #131b28 70%)" }}
              >
                <span className="text-accent/60">
                  <Icon name="playCircle" size={34} />
                </span>
              </div>
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {item.kind}
                </div>
                <div className="mt-2 font-display text-[15.5px] font-semibold leading-[1.3] text-strong">
                  {item.title}
                </div>
              </div>
            </a>
          ))}
        </div>
    </>
  );
}
