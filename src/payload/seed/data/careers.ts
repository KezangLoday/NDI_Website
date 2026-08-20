import type { SeedJob } from "./types";

/** Prospective Payload collection: `jobs`. */
export const jobs: SeedJob[] = [
  {
    id: "senior-backend-engineer",
    slug: "senior-backend-engineer",
    department: "Engineering",
    level: "Senior",
    title: "Senior Backend Engineer",
    summary: "Credential issuance and verification services at national scale.",
    location: "Thimphu",
    employmentType: "Full time",
    slots: 2,
    postedAt: "2026-08-03",
    closesAt: "2026-09-12",
    about:
      "You will own the services that issue and verify credentials for the whole country — the ledger writes, the revocation checks and the APIs every partner integrates against. The work is measured in uptime and in the number of citizens who never have to think about it.",
    sections: [
      {
        heading: "Duties and responsibilities",
        items: [
          "Design, build and operate the issuance and verification services, to an availability target of 99.9%.",
          "Own the data model for credentials, revocation and audit, and its migrations.",
          "Review the integration work of partner banks, agencies and telecoms before it reaches production.",
          "Carry the on-call rota with the rest of the platform team, one week in four.",
          "Write the runbooks and the post-incident reports, and see the actions through.",
        ],
      },
      {
        heading: "Eligibility",
        items: [
          "Class X and Class XII marks above 70% in each.",
          "A bachelor's degree with an aggregate above 60%, in a field relevant to this role.",
          "Bhutanese citizenship, with a valid CID.",
          "A Security Clearance Certificate valid through the recruitment period.",
          "No pending disciplinary or legal proceedings.",
          "At least five years building production backend services, two of them on systems handling personal data."
        ],
      },
      {
        heading: "Desirable",
        items: [
          "Working knowledge of verifiable credentials, DIDs or a comparable trust framework.",
          "Experience of a national or sector-wide system with external integrators.",
          "Dzongkha and English both used comfortably in writing.",
        ],
      },
      {
        heading: "What we offer",
        items: [
          "A pay band set against the civil service scale, with a technology allowance on top.",
          "Provident fund, gratuity and medical cover for you and your dependants.",
          "A training budget each year, and time set aside to use it.",
          "Flexible hours around a core of 10:00 to 16:00, and two days a week from home.",
        ],
      },
    ],
  },
  {
    id: "mobile-engineer-wallet",
    slug: "mobile-engineer-wallet",
    department: "Engineering",
    level: "Mid to senior",
    title: "Mobile Engineer — Wallet",
    summary: "Own wallet flows: consent, credentials, backup and recovery.",
    location: "Thimphu",
    employmentType: "Full time",
    slots: 1,
    postedAt: "2026-07-28",
    closesAt: "2026-08-28",
    about:
      "The wallet is where most citizens meet Bhutan NDI, and often the only part they ever see. You will own the flows that decide whether they trust it: granting consent, holding credentials, and getting an account back when a phone is lost.",
    sections: [
      {
        heading: "Duties and responsibilities",
        items: [
          "Build and maintain the consent, credential and recovery flows on both iOS and Android.",
          "Keep key material in the platform's secure enclave, and prove it in review.",
          "Work with design on flows that have to be understood by someone using a smartphone for the first time.",
          "Instrument the funnels, and take the drop-offs seriously.",
          "Support release, staged rollout and rollback.",
        ],
      },
      {
        heading: "Eligibility",
        items: [
          "Class X and Class XII marks above 70% in each.",
          "A bachelor's degree with an aggregate above 60%, in a field relevant to this role.",
          "Bhutanese citizenship, with a valid CID.",
          "A Security Clearance Certificate valid through the recruitment period.",
          "No pending disciplinary or legal proceedings.",
          "At least three years shipping a production mobile application to a public store."
        ],
      },
      {
        heading: "Desirable",
        items: [
          "Both platforms rather than one, or a cross-platform stack with native depth behind it.",
          "Accessibility work on a consumer application.",
          "Experience of an application used across a wide range of device ages.",
        ],
      },
      {
        heading: "What we offer",
        items: [
          "A pay band set against the civil service scale, with a technology allowance on top.",
          "Provident fund, gratuity and medical cover for you and your dependants.",
          "A training budget each year, and time set aside to use it.",
          "Flexible hours around a core of 10:00 to 16:00, and two days a week from home.",
        ],
      },
    ],
  },
  {
    id: "product-designer",
    slug: "product-designer",
    department: "Design",
    level: "Mid",
    title: "Product Designer",
    summary: "Make cryptography feel calm and obvious for every citizen.",
    location: "Thimphu",
    employmentType: "Full time",
    slots: 1,
    postedAt: "2026-08-10",
    closesAt: "2026-09-30",
    about:
      "Selective disclosure, key recovery and revocation are hard ideas. Your job is to make them ordinary — so that someone sharing a credential understands exactly what they are handing over, without being taught a single new word.",
    sections: [
      {
        heading: "Duties and responsibilities",
        items: [
          "Own the end-to-end design of wallet and partner-facing flows, from the first sketch to the shipped screen.",
          "Run usability sessions in Dzongkha and English, including with first-time smartphone users.",
          "Keep and extend the design system alongside the engineers who build against it.",
          "Write the interface copy, and defend it in review.",
        ],
      },
      {
        heading: "Eligibility",
        items: [
          "Class X and Class XII marks above 70% in each.",
          "A bachelor's degree with an aggregate above 60%, in a field relevant to this role.",
          "Bhutanese citizenship, with a valid CID.",
          "A Security Clearance Certificate valid through the recruitment period.",
          "No pending disciplinary or legal proceedings.",
          "A portfolio showing at least two shipped products, with your own contribution made clear."
        ],
      },
      {
        heading: "Desirable",
        items: [
          "Experience designing for low-literacy or first-time digital users.",
          "Comfort prototyping in code, or reading the code your designs become.",
          "Public-sector or regulated-industry work.",
        ],
      },
      {
        heading: "What we offer",
        items: [
          "A pay band set against the civil service scale, with a technology allowance on top.",
          "Provident fund, gratuity and medical cover for you and your dependants.",
          "A training budget each year, and time set aside to use it.",
          "Flexible hours around a core of 10:00 to 16:00, and two days a week from home.",
        ],
      },
    ],
  },
  {
    id: "communications-officer",
    slug: "communications-officer",
    department: "Communications",
    level: "Mid",
    title: "Communications Officer",
    summary: "Tell the NDI story to citizens, partners and the international press.",
    location: "Thimphu",
    employmentType: "Contract",
    slots: 1,
    postedAt: "2026-08-14",
    closesAt: "2026-10-09",
    about:
      "A two-year contract, renewable. You will explain a national identity system to three audiences at once — citizens who need to trust it, institutions deciding whether to integrate, and an international press that keeps asking how a country of this size did it first.",
    sections: [
      {
        heading: "Duties and responsibilities",
        items: [
          "Plan and run the communications calendar across the website, social channels and the press.",
          "Write and place announcements, briefings and responses, in Dzongkha and English.",
          "Prepare spokespeople before interviews and panels.",
          "Handle press enquiries, and route the ones that need a technical answer.",
          "Report on reach and sentiment each quarter.",
        ],
      },
      {
        heading: "Eligibility",
        items: [
          "Class X and Class XII marks above 70% in each.",
          "A bachelor's degree with an aggregate above 60%, in a field relevant to this role.",
          "Bhutanese citizenship, with a valid CID.",
          "A Security Clearance Certificate valid through the recruitment period.",
          "No pending disciplinary or legal proceedings.",
          "At least three years in communications, public relations or journalism, with published work to show."
        ],
      },
      {
        heading: "Desirable",
        items: [
          "Experience communicating a technical subject to a general audience.",
          "An existing relationship with Bhutanese and regional media.",
          "Photography, video or design skills alongside the writing.",
        ],
      },
      {
        heading: "What we offer",
        items: [
          "A pay band set against the civil service scale, with a technology allowance on top.",
          "Provident fund, gratuity and medical cover for you and your dependants.",
          "A training budget each year, and time set aside to use it.",
          "Flexible hours around a core of 10:00 to 16:00, and two days a week from home.",
        ],
      },
    ],
  },
];

/** Global: the "why work here" cards in the Careers hero. */
