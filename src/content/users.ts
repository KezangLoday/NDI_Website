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
 */
export const credentialCards = [
  {
    id: "drivers-license",
    image: media("/media/cards/drivers-license.png", "Driver's License credential", 300, 180),
    width: "clamp(190px, 26vw, 350px)",
    rotate: -9,
    translateX: "2.5%",
    opacity: 0.85,
    z: 1,
  },
  {
    id: "foundational-id",
    image: media("/media/cards/foundational-id.png", "Foundational ID credential", 300, 180),
    width: "clamp(205px, 28vw, 370px)",
    rotate: 0,
    translateX: "0px",
    opacity: 1,
    z: 3,
  },
  {
    id: "bank-account",
    image: media("/media/cards/bank-account.png", "Bank Account credential", 300, 180),
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
 * These are measured off the artwork rather than inherited: the values from the
 * prototype belonged to the older, wider strip, and against the current one
 * they drifted a whole beat out of step — chapter 05, where Dechen downloads
 * the wallet, was landing on her slumped over a laptop with a draining battery,
 * two scenes before the app appears. Re-measure them against any new strip.
 */
export const journeyChapters: JourneyChapter[] = [
  { id: "graduation", step: "01", title: "Graduation", anchor: 0.03, caption: "Dechen finishes her degree. Everything that comes next will ask her to prove who she is." },
  { id: "applications", step: "02", title: "The applications", anchor: 0.14, caption: "Job forms, bank forms, campus forms — the same documents photocopied again and again." },
  { id: "counters", step: "03", title: "Counter to counter", anchor: 0.36, caption: "Offices across Thimphu, queues and stamps, and a trip back for the one paper she forgot." },
  { id: "wall", step: "04", title: "The wall", anchor: 0.5, caption: "Weeks lost to verification. Her identity sits in filing cabinets she cannot reach." },
  { id: "ndi", step: "05", title: "Bhutan NDI", anchor: 0.7, caption: "She downloads the wallet. Her foundational ID is issued to her phone, held only by her." },
  { id: "issued", step: "06", title: "Credentials, issued", anchor: 0.8, caption: "Degree, census, licence — signed by the issuer, tamper-proof, and stored with her." },
  { id: "consent", step: "07", title: "Consent, not copies", anchor: 0.885, caption: "A scan and a tap. She shares only the fields a service asks for — and nothing else." },
  { id: "paperless", step: "08", title: "The end of paperwork", anchor: 0.96, caption: "120+ services, minutes instead of weeks. Dechen’s identity finally belongs to Dechen." },
];

/**
 * The illustrated strip, 5000×290.
 *
 * The strip is drawn at 114% of the screen's height, so its rendered width is
 * set by its aspect ratio: at 11.17:1 it lays out about 4830px wide inside a
 * ~675px screen. The source is 2000px, so it is being upscaled ~2.4x — soft,
 * and worth replacing with the full-resolution original when it is to hand.
 * Served directly rather than through next/image — see DechenJourney.
 */
export const journeyStrip = media(
  "/media/company/journey-strip.webp",
  "Dechen's journey, from paperwork to a digital wallet",
  2000,
  179,
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
