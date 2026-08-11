import { Icon } from "@/components/ui/icons";
import type { ResourceNews } from "@/content/types";

/** The news list: one featured story beside the rest as rows. */
export function NewsPanel({ news }: { news: ResourceNews[] }) {
  const featured = news.find((item) => item.featured);
  const rest = news.filter((item) => !item.featured);

  return (
    // Featured story on the left, the rest as their own cards on the right.
    <div
        data-ndi-2col="1"
        className="grid grid-cols-1 gap-5 min-[901px]:grid-cols-[1.15fr_0.85fr]"
      >
        {featured ? (
          <a
            href={featured.href}
            className="ndi-spot ndi-res-feat relative flex flex-col overflow-hidden rounded-2xl border border-grid"
            style={{
              background: "var(--grad-card)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "var(--inset-top), 0 18px 44px rgba(0,0,0,0.28)",
            }}
          >
            <div className="ndi-spot-halo" />
            <div className="ndi-spot-fill" />
            <div
              className="relative flex h-[300px] items-center justify-center"
              style={{ background: "#0c111b" }}
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                — Artwork to come
              </span>
            </div>
            <div className="p-[26px]">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-[rgba(90,201,148,0.3)] px-2.5 py-[5px] font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent">
                  {featured.category}
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-faint">
                  {featured.publishedAt}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[24px] font-semibold leading-[1.18] tracking-[-0.02em] text-strong">
                {featured.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.62] text-muted">{featured.excerpt}</p>
              <span className="ndi-tut mt-[18px] inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                Read story
                <Icon name="arrowRight" size={14} strokeWidth={2} />
              </span>
            </div>
          </a>
        ) : null}

        <div className="flex flex-col gap-3">
          {rest.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="ndi-spot ndi-res-row flex flex-col gap-2.5 rounded-2xl border border-grid bg-white/[0.02] p-[22px]"
            >
              <div className="ndi-spot-halo" />
              <div className="ndi-spot-fill" />
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-grid px-2.5 py-[5px] font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                  {item.category}
                </span>
                <span className="font-mono text-[10.5px] text-faint">{item.publishedAt}</span>
              </div>
              <div className="font-display text-[17px] font-semibold leading-[1.28] tracking-[-0.02em] text-strong">
                {item.title}
              </div>
            </a>
          ))}

          <a
            href="#"
            className="ndi-res-row mt-1 flex items-center justify-between gap-4 rounded-2xl border border-grid bg-white/[0.02] px-[22px] py-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
          >
            All news &amp; updates
            <Icon name="arrowRight" size={15} strokeWidth={1.9} className="text-accent" />
          </a>
        </div>
      </div>
  );
}
