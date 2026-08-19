import { media } from "@/lib/media";

import type { HeroStat, JourneyChapter, StartStep, UserBenefit, UserUseCase } from "./types";

export const userHeroStats: HeroStat[] = [
  { id: "services", value: "120+", label: "Services connected" },
  { id: "wallet", value: "1 wallet", label: "All your credentials" },
  { id: "passwords", value: "0 passwords", label: "To remember" },
];

/**
 * The credential fan in the hero.
 *
 * Fan geometry is per-card data straight from the design: the middle card is
 * wider, sits fully opaque and stacks above the two flanking cards, which are
 * rotated outward, pulled inward to overlap, and held slightly back at 0.85.
 *
 * The artwork is opaque, not transparent: its rounded corners are painted white
 * rather than cut out, so the corners have to be clipped in CSS or four white
 * crescents show against the page.
 */
/**
 * Radius of the CSS clip that removes the artwork's painted-white corners, as a
 * fraction of the card's width.
 *
 * Not simply the painted radius. The artwork's corner is a squircle — Figma's
 * smooth corner — which runs further along the edges than a circle through the
 * same points: white reaches 70px in along the top edge of the 1500px card,
 * where a 68px circular corner would have ended it at 42px. Clipping at the
 * apparent radius therefore left a white crescent at every corner.
 *
 * 0.053 is the smallest circular radius that covers the whole painted region
 * (79px of 1500, against the 77px solved from the measured profile, plus a
 * little for the artwork's own anti-aliased edge). It costs about 2px of the
 * card's corner at full size, which is invisible; a surviving white crescent
 * was not.
 */
export const cardCornerRatio = 0.053;

export const credentialCards = [
  {
    id: "drivers-license",
    image: media("/media/cards/drivers-license.webp", "Driver's License credential", 1500, 900),
    width: "clamp(190px, 26vw, 350px)",
    rotate: -9,
    translateX: "2.5%",
    opacity: 0.85,
    z: 1,
  },
  {
    id: "foundational-id",
    image: media("/media/cards/foundational-id.webp", "Foundational ID credential", 1500, 900),
    width: "clamp(205px, 28vw, 370px)",
    rotate: 0,
    translateX: "0px",
    opacity: 1,
    z: 3,
  },
  {
    id: "bank-account",
    image: media("/media/cards/bank-account.webp", "Bank Account credential", 1500, 900),
    width: "clamp(190px, 26vw, 350px)",
    rotate: 9,
    translateX: "-2.5%",
    opacity: 0.85,
    z: 2,
  },
];

/**
 * Prospective Payload collection: `userUseCases`.
 *
 * `gridArea` is the bento placement from the design — layout is per-item data
 * here, so it travels with the record rather than being hard-coded in the page.
 */
export const userUseCases: UserUseCase[] = [
  {
    id: "bank-account",
    title: "Open a bank account online",
    description:
      "Complete identity verification and remote onboarding with banks — automated compliance, no repeated paperwork.",
    icon: "building",
    gridArea: "1 / 1 / 2 / 5",
    tutorialHref: "#",
  },
  {
    id: "access-services",
    title: "Securely access services",
    description:
      "Sign in to online services with your verified credentials. Passwordless, with nothing to submit twice.",
    icon: "lock",
    gridArea: "2 / 1 / 3 / 5",
    tutorialHref: "#",
  },
  {
    id: "sign-documents",
    title: "Digitally sign documents",
    description: "Sign and verify documents digitally for faster, paperless transactions.",
    icon: "penLine",
    gridArea: "1 / 5 / 3 / 8",
    tutorialHref: "#",
  },
  {
    id: "authenticate",
    title: "Digitally authenticate yourself",
    description:
      "Share trusted identity information whenever verification is required, while keeping control of your personal data.",
    icon: "fingerprint",
    gridArea: "1 / 8 / 2 / 13",
  },
  {
    id: "share-credentials",
    title: "Share verified credentials",
    description:
      "Collect, store and present verified credentials straight from your wallet, whenever they are required.",
    icon: "shieldCheck",
    gridArea: "2 / 8 / 3 / 13",
  },
];

