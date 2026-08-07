import type { FaqItem } from "./types";

/**
 * Prospective Payload collection: `faqs` — 26 entries.
 *
 * `audience` drives the two-tab segmented control. The search on the page
 * deliberately spans both tabs, so this is one collection with a facet
 * rather than two separate ones.
 */
export const faqs: FaqItem[] = [
  {
    id: "what-is-bhutan-ndi",
    audience: "users",
    question: "What is Bhutan NDI?",
    answer:
      "Bhutan NDI is the country's national digital identity, built on self-sovereign identity technology. Your credentials live in a wallet on your phone, and you decide what to share, with whom, and when.",
  },
  {
    id: "what-do-i-need-to-register",
    audience: "users",
    question: "What do I need to register?",
    answer:
      "A smartphone, the Bhutan NDI Wallet app, and your identity details. Registration happens once and takes a few minutes.",
  },
  {
    id: "how-do-i-get-the-wallet-app",
    audience: "users",
    question: "How do I get the wallet app?",
    answer:
      "Download Bhutan NDI Wallet from the Google Play Store or the Apple App Store, then follow the registration steps in the app.",
  },
  {
    id: "where-are-my-credentials-stored",
    audience: "users",
    question: "Where are my credentials stored?",
    answer:
      "In your wallet, on your device — not in a central database. That is what self-sovereign means: you hold the keys.",
  },
  {
    id: "what-happens-if-i-lose-my-phone",
    audience: "users",
    question: "What happens if I lose my phone?",
    answer:
      "Backup and recovery lets you restore your wallet on a new device. Set it up in the wallet settings as soon as you register.",
  },
  {
    id: "can-a-service-see-everything-in-my-wallet",
    audience: "users",
    question: "Can a service see everything in my wallet?",
    answer:
      "No. A service requests specific attributes; you review the request and approve or decline it. Only what you approve is shared.",
  },
  {
    id: "how-do-i-share-a-credential-with-a-service",
    audience: "users",
    question: "How do I share a credential with a service?",
    answer:
      "Scan the service's QR code or open the request in your wallet. You see exactly what is being asked for, then approve or decline.",
  },
  {
    id: "does-it-cost-anything-to-use",
    audience: "users",
    question: "Does it cost anything to use?",
    answer:
      "No. The wallet and your national digital identity credentials are free for citizens and residents.",
  },
  {
    id: "do-i-need-an-internet-connection",
    audience: "users",
    question: "Do I need an internet connection?",
    answer:
      "You need connectivity to receive a credential or respond to a request. The credentials themselves stay on your device.",
  },
  {
    id: "can-i-use-bhutan-ndi-outside-bhutan",
    audience: "users",
    question: "Can I use Bhutan NDI outside Bhutan?",
    answer:
      "The wallet works anywhere you have internet. Whether a credential is accepted abroad depends on the verifying organization.",
  },
  {
    id: "what-if-a-credential-is-wrong-or-out-of-date",
    audience: "users",
    question: "What if a credential is wrong or out of date?",
    answer:
      "Contact the organization that issued it. Issuers can revoke and reissue a credential; your wallet reflects the change.",
  },
  {
    id: "where-do-i-get-help",
    audience: "users",
    question: "Where do I get help?",
    answer:
      "Call the toll-free line 1199 or reach us through the contact page. Support is available for registration, recovery and credential issues.",
  },
  {
    id: "what-are-verifiable-credentials",
    audience: "orgs",
    question: "What are verifiable credentials?",
    answer:
      "A set of information an issuer claims to be true about the holder of the credential — cryptographically signed, so a verifier who trusts that issuer can check it without contacting them.",
  },
  {
    id: "what-are-decentralized-identifiers-dids",
    audience: "orgs",
    question: "What are Decentralized Identifiers (DIDs)?",
    answer:
      "Globally unique identifiers the subject controls, resolvable without a central registry. Each party in an interaction has its own DID and key material — for example did:ndi:0x7f3a…e91c.",
  },
  {
    id: "what-are-schemas",
    audience: "orgs",
    question: "What are schemas?",
    answer:
      "A schema defines the attributes a credential type contains and their data types. Issuers publish a schema once, then issue many credentials against it, so verifiers know what to expect.",
  },
  {
    id: "who-are-the-participants-in-a-trust-triangle",
    audience: "orgs",
    question: "Who are the participants in a trust triangle?",
    answer:
      "Three roles: the issuer who signs a credential, the holder who stores it in their wallet, and the verifier who requests and checks it. Trust flows from the verifier to the issuer, not through a central intermediary.",
  },
  {
    id: "what-are-digital-and-mobile-agents",
    audience: "orgs",
    question: "What are digital and mobile agents?",
    answer:
      "Software that acts for a party in the ecosystem — the mobile agent is the citizen's wallet; a cloud or digital agent runs on an organization's side to issue credentials, send proof requests and hold connections.",
  },
  {
    id: "what-are-connections",
    audience: "orgs",
    question: "What are connections?",
    answer:
      "A private, encrypted channel between two agents, established once and reused. Credentials and proof requests travel over that connection rather than over a public channel.",
  },
  {
    id: "how-do-dids-and-verifiable-credentials-relate",
    audience: "orgs",
    question: "How do DIDs and verifiable credentials relate?",
    answer:
      "The DID is the identifier and its keys; the credential is the signed statement. A credential references the issuer's DID and the holder's DID, which is how a verifier resolves the keys needed to check the signature.",
  },
  {
    id: "what-is-selective-disclosure",
    audience: "orgs",
    question: "What is selective disclosure?",
    answer:
      "Proving one fact from a credential without revealing the rest — that a person is over 18, for instance, without disclosing their date of birth.",
  },
  {
    id: "how-does-revocation-work",
    audience: "orgs",
    question: "How does revocation work?",
    answer:
      "An issuer can revoke a credential it has issued. Verifiers check revocation status at the moment of verification, so a withdrawn credential stops being accepted.",
  },
  {
    id: "how-does-my-organization-become-an-issuer-or-verifier",
    audience: "orgs",
    question: "How does my organization become an issuer or verifier?",
    answer:
      "Start with a business inquiry. We map your use case to the right services, accredit and onboard your organization, then support you from sandbox testing into production. See For Organizations.",
  },
  {
    id: "is-there-a-sandbox-environment",
    audience: "orgs",
    question: "Is there a sandbox environment?",
    answer:
      "Yes. Integration teams build and test against a sandbox with test credentials before any production issuance is enabled.",
  },
  {
    id: "what-standards-does-the-platform-follow",
    audience: "orgs",
    question: "What standards does the platform follow?",
    answer:
      "Open SSI standards — W3C Decentralized Identifiers and Verifiable Credentials, with Hyperledger Aries protocols for agent-to-agent messaging — so credentials remain interoperable beyond Bhutan.",
  },
  {
    id: "what-data-does-my-organization-have-to-store",
    audience: "orgs",
    question: "What data does my organization have to store?",
    answer:
      "Far less than before. You hold your own records and the connection to the holder; personal attributes stay in the citizen's wallet and are requested only when needed.",
  },
  {
    id: "what-support-do-we-get-during-integration",
    audience: "orgs",
    question: "What support do we get during integration?",
    answer:
      "Technical documentation, sandbox access, schema design guidance and a named contact through onboarding, testing and go-live.",
  },
];

export const faqAudiences = [
  { id: "users", label: "For users" },
  { id: "orgs", label: "For organizations" },
] as const;
