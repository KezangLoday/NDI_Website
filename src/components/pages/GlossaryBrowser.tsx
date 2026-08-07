"use client";

import { useMemo, useState } from "react";

import { Icon } from "@/components/ui/icons";
import type { GlossaryTerm } from "@/content/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Live search plus an A–Z index over the glossary.
 *
 * Both the index and the letter groups are derived from the same data, so a
 * letter with no terms dims automatically. (The prototype hard-coded the
 * index next to data-driven groups, which let the two drift apart.)
 */
export function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter((term) =>
      `${term.term} ${term.definition}`.toLowerCase().includes(q),
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
      <div className="flex flex-wrap items-center gap-4">
        <label className="relative min-w-[260px] flex-1">
          <span className="sr-only">Search terms</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms and definitions"
            className="ndi-field h-12 w-full rounded-xl border border-grid bg-raised pl-11 pr-4 font-body text-sm text-strong outline-none"
          />
        </label>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          {searching
            ? `— ${count} term${count === 1 ? "" : "s"}`
            : `— ${terms.length} terms`}
        </div>
      </div>

      <nav aria-label="Jump to letter" className="mt-6 flex flex-wrap gap-1.5">
        {ALPHABET.map((letter) => {
          const has = populated.has(letter);
          return has ? (
            <a
              key={letter}
              href={`#g-${letter.toLowerCase()}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-grid font-mono text-[11px] text-accent transition-colors hover:bg-[color:var(--ndi-mint-08)]"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              aria-disabled="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-subtle font-mono text-[11px] text-faint"
            >
              {letter}
            </span>
          );
        })}
      </nav>

      <div className="mt-10 flex flex-col gap-12">
        {groups.map((group) => (
          <section key={group.letter} id={group.anchor} className="scroll-mt-[120px]">
            <div className="flex items-center gap-4">
              <h2 className="font-display text-[22px] font-semibold text-accent">
                {group.letter}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--border-grid)]" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1001px]:grid-cols-3">
              {group.items.map((term) => (
                <div
                  key={term.id}
                  className="rounded-2xl border border-grid bg-white/[0.02] p-5"
                >
                  <div className="font-display text-[15.5px] font-semibold leading-[1.3] text-strong">
                    {term.term}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {count === 0 ? (
        <div className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          — No terms match that search
        </div>
      ) : null}
    </>
  );
}
