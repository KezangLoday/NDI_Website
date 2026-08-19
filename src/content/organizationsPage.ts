import { media } from "@/lib/media";
import type { HeroPill, OrgService, PipelineStep, ServiceOption, WhyPartnerRow } from "./types";

/**
 * The hero's product shot: the wallet's credential list, with the credentials
 * themselves fanning out of it.
 *
 * Cropped from a 2000x2000 export whose subject occupied 27% of the canvas —
 * the rest was transparent padding, which would have made the layout box square
 * and the sizing guesswork. Trimmed to the alpha bounding box plus 6px, so the
 * element's box is the picture.
 */
export const orgHeroImage = media(
  "/media/org-hero-credentials.webp",
  "The Bhutan NDI wallet's credential list, with issued credentials fanning out of it",
  1874,
  1600,
);

export const orgHeroPills: HeroPill[] = [
  { id: "ekyc", label: "eKYC", sublabel: "Compliance ready" },
  { id: "passwordless", label: "Passwordless", sublabel: "Authentication" },
  { id: "verifiable", label: "Verifiable", sublabel: "Credentials & signatures" },
  { id: "sandbox", label: "Sandbox", sublabel: "Test before you launch" },
];

/**
 * Prospective Payload collection: `orgServices`.
 *
 * The requirement docs asked for Organizations and Value Added Services to be
 * merged and each entry restructured as Service → Use case → Benefit, which is
 * exactly this shape. `tier` keeps the core and advanced groupings.
 */
export const orgServices: OrgService[] = [
  {
    id: "remote-onboarding",
    tier: "core",
    title: "Remote onboarding & account opening",
    useCase:
      "Customers complete onboarding digitally through secure identity verification and eKYC.",
    value: "Less paperwork, lower operational cost, shorter processing time.",
    icon: "building",
  },
  {
    id: "ekyc",
    tier: "core",
    title: "eKYC & identity verification",
    useCase:
      "Verify customer identity using trusted credentials issued in the Bhutan NDI ecosystem.",
    value: "Supports compliance and removes manual verification steps.",
    icon: "shieldCheck",
  },
  {
    id: "passwordless",
    tier: "core",
    title: "Passwordless authentication",
    useCase: "Users sign in to your services securely without managing multiple passwords.",
    value: "Stronger security and fewer support requests at the same time.",
    icon: "fingerprint",
  },
  {
    id: "access-management",
    tier: "core",
    title: "Access management",
    useCase:
      "Manage access and permissions using verified identities and credential-based authorization.",
    value: "Right people, right systems — provable at any time.",
    icon: "lock",
  },
  {
    id: "digital-signature",
    tier: "core",
    title: "Digital signature",
    useCase: "Legally verifiable, paperless document signing and verification.",
    value: "Faster approvals and secure transactions without courier or print costs.",
    icon: "penLine",
  },
  {
    id: "biometric-liveness",
    tier: "advanced",
    title: "Biometric liveness validation",
    useCase: "Confirm the rightful individual is present during high-assurance transactions.",
    icon: "user",
  },
  {
    id: "in-app-otp",
    tier: "advanced",
    title: "In-app OTP",
    useCase:
      "An extra layer of authentication delivered inside the NDI Wallet for sensitive actions.",
    icon: "signalAuth",
  },
  {
    id: "verifier-app",
    tier: "advanced",
    title: "Mobile verifier app",
    useCase: "Verify identities instantly at events, venues, counters and access points.",
    icon: "search",
  },
  {
    id: "image-verification",
    tier: "advanced",
    title: "Image-based credential verification",
    useCase: "Visual identity checks using secure, wallet-held photo credentials.",
    icon: "fileText",
  },
  {
    id: "secure-p2p",
    tier: "advanced",
    title: "Secure peer-to-peer communication",
    useCase:
      "Trusted messaging between individuals, businesses and institutions in the ecosystem.",
    icon: "link",
  },
];

export const whyPartnerRows: WhyPartnerRow[] = [
  {
    id: "trusted-identity",
    number: "01",
    title: "Trusted digital identity",
    tag: "Gov-backed",
    description: "Government-backed identity infrastructure underpins every interaction.",
  },
  {
    id: "customer-experience",
    number: "02",
    title: "Improved customer experience",
    tag: "Onboarding",
    description: "Shorter onboarding and simpler access to your services.",
  },
  {
    id: "compliance",
    number: "03",
    title: "Regulatory compliance",
    tag: "KYC / AML",
    description: "Supports KYC, AML and related requirements through trusted verification.",
  },
  {
    id: "security",
    number: "04",
    title: "Enhanced security",
    tag: "Auth",
    description: "Strong authentication and verifiable credentials protect digital interactions.",
  },
  {
    id: "efficiency",
    number: "05",
    title: "Operational efficiency",
    tag: "Automation",
    description: "Fewer manual processes, less paperwork, lower administrative overhead.",
  },
];

/** The four-step integration path. Already the cleanest structured data in the bundle. */
export const pipeline: PipelineStep[] = [
  {
    code: "01",
    title: "Enquire",
    tag: "Scoping",
    body: "Tell us your use case. Our solutions team maps it to the right combination of NDI services and flags anything that needs a policy review.",
    input: "A short description of your use case",
    output: "A scoped service list and integration plan",
    owners: "Your product lead + NDI solutions team",
  },
  {
    code: "02",
    title: "Onboard",
    tag: "Agreement",
    body: "Sign the partnership agreement and receive the credentials your organization needs to act as an issuer, a verifier, or both.",
    input: "Organization details and signatories",
    output: "Signed agreement and organization credentials",
    owners: "Your legal and admin teams",
  },
  {
    code: "03",
    title: "Integrate",
    tag: "Build",
    body: "Build against the sandbox with your engineers and our support. Test issuance, verification and authentication flows end to end before release.",
    input: "Engineering time and test scenarios",
    output: "A working sandbox integration",
    owners: "Your engineers + NDI integration support",
  },
  {
    code: "04",
    title: "Go live",
    tag: "Production",
    body: "Move to production, monitor usage on your dashboard, and expand to further services as your needs grow.",
    input: "Release sign-off",
    output: "Production access and usage dashboard",
    owners: "Your operations team",
  },
];

/**
 * The inquiry form's dropdown.
 *
 * NOTE: this differs from the home page's list — that one offers the citizen
 * wallet and developer APIs, this one ends with "Not sure yet". Both should be
 * driven from one canonical `services` collection once the taxonomy is agreed.
 */
export const orgServiceOptions: ServiceOption[] = [
  ...orgServices.map((service) => ({ id: service.id, label: service.title })),
  { id: "not-sure", label: "Not sure yet — advise us" },
];
