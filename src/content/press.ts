import type { PressItem } from "./types";

/**
 * Prospective Payload collection: `press` — the Media Coverage cards.
 *
 * Note for Phase 2: the design has no field for the publishing outlet, which
 * a real press page will want. Added here as optional so the layout can start
 * showing it as soon as the content exists.
 */
export const press: PressItem[] = [
  {
    id: "global-attention",
    category: "International press",
    title: "Bhutan's decentralized ID draws global attention",
    publishedAt: "2026-05-06",
    href: "#",
  },
  {
    id: "adoption-milestone",
    category: "National press",
    title: "Wallet adoption reaches new milestone",
    publishedAt: "2026-03-19",
    href: "#",
  },
  {
    id: "identity-belongs-to-person",
    category: "Interview",
    title: "“Identity should belong to the person” — inside the NDI programme",
    publishedAt: "2026-02-11",
    href: "#",
  },
  {
    id: "infrastructure-others-copy",
    category: "Feature",
    title: "How a small country built identity infrastructure others copy",
    publishedAt: "2025-12-02",
    href: "#",
  },
];