/**
 * The pinned "Dechen's journey" scrollytelling chapters.
 *
 * `anchor` is the horizontal position along the strip, 0–1, that this chapter
 * settles on — placed at the centre of the screen, and clamped at both ends, so
 * anything inside half a screen-width of an edge (about 0.07 here) resolves to
 * that edge.
 *
 * These are measured off the artwork rather than inherited, and re-measured
 * whenever the strip's framing changes — the fractions mean nothing on their
 * own. The strip now runs to its full 14020px ending, so every value moved:
 * against the previous 9095px cut they sat about 1.54x too far right, which
 * would have parked chapter 01 in the middle of the office run.
 *
 * Measured by framing the visible window (one screen = 1/11.04 of the strip)
 * at each candidate and checking what it holds:
 *   01 the graduation figure · 02 the two application desks · 03 the office
 *   run into the columned government building · 04 the drained-battery scenes
 *   with the cost-and-time note · 05 the QR scan and the credential screen ·
 *   06 the "employment credentials in the wallet" note and the Employee ID
 *   card · 07 the wallet sharing selected credentials · 08 "THE END"
 *
 * 05 to 06 is the long glide, crossing the document-flow and hiring montage
 * without holding on it. That is deliberate: those frames carry no caption of
 * their own, and they read well as travel between the two beats that do.
 */
export const journeyChapters: JourneyChapter[] = [
  { id: "graduation", step: "01", title: "Graduation", anchor: 0.03, caption: "Dechen finishes her degree. Everything that comes next will ask her to prove who she is." },
  { id: "applications", step: "02", title: "The applications", anchor: 0.10, caption: "Job forms, bank forms, campus forms — the same documents photocopied again and again." },
  { id: "counters", step: "03", title: "Counter to counter", anchor: 0.225, caption: "Offices across Thimphu, queues and stamps, and a trip back for the one paper she forgot." },
  { id: "wall", step: "04", title: "The wall", anchor: 0.33, caption: "Weeks lost to verification. Her identity sits in filing cabinets she cannot reach." },
  { id: "ndi", step: "05", title: "Bhutan NDI", anchor: 0.46, caption: "She downloads the wallet. Her foundational ID is issued to her phone, held only by her." },
  { id: "issued", step: "06", title: "Credentials, issued", anchor: 0.72, caption: "Degree, census, licence — signed by the issuer, tamper-proof, and stored with her." },
  { id: "consent", step: "07", title: "Consent, not copies", anchor: 0.825, caption: "A scan and a tap. She shares only the fields a service asks for — and nothing else." },
  { id: "paperless", step: "08", title: "The end of paperwork", anchor: 0.92, caption: "120+ services, minutes instead of weeks. Dechen’s identity finally belongs to Dechen." },
];

/**
 * The illustrated strip, 14020×814 — the complete original.
 *
 * Earlier cuts stopped at 64.87%, mid-handshake, so the journey never arrived
 * anywhere: the wallet filling up, the consent hand-off and the "THE END" card
 * with the NDI mark were all simply absent. This is the whole illustration.
 *
 * That takes the aspect ratio from 11.17:1 to 17.22:1, so the strip lays out
 * about 7150px wide inside a ~648px screen. The anchors above are measured
 * against this width and do not survive a re-crop — see the note there.
 *
 * Served directly rather than through next/image — see DechenJourney.
 */
export const journeyStrip = media(
  "/media/company/journey-strip.webp",
  "Dechen's journey, from paperwork to a digital wallet",
  14020,
  814,
);

export const userBenefits: UserBenefit[] = [
  { id: "convenience", title: "Convenience", description: "Complete transactions faster through digital verification and streamlined processes.", icon: "zap" },
  { id: "security", title: "Security", description: "Trusted identity verification and secure authentication protect every interaction.", icon: "shieldCheck" },
  { id: "privacy", title: "Privacy & control", description: "Consent-based sharing: only the information a specific service needs leaves your wallet.", icon: "eyeOff" },
  { id: "paperless", title: "Paperless", description: "Digital verification replaces physical documents and repeated photocopies.", icon: "fileCheck" },
  { id: "trust", title: "Trust", description: "Credentials are issued by trusted sources, so services can rely on them immediately.", icon: "shieldAlert" },
];

export const startSteps: StartStep[] = [
  { number: "01", text: "Download the Bhutan NDI Wallet" },
  { number: "02", text: "Register and verify your identity" },
  { number: "03", text: "Start accessing connected services" },
];
