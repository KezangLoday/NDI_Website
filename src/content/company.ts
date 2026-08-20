import { media } from "@/lib/media";

import type { MissionStatement, StoryStat, VisionPillar } from "./types";

/** The Company hero's story photograph. */
export const storyImage = media(
  "/media/company/story.webp",
  "The Bhutan NDI team",
  1022,
  575,
);
/** Framing offset carried over from the design tool's crop. */
export const storyImagePosition = "39.2% 50%";

export const storyBullets: string[] = [
  "Empowers you to take control of your personal data, enabling you to share only the information that is required for a specific transaction or interaction.",
  "Allows you to experience remote onboarding on various platforms and online services without having to visit physical offices, reducing both time and cost.",
  "Inspires you to embrace carbon-neutral life, reducing the need for physical paperwork, transportation, and energy consumption.",
  "Supports integrated and seamless user experience, reducing the need for multiple memory-based login credentials to access online platforms.",
];

export const storyStats: StoryStat[] = [
  { id: "dhi", value: "DHI company", label: "Druk Holding & Investments" },
  { id: "thimphu", value: "Thimphu", label: "Head office" },
  { id: "ssi", value: "SSI-first", label: "By architecture, not add-on" },
];

export const visionPillars: VisionPillar[] = [
  { id: "privacy", label: "Privacy", icon: media("/media/company/vision-privacy.png", "", 177, 187) },
  { id: "security", label: "Security", icon: media("/media/company/vision-security.png", "", 187, 187) },
  { id: "consent", label: "Consent", icon: media("/media/company/vision-consent.png", "", 176, 173) },
];

/** Mission statements carry inline emphasis in the design. */
export const missionStatements: MissionStatement[] = [
  {
    id: "build",
    icon: media("/media/company/mission-build.png", "", 176, 173),
    segments: [
      { text: "To " },
      { text: "build", emphasis: true },
      { text: " identity as the cornerstone of every digital interaction." },
    ],
  },
  {
    id: "ecosystem",
    icon: media("/media/company/mission-ecosystem.png", "", 237, 173),
    segments: [
      { text: "To foster a " },
      { text: "harmonious", emphasis: true },
      { text: " digital ecosystem for " },
      { text: "seamless", emphasis: true },
      { text: " delivery of government & business services." },
    ],
  },
  {
    id: "verify",
    icon: media("/media/company/mission-verify.png", "", 197, 173),
    segments: [
      { text: "To provide " },
      { text: "verification", emphasis: true },
      { text: " and " },
      { text: "authentication", emphasis: true },
      { text: " as-a-service for individuals and service providers to meet compliance requirements." },
    ],
  },
  {
    id: "innovate",
    icon: media("/media/company/mission-innovate.png", "", 169, 173),
    segments: [
      { text: "To continuously " },
      { text: "innovate", emphasis: true },
      { text: " to meet the demands of an evolving landscape of digital transactions." },
    ],
  },
];
