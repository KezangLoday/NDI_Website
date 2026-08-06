"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useReducedMotion } from "./useReducedMotion";

/** Hero headline rotator — 4200ms per phrase in the design. */
export function useRotatingPhrase(count: number, interval = 4200): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  return index;
}

/**
 * News feed selector.
 *
 * Auto-advances every 5200ms, pauses while the pointer is anywhere inside the
 * section, and switches off entirely under reduced motion — all as per the
 * prototype's `setupNewsFeed()`.
 */
export function useNewsCarousel(count: number, interval = 5200) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [count, interval, paused, reduced]);

  return {
    index,
    select: setIndex,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
  };
}

/**
 * Collaborator logo carousel.
 *
 * Each slot runs on its own period and start offset — deliberately
 * non-multiples, so no two slots ever swap on the same beat. A swap is a
 * two-stage handoff: the outgoing logo animates out for 300ms with nothing
 * active, then the incoming one is marked active.
 */
const SLOT_PERIODS = [3400, 3100, 3700, 4300, 3900];
const SLOT_OFFSETS = [900, 1500, 2100, 400, 2700];
const HANDOFF_MS = 300;

interface SlotState {
  active: number | null;
  exiting: number | null;
  pending: number;
}

export function useLogoCarousel(itemCounts: number[]) {
  // Slot composition is fixed by the content, so the joined counts are a
  // stable identity for the timer set.
  const key = itemCounts.join(",");
  const counts = useMemo(() => key.split(",").map(Number), [key]);

  const [slots, setSlots] = useState<SlotState[]>(() =>
    counts.map(() => ({ active: 0, exiting: null, pending: 0 })),
  );
  const heldRef = useRef<Record<number, boolean>>({});
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    counts.forEach((count, slot) => {
      if (count < 2) return;

      const step = () => {
        if (heldRef.current[slot]) return;

        setSlots((prev) => {
          if (!prev[slot]) return prev;
          const next = [...prev];
          const current = next[slot];
          const from = current.active ?? current.pending;
          next[slot] = { active: null, exiting: from, pending: (from + 1) % count };
          return next;
        });

        timeouts.push(
          setTimeout(() => {
            setSlots((prev) => {
              if (!prev[slot]) return prev;
              const next = [...prev];
              next[slot] = { ...next[slot], active: next[slot].pending, exiting: null };
              return next;
            });
          }, HANDOFF_MS),
        );
      };

      timeouts.push(
        setTimeout(() => {
          step();
          intervals.push(setInterval(step, SLOT_PERIODS[slot % SLOT_PERIODS.length]));
        }, SLOT_OFFSETS[slot % SLOT_OFFSETS.length]),
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [counts, reduced]);

  const hold = useCallback((slot: number, held: boolean) => {
    heldRef.current[slot] = held;
  }, []);

  return { slots, hold };
}
