"use client";

import { useMemo, useState } from "react";

import { ProseBody } from "@/content/cms/richText";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import type { GlossaryTerm } from "@/content/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Live search plus an A–Z index over the glossary. */
export function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter((term) =>
      /* `searchText` is the definition flattened on the server; the abbreviation is searched too, so "VC" finds "Verifiable Credential". */
      `${term.term} ${term.abbreviation ?? ""} ${term.searchText}`.toLowerCase().includes(q),
    );
  }, [terms, query]);

  const groups = useMemo(() => {
    const byLetter = new Map<string, GlossaryTerm[]>();
    for (const term of visible) {
      const letter = term.term[0].toUpperCase();
      const bucket = byLetter.get(letter);
      if (bucket) bucket.push(term);
      else byLetter.set(letter, [term]);
    }
    return [...byLetter.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({ letter, anchor: `g-${letter.toLowerCase()}`, items }));
  }, [visible]);

  const populated = useMemo(
    () => new Set(terms.map((term) => term.term[0].toUpperCase())),
    [terms],
  );

  const count = visible.length;

  return (
    <>
      {/* Section header and search sit on one baseline-aligned row. */}
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-[560px]">
          <Eyebrow>— Glossary</Eyebrow>
          <h2 className="font-display text-[clamp(30px,3.6vw,42px)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong">
            Key terms, plainly
          </h2>
        </div>
        <label className="relative">
          <span className="sr-only">Search terms</span>
          <span className="pointer-events-none absolute left-4 top-0 bottom-0 flex items-center text-faint">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms"
            className="ndi-field h-[46px] w-[300px] max-w-full rounded-xl border border-grid bg-white/[0.03] pl-11 pr-4 font-body text-sm text-strong outline-none"
          />
        </label>
      </div>

      {/* One bordered strip holds the whole A–Z, as in the design. */}
      <nav
        aria-label="Jump to letter"
        className="mt-[30px] flex flex-wrap gap-1 [@media(hover:none)]:gap-2 rounded-[14px] border border-grid bg-white/[0.02] px-3 py-2.5"
      >
        {ALPHABET.map((letter) => {
          const has = populated.has(letter);
          return has ? (
            <a
              key={letter}
              href={`#g-${letter.toLowerCase()}`}
              className="inline-flex h-[34px] w-[34px] [@media(hover:none)]:h-11 [@media(hover:none)]:w-11 items-center justify-center rounded-[9px] font-mono text-[12.5px] text-accent transition-colors duration-[220ms] hover:bg-[rgba(90,201,148,0.12)]"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              aria-disabled="true"
              className="inline-flex h-[34px] w-[34px] [@media(hover:none)]:h-11 [@media(hover:none)]:w-11 items-center justify-center rounded-[9px] font-mono text-[12.5px] text-faint opacity-40"
            >
              {letter}
            </span>
          );
        })}
      </nav>

      <div className="mt-[22px] font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
        — {count} term{count === 1 ? "" : "s"}
      </div>

      <div className="mt-7 flex flex-col gap-11">
        {groups.map((group) => (
          <section key={group.letter} id={group.anchor} className="scroll-mt-[120px]">
            <div className="flex items-center gap-[18px]">
              <h2 className="font-display text-[30px] font-bold tracking-[-0.03em] text-accent">
                {group.letter}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--border-grid)]" />
            </div>
            <div
              data-ndi-3col="1"
              className="mt-[18px] grid grid-cols-1 gap-3.5 min-[701px]:grid-cols-2 min-[1001px]:grid-cols-3"
            >
              {group.items.map((term) => (
                <div
                  key={term.id}
                  className="ndi-spot flex flex-col gap-[9px] rounded-xl border border-grid bg-white/[0.02] p-[22px]"
                >
                  <div className="ndi-spot-halo" />
                  <div className="ndi-spot-fill" />
                  <div className="font-display text-[16px] font-semibold tracking-[-0.01em] text-strong">
                    {term.term}
                  </div>
                  <div className="text-[13.5px] leading-[1.62] text-muted [text-wrap:pretty]">
                    <ProseBody content={term.definition} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {count === 0 ? (
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          — No terms match that search
        </div>
      ) : null}
    </>
  );
}
