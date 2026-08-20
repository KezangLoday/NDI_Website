import { media } from "@/lib/media";

import type { Organization } from "./types";

/** Prospective Payload collection: `organizations` — the "Trusted by" tiles. */
export const organizations: Organization[] = [
  {
    id: "royal-government-of-bhutan",
    name: "Royal Government of Bhutan",
    category: "Government",
    description: "Citizen services across ministries accept NDI as proof of identity.",
    logo: media(
      "/media/logos/orgs/royal-government-of-bhutan.png",
      "Royal Government of Bhutan",
      512,
      512,
    ),
    column: 1,
  },
  {
    id: "rcsc",
    name: "RCSC",
    category: "Civil Service",
    description: "Civil service employment records issued directly to citizens.",
    logo: media("/media/logos/orgs/rcsc.png", "Royal Civil Service Commission", 403, 403),
    column: 1,
  },
  {
    id: "royal-university-of-bhutan",
    name: "Royal University of Bhutan",
    category: "Education",
    description: "Transcripts and enrolment verified without paper attestation.",
    logo: media(
      "/media/logos/orgs/royal-university-of-bhutan.png",
      "Royal University of Bhutan",
      526,
      526,
    ),
    column: 1,
  },
  {
    id: "druk-holding-investments",
    name: "Druk Holding & Investments",
    category: "State Enterprise",
    description: "Onboarding across portfolio companies runs on one verified identity.",
    logo: media(
      "/media/logos/orgs/druk-holding-investments.png",
      "Druk Holding & Investments",
      3508,
      2000,
    ),
    column: 2,
  },
  {
    id: "bank-of-bhutan",
    name: "Bank of Bhutan",
    category: "Banking",
    description: "Remote account opening completed in minutes with verifiable KYC.",
    logo: media("/media/logos/orgs/bank-of-bhutan.png", "Bank of Bhutan", 1092, 880),
    column: 2,
  },
  {
    id: "royal-monetary-authority",
    name: "Royal Monetary Authority",
    category: "Financial Regulator",
    description: "Reporting anchored to tamper-proof institutional credentials.",
    logo: media(
      "/media/logos/orgs/royal-monetary-authority.png",
      "Royal Monetary Authority",
      898,
      898,
    ),
    column: 2,
  },
  {
    id: "tashicell",
    name: "TashiCell",
    category: "Telecom",
    description: "SIM registration without physical documents or branch visits.",
    logo: media("/media/logos/orgs/tashicell.png", "TashiCell", 480, 480),
    column: 3,
  },
  {
    id: "ricbl",
    name: "RICBL",
    category: "Insurance",
    description: "Policy issuance and claims checks handled inside the wallet.",
    logo: media("/media/logos/orgs/ricbl.png", "RICB", 300, 370),
    column: 3,
  },
  {
    id: "bhutan-telecom",
    name: "Bhutan Telecom",
    category: "Telecom",
    description: "Subscriber verification for nationwide connectivity services.",
    logo: media("/media/logos/orgs/bhutan-telecom.png", "Bhutan Telecom", 335, 297),
    column: 3,
  },
];

/** Per-column marquee durations, matching the prototype (26s / 33s / 29s). */
export const organizationColumnDurations: Record<1 | 2 | 3, string> = {
  1: "26s",
  2: "33s",
  3: "29s",
};
