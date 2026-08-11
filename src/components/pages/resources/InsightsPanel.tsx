import { Icon } from "@/components/ui/icons";
import type { Insight } from "@/content/types";

/** Research, case studies and blogs as a divided list. */
export function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
      <div className="flex flex-col">
        {insights.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            className={`ndi-news-row grid grid-cols-1 items-start gap-2 py-6 min-[901px]:grid-cols-[150px_minmax(0,1fr)_auto] min-[901px]:gap-6 ${
              index > 0 ? "border-t border-subtle" : ""
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {item.type}
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="ndi-news-title font-display text-[17px] font-semibold leading-[1.3] text-body">
                {item.title}
              </span>
              <span className="text-[14px] leading-[1.6] text-muted">{item.description}</span>
            </span>
            <Icon
              name="arrowRight"
              size={17}
              strokeWidth={1.9}
              className="ndi-news-arrow hidden flex-none text-faint min-[901px]:block"
            />
          </a>
        ))}
      </div>
  );
}
