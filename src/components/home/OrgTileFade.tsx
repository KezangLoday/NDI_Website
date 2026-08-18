"use client";

import { useOrgTileFade } from "@/hooks/useOrgTileFade";

/** Renders nothing; runs the partner tiles' per-tile fade. See the hook. */
export function OrgTileFade() {
  useOrgTileFade();
  return null;
}
