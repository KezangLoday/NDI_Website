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
  /** Shown on the index card and as the page's lead. */
  description: string;
  /** The page's own headline, which can be longer than the card label. */
  title: string;
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
    eyebrow: "— News & updates",
    icon: "newspaper",
  },
  {
    id: "webinars",
    href: "/resources/webinars",
    label: "Webinars",
    description: "Recordings, upcoming sessions & talks.",
    title: "Sessions, live and recorded",
    eyebrow: "— Webinars",
    icon: "video",
  },
  {
    id: "insights",
    href: "/resources/insights",
    label: "Insights & Publications",
    description: "Research, case studies & blogs.",
    title: "Research, case studies and blogs",
    eyebrow: "— Insights & publications",
    icon: "book",
  },
];
