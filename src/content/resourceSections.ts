import type { IconName } from "@/components/ui/icons";

/**
 * The three resource sections, now three routes rather than three tabs.
 *
 * Tabs hid two thirds of the content behind a click, gave the sections no URL
 * of their own, and meant the nav's deep links had to *select* a panel rather
 * than simply navigate. As pages each one is linkable, indexable and can carry
 * its own title and description.
 */
export interface ResourceSection {
  id: "news" | "webinars" | "insights";
  href: string;
  label: string;
  /** The index card's blurb. Deliberately terse: it sits under a heading in a
   *  grid of three, where a sentence would crowd its neighbours. */
  description: string;
  /** The page's own headline, which can be longer than the card label. */
  title: string;
  /** The phrase inside `title` that carries the gradient. */
  emphasis: string;
  /** The page's lead. Longer than `description`, which was standing in for it
   *  and left each hero with a four-word sentence under a 58px headline. */
  lead: string;
  eyebrow: string;
  icon: IconName;
}

export const resourceSections: ResourceSection[] = [
  {
    id: "news",
    href: "/resources/news",
    label: "News & Updates",
    description: "Announcements, launches & press releases.",
    title: "What's new across the ecosystem",
    emphasis: "ecosystem",
    lead:
      "Announcements, partnerships and press coverage from across the Bhutan NDI programme. New services as they connect, milestones as they land, and the reporting that follows.",
    eyebrow: "— News & updates",
    icon: "newspaper",
  },
  {
    id: "webinars",
    href: "/resources/webinars",
    label: "Webinars",
    description: "Recordings, upcoming sessions & talks.",
    title: "Sessions, live and recorded",
    emphasis: "live and recorded",
    lead:
      "Walkthroughs of the wallet, integration sessions for issuers and verifiers, and recordings of past talks. Join the next one, or catch up on anything you missed.",
    eyebrow: "— Webinars",
    icon: "video",
  },
  {
    id: "insights",
    href: "/resources/insights",
    label: "Insights & Publications",
    description: "Research, case studies & blogs.",
    title: "Research, case studies and blogs",
    emphasis: "case studies",
    lead:
      "Research papers, technical notes, deployment case studies and writing from the team building the platform. What worked, what it cost, and what we would do differently.",
    eyebrow: "— Insights & publications",
    icon: "book",
  },
];
