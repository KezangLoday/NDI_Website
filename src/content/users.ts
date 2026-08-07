import { media } from "@/lib/media";

import type { HeroStat, JourneyChapter, StartStep, UserBenefit, UserUseCase } from "./types";

export const userHeroStats: HeroStat[] = [
  { id: "services", value: "120+", label: "Services connected" },
  { id: "wallet", value: "1 wallet", label: "All your credentials" },
  { id: "passwords", value: "0 passwords", label: "To remember" },
];

/** The credential fan behind the hero. */
export const credentialCards = [
  { id: "drivers-license", image: media("/media/cards/drivers-license.png", "Driver's licence credential", 300, 180), rotate: -9 },
  { id: "foundational-id", image: media("/media/cards/foundational-id.png", "Foundational ID credential", 300, 180), rotate: 0 },
  { id: "bank-account", image: media("/media/cards/bank-account.png", "Bank account credential", 300, 180), rotate: 9 },
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
 * settles on. The values come straight from the prototype.
 */
export const journeyChapters: JourneyChapter[] = [
  { id: "graduation", step: "01", title: "Graduation", anchor: 0.045, caption: "Dechen finishes her degree. Everything that comes next will ask her to prove who she is." },
  { id: "applications", step: "02", title: "The applications", anchor: 0.108, caption: "Job forms, bank forms, campus forms — the same documents photocopied again and again." },
  { id: "counters", step: "03", title: "Counter to counter", anchor: 0.205, caption: "Offices across Thimphu, queues and stamps, and a trip back for the one paper she forgot." },
  { id: "wall", step: "04", title: "The wall", anchor: 0.335, caption: "Weeks lost to verification. Her identity sits in filing cabinets she cannot reach." },
  { id: "ndi", step: "05", title: "Bhutan NDI", anchor: 0.45, caption: "She downloads the wallet. Her foundational ID is issued to her phone, held only by her." },
  { id: "issued", step: "06", title: "Credentials, issued", anchor: 0.565, caption: "Degree, census, licence — signed by the issuer, tamper-proof, and stored with her." },
  { id: "consent", step: "07", title: "Consent, not copies", anchor: 0.675, caption: "A scan and a tap. She shares only the fields a service asks for — and nothing else." },
  { id: "paperless", step: "08", title: "The end of paperwork", anchor: 0.9, caption: "120+ services, minutes instead of weeks. Dechen’s identity finally belongs to Dechen." },
];

/** 14020×814. Served directly rather than through next/image — see the page. */
export const journeyStrip = media(
  "/media/company/journey-strip.webp",
  "Dechen's journey, from paperwork to a digital wallet",
  14020,
  814,
);

export const userBenefits: UserBenefit[] = [
  { id: "convenience", title: "Convenience", description: "Complete transactions faster through digital verification and streamlined processes.", icon: "rotateCcw" },
  { id: "security", title: "Security", description: "Trusted identity verification and secure authentication protect every interaction.", icon: "shieldCheck" },
  { id: "privacy", title: "Privacy & control", description: "Consent-based sharing: only the information a specific service needs leaves your wallet.", icon: "lockRounded" },
  { id: "paperless", title: "Paperless", description: "Digital verification replaces physical documents and repeated photocopies.", icon: "fileText" },
  { id: "trust", title: "Trust", description: "Credentials are issued by trusted sources, so services can rely on them immediately.", icon: "link" },
];

export const startSteps: StartStep[] = [
  { number: "01", text: "Download the Bhutan NDI Wallet" },
  { number: "02", text: "Register and verify your identity" },
  { number: "03", text: "Start accessing connected services" },
];
