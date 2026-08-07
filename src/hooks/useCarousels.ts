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

/**
 * @param itemCounts how many logos each slot holds
 * @param exclusiveKeys optional per-slot key. Slots sharing a key are showing
 *   the same list of logos, so the carousel keeps their indices distinct — two
 *   columns drawn from one set never display the same mark at the same time.
 */
export function useLogoCarousel(itemCounts: number[], exclusiveKeys?: (string | undefined)[]) {
  // Slot composition is fixed by the content, so the joined counts are a
  // stable identity for the timer set.
  const key = itemCounts.join(",");
  const counts = useMemo(() => key.split(",").map(Number), [key]);

  // Read through a ref so changing keys never restarts the timers.
  const keysRef = useRef(exclusiveKeys);
  useEffect(() => {
    keysRef.current = exclusiveKeys;
  }, [exclusiveKeys]);

  // Slots sharing a list start on different logos, so the rule holds from the
  // first paint rather than only from the first swap.
  const [slots, setSlots] = useState<SlotState[]>(() => {
    const seenPerKey = new Map<string, number>();
    return counts.map((count, index) => {
      const slotKey = exclusiveKeys?.[index];
      let start = 0;
      if (slotKey) {
        const position = seenPerKey.get(slotKey) ?? 0;
        seenPerKey.set(slotKey, position + 1);
        start = count > 0 ? position % count : 0;
      }
      return { active: start, exiting: null, pending: start };
    });
  });
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

          // Whatever a sibling slot drawing on the same list is showing (or is
          // mid-handoff toward) is off limits.
          const mine = keysRef.current?.[slot];
          const taken = new Set<number>();
          if (mine) {
            prev.forEach((other, index) => {
              if (index !== slot && keysRef.current?.[index] === mine) {
                taken.add(other.active ?? other.pending);
              }
            });
          }

          let candidate = (from + 1) % count;
          for (let step = 0; taken.has(candidate) && step < count; step += 1) {
            candidate = (candidate + 1) % count;
          }

          next[slot] = { active: null, exiting: from, pending: candidate };
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
