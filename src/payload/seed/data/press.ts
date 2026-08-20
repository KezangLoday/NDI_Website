import { media } from "../media";

import type { SeedPressItem } from "./types";

/** Prospective Payload collection: `press` — the Media Coverage cards. */
export const press: SeedPressItem[] = [
  {
    id: "global-attention",
    category: "International press",
    title: "Bhutan's decentralized ID draws global attention",
    excerpt:
      "Coverage of the programme's architecture and why a country of under a million people is being read as a template.",
    publishedAt: "2026-05-06",
    href: "#",
    image: media("/media/press/global-attention.webp", "", 1200, 750),
  },
  {
    id: "adoption-milestone",
    category: "National press",
    title: "Wallet adoption reaches new milestone",
    excerpt:
      "Reporting on uptake across government, banking and telecom services, and the services still to come.",
    publishedAt: "2026-03-19",
    href: "#",
    image: media("/media/press/adoption-milestone.webp", "", 1200, 750),
  },
  {
    id: "identity-belongs-to-person",
    category: "Interview",
    title: "“Identity should belong to the person”: inside the NDI programme",
    excerpt:
      "A long-form interview on the decision to hold credentials on the citizen's device rather than in a central register.",
    publishedAt: "2026-02-11",
    href: "#",
    image: media("/media/press/identity-belongs.webp", "", 1200, 750),
  },
  {
    id: "infrastructure-others-copy",
    category: "Feature",
    title: "How a small country built identity infrastructure others copy",
    excerpt:
      "A feature on the programme's first two years, the standards it bet on, and what other governments are asking for.",
    publishedAt: "2025-12-02",
    href: "#",
    image: media("/media/press/infrastructure-copy.webp", "", 1200, 750),
  },
];
