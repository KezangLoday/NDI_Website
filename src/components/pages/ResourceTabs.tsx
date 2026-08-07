"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icons";
import { resourceTabs, type ResourceTabId } from "@/content/resources";
import type { Insight, ResourceNews, Webinar } from "@/content/types";

const TAB_IDS = resourceTabs.map((tab) => tab.id) as readonly string[];

function isTabId(value: string): value is ResourceTabId {
  return TAB_IDS.includes(value);
}

interface ResourceTabsProps {
  news: ResourceNews[];
  webinars: Webinar[];
  insights: Insight[];
}

/**
 * Three tabs, driven by the URL hash.
 *
 * The nav deep-links to /resources#news, #webinars and #insights, so the hash
 * has to *select* a tab, not just scroll — the panels are display-toggled and
 * a plain anchor would land on a hidden element. Kept as a hash rather than a
 * search param so the existing nav links keep working unchanged.
 */
export function ResourceTabs({ news, webinars, insights }: ResourceTabsProps) {
  const [tab, setTab] = useState<ResourceTabId>("news");

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isTabId(hash)) setTab(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const featured = news.find((item) => item.featured);
  const rest = news.filter((item) => !item.featured);
  const upcoming = webinars.filter((item) => item.status === "upcoming");
  const recordings = webinars.filter((item) => item.status === "recorded");

  return (
    <>
      <div
        role="tablist"
        aria-label="Resource type"
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-grid bg-white/[0.02] p-1"
      >
        {resourceTabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            aria-controls={`panel-${entry.id}`}
            data-tabbtn=""
            data-active={tab === entry.id ? "true" : "false"}
            onClick={() => {
              setTab(entry.id);
              history.replaceState(null, "", `#${entry.id}`);
            }}
            className="inline-flex h-11 cursor-pointer items-center rounded-[9px] border border-transparent bg-transparent px-5 font-display text-[14.5px] font-semibold text-muted transition-[background,color,border-color] duration-[220ms]"
          >
            {entry.label}
          </button>
        ))}
      </div>

      {/* NEWS */}
      <div
        id="panel-news"
        role="tabpanel"
        data-tabpanel=""
        data-active={tab === "news" ? "true" : "false"}
        className="mt-9"
      >
        {featured ? (
          <a
            href={featured.href}
            className="ndi-role-card block overflow-hidden rounded-2xl border border-grid bg-white/[0.02]"
          >
            <div
              className="flex aspect-[16/7] items-center justify-center bg-sunken"
              style={{
                background:
                  "radial-gradient(115% 78% at 26% -6%, rgba(111,224,169,0.20) 0%, rgba(90,201,148,0.06) 42%, rgba(90,201,148,0) 68%), linear-gradient(162deg, #103440 0%, #101827 64%)",
              }}
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                — Artwork to come
              </span>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-grid bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {featured.category}
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-faint">
                  {featured.publishedAt}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-strong">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-muted">
                {featured.excerpt}
              </p>
              <span className="ndi-news-read mt-5 inline-flex items-center gap-[7px] font-display text-sm font-semibold text-accent">
                Read story
                <Icon name="arrowRight" size={15} strokeWidth={1.9} />
              </span>
            </div>
          </a>
        ) : null}

        <div className="mt-4">
          {rest.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="ndi-news-row grid grid-cols-[1fr_auto] items-center gap-5 border-t border-subtle py-5"
            >
              <span className="flex min-w-0 flex-col gap-2">
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-faint">
                    {item.publishedAt}
                  </span>
                </span>
                <span className="ndi-news-title font-display text-[17px] font-semibold leading-[1.3] text-body">
                  {item.title}
                </span>
              </span>
              <Icon
                name="arrowRight"
                size={17}
                strokeWidth={1.9}
                className="ndi-news-arrow flex-none text-faint"
              />
            </a>
          ))}
        </div>

        <a
          href="#"
          className="ndi-news-read mt-6 inline-flex items-center gap-[7px] font-display text-sm font-semibold text-accent"
        >
          All news &amp; updates
          <Icon name="arrowRight" size={15} strokeWidth={1.9} />
        </a>
      </div>

      {/* WEBINARS */}
      <div
        id="panel-webinars"
        role="tabpanel"
        data-tabpanel=""
        data-active={tab === "webinars" ? "true" : "false"}
        className="mt-9"
      >
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
      </div>

      {/* INSIGHTS */}
      <div
        id="panel-insights"
        role="tabpanel"
        data-tabpanel=""
        data-active={tab === "insights" ? "true" : "false"}
        className="mt-9"
      >
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
      </div>
    </>
  );
}
