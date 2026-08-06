import type { ServiceOption } from "./types";

/**
 * Prospective Payload collection: `services` — the contact form's
 * "Service or product of interest" dropdown.
 *
 * Note for Phase 2: the Organizations prototype carries a slightly different
 * 11-item list for the same field. Both forms should be driven from this one
 * collection once the canonical taxonomy is confirmed.
 */
export const services: ServiceOption[] = [
  { id: "wallet", label: "NDI Wallet — for citizens" },
  { id: "remote-onboarding", label: "Remote onboarding & account opening" },
  { id: "ekyc", label: "eKYC & identity verification" },
  { id: "passwordless", label: "Passwordless authentication" },
  { id: "access-management", label: "Access management" },
  { id: "digital-signature", label: "Digital signature" },
  { id: "in-app-otp", label: "In-app OTP" },
  { id: "verifier-app", label: "Mobile verifier app" },
  { id: "credential-issuance", label: "Credential issuance (become an issuer)" },
  { id: "developer-apis", label: "Developer APIs & integration" },
  { id: "other", label: "Something else" },
];

/** The audience chips above the form. */
export const contactAudiences = [
  { id: "citizen", label: "Citizen" },
  { id: "organization", label: "Organization" },
  { id: "developer", label: "Developer" },
] as const;

export type ContactAudienceId = (typeof contactAudiences)[number]["id"];
