import type {
  GovernanceBullet,
  GovernanceChapter,
  GovernanceOffence,
  GovernanceSpec,
  InstitutionalBody,
  TocEntry,
} from "./types";

/**
 * Governance content.
 *
 * The requirement docs are explicit that this page's content is mandated and
 * must not be reworded — "No content changes, government content is mandated
 * and includes the NDI act." It is reproduced verbatim, and in Phase 2 this
 * should be a locked-down or non-editable collection.
 */

export const governanceIntro =
  "Bhutan NDI Governance Framework is a family of legislative documents. The National Digital Identity Act of Bhutan 2023 is the mother of legislation for the framework.";

export const governanceStatus = ["In force 2023-07-24", "13 chapters · 160 sections"];

/**
 * The full Act.
 *
 * NOTE for Phase 2: this points at the old Amplify **staging** S3 bucket. It
 * will break when that stack is decommissioned — the PDF should be re-hosted
 * as a CMS media asset.
 */
export const actPdfUrl =
  "https://ndi-website-17-07-2023-storage-4b404e2160703-staging.s3.ap-southeast-1.amazonaws.com/public/governance-framework/National-Digital-Identity-Act-of-Bhutan-2023.pdf";

export const governanceToc: TocEntry[] = [
  { href: "#act", label: "Bhutan NDI Act" },
  { href: "#purpose", label: "Purpose & application" },
  { href: "#institutions", label: "Institutional framework" },
  { href: "#framework", label: "What the framework specifies" },
  { href: "#standards", label: "Interoperability & standards" },
  { href: "#privacy", label: "Privacy & data residency" },
  { href: "#offences", label: "Offences & penalties" },
  { href: "#chapters", label: "Chapters" },
];

export const actBody =
  "Bhutan NDI Governance Framework is a family of legislative documents. The National Digital Identity Act of Bhutan 2023 (NDI Act 2023) is the mother of legislation for the NDI Governance Framework. NDI Act 2023 is a historic act passed by the parliament of Bhutan and subsequently granted Royal Assent by His Majesty The King. The Act empowers and also details the roles and functions of entities utilising the NDI ecosystem. Granular roles and functions are detailed in the NDI Governance Framework documents as empowered to do so by the Act.";

export const actPdfNote =
  "Dzongkha and English in one PDF. Each text is equally authoritative; where the two differ in meaning the courts reconcile them.";

export const purposeBullets: GovernanceBullet[] = [
  { text: "Provide for a National Digital Identity Infrastructure that is innovative" },
  { text: "Encourage the use of digital credentials or data" },
  { text: "Support digital trust between Issuers, Holders and Verifiers" },
  { text: "Achieve environmental, social, governance and sustainability objectives" },
  { text: "Enhance privacy and security of digital credentials and data" },
];

export const purposeApplication =
  "It applies to the Governing Body and Administrative Body, Issuers, Holders and Verifiers, Trust Service Providers, and all digital credentials and data recognised under it — extending beyond Bhutan's territorial jurisdiction.";

export const institutionalBodies: InstitutionalBody[] = [
  {
    id: "governing-body",
    label: "Governing Body",
    subtitle: "Five members — approval and oversight",
    paragraphs: [
      "The head of the Government Technology Agency, two civil servants nominated by the Lhengye Zhungtshog, and two independent members nominated by GovTech. The Chairperson is elected from among the members; a term runs four years and is renewable.",
      "Approves the Governance Framework and the Infrastructure, monitors the Administrative Body's compliance, approves on-boarding and registration regulations, and recognises foreign electronic identification schemes.",
    ],
    ref: "§5–§10",
  },
  {
    id: "administrative-body",
    label: "Administrative Body",
    subtitle: "The National Digital Identity Company",
    paragraphs: [
      "Develops and implements the Governance Framework and the operational infrastructure, registers and regulates Trust Service Providers, operates or directs Trust Registries, guides entities on credentials and data, and monitors compliance. Its head serves as non-voting Member Secretary of the Governing Body.",
    ],
    ref: "§11–§13",
  },
];

