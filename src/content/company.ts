import { media } from "@/lib/media";

import type { MissionStatement, StoryStat, TeamMember, VisionPillar } from "./types";

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

/**
 * Mission statements carry inline emphasis in the design. Modelled as text
 * segments rather than an HTML string so the emphasis survives the move to a
 * Payload richText field without anyone hand-parsing markup.
 */
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

/**
 * Prospective Payload collection: `team`.
 *
 * `tier` separates the three leadership cards from the wider team grid, which
 * the design renders at different sizes.
 *
 * Only nine photographs exist — they were recovered from the design tool's
 * sidecar, where they lived as base64 rather than as files. The remaining
 * thirteen members render a monogram until the client supplies portraits.
 */
export const team: TeamMember[] = [
  {
    id: "jacques-von-benecke",
    name: "Jacques von Benecke",
    role: "Chief Executive Officer",
    tier: "leadership",
    photo: media("/media/team/jacques-von-benecke.webp", "Jacques von Benecke", 732, 412),
  },
  {
    id: "anand-acharya",
    name: "Anand Acharya",
    role: "Chief Product Officer",
    tier: "leadership",
    photo: media("/media/team/anand-acharya.webp", "Anand Acharya", 669, 732),
    photoPosition: "50% 62.6%",
  },
  {
    id: "pallavi-sharma",
    name: "Pallavi Sharma",
    role: "Chief Operations Officer",
    tier: "leadership",
    photo: media("/media/team/pallavi-sharma.webp", "Pallavi Sharma", 732, 732),
  },
  {
    id: "kinzang-dorji",
    name: "Kinzang Dorji",
    role: "Backend Developer",
    tier: "team",
    photo: media("/media/team/kinzang-dorji.webp", "Kinzang Dorji", 540, 540),
  },
  {
    id: "tshendu-gyeltshen",
    name: "Tshendu Gyeltshen",
    role: "Backend Developer",
    tier: "team",
    photo: media("/media/team/tshendu-gyeltshen.webp", "Tshendu Gyeltshen", 540, 540),
  },
  {
    id: "namgay-wangmo",
    name: "Namgay Wangmo",
    role: "Business Analyst",
    tier: "team",
    photo: media("/media/team/namgay-wangmo.webp", "Namgay Wangmo", 540, 405),
  },
  {
    id: "dev-raj-dungana",
    name: "Dev Raj Dungana",
    role: "DevOps Engineer",
    tier: "team",
    photo: media("/media/team/dev-raj-dungana.webp", "Dev Raj Dungana", 432, 540),
  },
  {
    id: "tshering-gyeltshen",
    name: "Tshering Gyeltshen",
    role: "Mobile App Developer",
    tier: "team",
    photo: media("/media/team/tshering-gyeltshen.webp", "Tshering Gyeltshen", 359, 540),
  },
  { id: "tshering-dawa", name: "Tshering Dawa", role: "Mobile App Developer", tier: "team" },
  { id: "tashi-namgay", name: "Tashi Namgay", role: "Backend Developer", tier: "team" },
  { id: "damcho-lhendup", name: "Damcho Lhendup", role: "Backend Developer", tier: "team" },
  { id: "hemanth-lepcha", name: "Hemanth Lepcha", role: "Backend Developer", tier: "team" },
  { id: "kinley-penjor", name: "Kinley Penjor", role: "Fullstack Developer", tier: "team" },
  { id: "kezang-loday", name: "Kezang Loday", role: "UI/UX Designer", tier: "team" },
  { id: "sanjeep-biswa", name: "Sanjeep Biswa", role: "Backend Developer", tier: "team" },
  { id: "biren-dahal", name: "Biren Dahal", role: "Business Analyst", tier: "team" },
  { id: "wangchuk", name: "Wangchuk", role: "Backend Developer", tier: "team" },
  { id: "sonam-tshomo", name: "Sonam Tshomo", role: "Media and PR Associate", tier: "team" },
  { id: "badal-khatiwara", name: "Badal Khatiwara", role: "Backend Developer", tier: "team" },
  {
    id: "kuenzang-pema-namgyel",
    name: "Kuenzang Pema Namgyel",
    role: "Business Analyst",
    tier: "team",
  },
  {
    id: "jigme-wangyel-wangchuk",
    name: "Jigme Wangyel Wangchuk",
    role: "Quality Assurance Engineer",
    tier: "team",
  },
];
