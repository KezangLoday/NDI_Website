import type { Capability, UseCase, WalletBenefit } from "./types";

/** Prospective Payload collection: `useCases` — the "What you can do" cards. */
export const useCases: UseCase[] = [
  {
    id: "open-bank-account",
    title: "Open a bank account online",
    description:
      "Complete remote onboarding and eKYC with financial institutions — no branch visit.",
    icon: "building",
  },
  {
    id: "authenticate-identity",
    title: "Authenticate your identity",
    description: "Prove who you are digitally, sharing only what's needed.",
    icon: "fingerprint",
  },
  {
    id: "access-services",
    title: "Securely access services",
    description: "A passwordless, one-tap login to public and private services.",
    icon: "lock",
  },
  {
    id: "sign-documents",
    title: "Digitally sign documents",
    description: "Sign and verify documents with legally trusted digital signatures.",
    icon: "penLine",
  },
];

/** Prospective Payload collection: `capabilities` — the six spotlight cards. */
export const capabilities: Capability[] = [
  {
    id: "secure-authentication",
    title: "Secure authentication",
    description: "Access digital services securely using your trusted identity credentials.",
    icon: "signalAuth",
  },
  {
    id: "verified-credentials",
    title: "Verified credentials",
    description: "Receive, store, and share verified information directly from your wallet.",
    icon: "shieldCheck",
  },
  {
    id: "digital-signatures",
    title: "Digital signatures",
    description: "Sign and verify documents digitally with complete confidence.",
    icon: "penLine",
  },
  {
    id: "secure-connections",
    title: "Secure connections",
    description: "Establish trusted digital interactions between people and organizations.",
    icon: "link",
  },
  {
    id: "backup-recovery",
    title: "Backup & recovery",
    description: "Safeguard your wallet and recover access securely whenever needed.",
    icon: "rotateCcw",
  },
  {
    id: "privacy-by-design",
    title: "Privacy by design",
    description:
      "Selective disclosure means you share only what a service needs — nothing more.",
    icon: "lockRounded",
  },
];

/** Global: the benefits listed beside the user-guide video. */
export const walletBenefits: WalletBenefit[] = [
  { id: "control", text: "Higher control over your personal data" },
  { id: "protection", text: "Protection of sensitive information from unauthorised access" },
  { id: "need-to-know", text: "Credential sharing on a need-to-know basis" },
  { id: "streamlined", text: "Streamlined and efficient digital interactions" },
  { id: "platforms", text: "Access to different platforms and services through the wallet" },
];