export const frameworkSpecs: GovernanceSpec[] = [
  {
    id: "standards-procedures",
    title: "Standards & procedures",
    description: "What public and private entities follow when providing or availing services.",
  },
  {
    id: "rights-obligations",
    title: "Rights & obligations",
    description: "Of every entity operating under the Act.",
  },
  {
    id: "credential-schemes",
    title: "Credential schemes",
    description: "The foundational credential, its use, and formats for digital credentials.",
  },
  {
    id: "collection-disclosure",
    title: "Collection & disclosure",
    description: "Requirements governing the use and disclosure of credentials and data.",
  },
  {
    id: "trust-services",
    title: "Trust services",
    description: "The services to be provided by Trust Service Providers.",
  },
  {
    id: "conformance-audit",
    title: "Conformance audit",
    description: "Requirements for audit; the Governing Body appoints Auditors.",
    ref: "§152",
  },
];

export const standardsParagraphs: GovernanceBullet[] = [
  {
    text: "The Infrastructure is technology-neutral: any implementation that meets the requirements of the Act qualifies. The Governing Body directs the use of open public specifications from globally accepted standards bodies, and publishes its own specification only where no open standard exists.",
    ref: "§19–§24",
  },
  {
    text: "A decentralised public key infrastructure removes dependency on a central authority, supports decentralised identifier methods with cryptographic agility, and produces certificates with the same legal effect as those from a qualified Certificate Authority.",
    ref: "§30–§38",
  },
];

export const privacyBullets: GovernanceBullet[] = [
  {
    text: "Globally accepted information security and privacy assurance standards apply to all credentials and data under the Act.",
    ref: "§61–62",
  },
  {
    text: "Every party handling data — including Verifiers, Trust Service Providers, Guardians and Controllers — is accountable for its secrecy.",
    ref: "§63",
  },
  {
    text: "The Infrastructure is designed so credentials and data can reside within the jurisdiction of Bhutan.",
    ref: "§115",
  },
  {
    text: "Identity fraud and cyber-security incidents must be notified to the Administrative Body within the period set by the Governance Framework.",
    ref: "§118",
  },
  {
    text: "Credentials and data are portable between Digital Wallets and their associated Agents.",
    ref: "§66",
  },
];

export const offences: GovernanceOffence[] = [
  { id: "damage", offence: "Damaging the National Digital Identity Infrastructure", grade: "Felony · 3rd degree" },
  { id: "tamper", offence: "Tampering with Trust Registries", grade: "Felony · 3rd degree" },
  { id: "intercept", offence: "Unauthorised interception of digital credentials", grade: "Felony · 4th degree" },
  { id: "disclose", offence: "Unlawful disclosure of credentials", grade: "Felony · 4th degree" },
  { id: "theft", offence: "Identity theft", grade: "Felony · 4th degree" },
  { id: "interfere", offence: "Deliberate interference", grade: "Misdemeanour" },
  { id: "nonconformance", offence: "Non-conformance to the on-boarding process", grade: "Petty misdemeanour" },
];

export const actChapters: GovernanceChapter[] = [
  { number: "01", title: "Preliminary" },
  { number: "02", title: "Institutional Framework" },
  { number: "03", title: "Governance Framework, Interoperability & Policies" },
  { number: "04", title: "Decentralised Public Key Infrastructure" },
  { number: "05", title: "Digital Credentials" },
  { number: "06", title: "Digital Wallets & Digital Agents" },
  { number: "07", title: "Trust Service Providers" },
  { number: "08", title: "Certification & Revocation" },
  { number: "09", title: "Digital Guardianship & Controllership" },
  { number: "10", title: "Data Residency & Information Security" },
  { number: "11", title: "Cross-Border Recognition" },
  { number: "12", title: "Offences & Penalties" },
  { number: "13", title: "Miscellaneous" },
];
