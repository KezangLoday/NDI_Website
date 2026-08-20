import { media } from "../media";

import type { SeedNewsItem } from "./types";

/** Prospective Payload collection: `news`. */
export const news: SeedNewsItem[] = [
  {
    id: "sierra-leone-mou",
    slug: "sierra-leone-bhutan-ndi-sign-foundation-partnership",
    title: "Sierra Leone, Bhutan NDI and SIGN Foundation partner on digital identity",
    excerpt:
      "Sierra Leone’s MoCTI signs an MoU with Bhutan NDI Ltd. and SIGN Foundation to design and implement a national system.",
    publishedAt: "2026-07-06",
    image: media(
      "/media/news/sierra-leone.jpeg",
      "Sierra Leone delegation with Bhutan NDI and SIGN Foundation",
      2048,
      1073,
    ),
    href: "#",
    ctaLabel: "Read story",
    ctaIcon: "arrowRight",
    category: "Partnership",
    popularRank: 2,
    headline:
      "Sierra Leone, Bhutan NDI Ltd. and SIGN Foundation Partner to Implement Digital Identity System in Sierra Leone",
    body: [
      { kind: "paragraph", text: "The Ministry of Communication, Technology and Innovation (MoCTI) of the Government of Sierra Leone, Bhutan National Digital Identity Limited (Bhutan NDI), and SIGN Foundation have signed a Memorandum of Understanding (MoU) to collaborate on the design, development, and implementation of a digital identity platform for Sierra Leone." },
      { kind: "paragraph", text: "The partnership marks a significant milestone in Sierra Leone’s digital transformation journey and reflects a shared commitment to building secure, inclusive, and interoperable Digital Public Infrastructure (DPI) that empowers citizens, strengthens public service delivery, and supports economic development." },
      { kind: "paragraph", text: "The three partners will work together to develop a national digital identity platform that leverages open-source technologies and W3C-compliant verifiable credentials, enabling citizens to securely prove and manage their identities while maintaining strong standards for privacy, security, and data sovereignty." },
      { kind: "paragraph", text: "The collaboration brings together complementary expertise from each partner. The Ministry of Communication, Technology and Innovation will provide strategic leadership, policy direction, and coordination across government institutions to support nationwide implementation. Bhutan NDI will contribute its proven expertise in national digital identity architecture and provide the foundational open-source identity framework, drawing on lessons learned from the successful implementation of Bhutan’s National Digital Identity programme. SIGN Foundation will lead the system design, solution architecture, and technical implementation of the platform." },
      { kind: "paragraph", text: "Beyond technology development, the partnership places a strong emphasis on institutional capacity building and knowledge transfer. The parties will work closely to strengthen local technical capabilities, develop implementation expertise within Sierra Leone, and establish governance mechanisms that ensure the platform can be sustainably managed and evolved by national institutions over time." },
      { kind: "paragraph", text: "The MoU also establishes a Joint Working Group that will oversee implementation, coordinate technical activities, monitor progress, and develop a phased Strategic Implementation Roadmap to guide the deployment of the national digital identity ecosystem." },
      { kind: "paragraph", text: "Speaking on the partnership, representatives from the three organisations reaffirmed their shared vision of creating a trusted and inclusive digital identity ecosystem that enables citizens to access public and private services more efficiently while fostering innovation and supporting Sierra Leone’s broader digital economy." },
      { kind: "paragraph", text: "The collaboration reflects a growing commitment among governments and technology partners to build interoperable, citizen-centric digital public infrastructure using open standards and internationally recognised best practices." },
      { kind: "paragraph", text: "As implementation progresses, the partners will continue to engage public institutions, development partners, and private-sector stakeholders to build a vibrant digital identity ecosystem capable of supporting future innovation and service delivery across Sierra Leone." },
      { kind: "heading", text: "About the Ministry of Communication, Technology and Innovation" },
      { kind: "paragraph", text: "The Ministry of Communication, Technology and Innovation (MoCTI) is the Government of Sierra Leone's lead institution for communications, technology, and digital innovation. It sets national policy and oversees implementation across these sectors, advancing digital public infrastructure, connectivity, and cybersecurity to support inclusive and sustainable national development." },
      {
        kind: "paragraph",
        text: "To learn more, visit:",
        link: { label: "mocti.gov.sl", href: "https://mocti.gov.sl" },
      },
      { kind: "heading", text: "About Bhutan National Digital Identity Limited (Bhutan NDI)" },
      { kind: "paragraph", text: "Bhutan National Digital Identity (NDI), a Druk Holdings & Investment (DHI) subsidiary, provides verifiable credentials to Bhutanese citizens and residents. Bhutan NDI represents trust between actors in Bhutan’s digital ecosystem by offering the highest level of assurance, ensuring that all information shared across online services and platforms is authentic and verified." },
      { kind: "paragraph", text: "The Bhutan NDI platform establishes a highly secure digital identity system, leveraging decentralized public key infrastructure to enhance the security and integrity of personal data. Bhutan NDI promotes inclusivity, accessibility, and equity by catering to individuals across demographics." },
      {
        kind: "paragraph",
        text: "To learn more, visit:",
        link: { label: "bhutanndi.com", href: "https://bhutanndi.com" },
      },
      { kind: "heading", text: "About SIGN Foundation" },
      { kind: "paragraph", text: "SIGN Foundation is a global digital infrastructure company that builds sovereign Digital Public Infrastructure (DPI) for governments and regulated institutions. With five years of production-grade deployment experience reaching over 50 million people, SIGN delivers the foundational systems of national digital identity, sovereign blockchain, and digital payments, integrated with artificial intelligence for government service workflows." },
      { kind: "paragraph", text: "SIGN's approach keeps this infrastructure government-controlled, compliant, and built for national-scale performance. Built on open standards and cryptographic verification, its systems remain interoperable across institutions and sovereign to the nations they serve, enabling governments to deliver trusted public services while retaining full control over their critical digital infrastructure." },
      {
        kind: "paragraph",
        text: "To learn more, visit:",
        link: { label: "sign.global", href: "https://sign.global" },
      },
    ],
  },
  {
    id: "ssi-orbit-podcast",
    slug: "from-0-to-80-percent-ssi-orbit-podcast",
    title: "From 0 to 80%: how Bhutan built a national digital identity in two years",
    excerpt:
      "Pallavi Sharma joins The SSI Orbit Podcast to unpack one of the world’s most successful national-scale identity rollouts.",
    publishedAt: "2025-12-10",
    image: media(
      "/media/news/ssi-orbit.png",
      "SSI Orbit Podcast episode with Pallavi Sharma",
      700,
      390,
    ),
    href: "#",
    ctaLabel: "Watch episode",
    ctaIcon: "playCircle",
    category: "Podcast",
    popularRank: 1
  },
  {
    id: "vitalik-visit",
    slug: "vitalik-goes-to-bhutan-ethereum-national-standard",
    title: "Vitalik goes to Bhutan — where Ethereum just became a national standard",
    excerpt:
      "The Ethereum-based identity system is now fully operational, with all authentication data migrating by early 2026.",
    publishedAt: "2025-10-15",
    image: media("/media/news/vitalik-ethereum.webp", "Ethereum", 960, 540),
    href: "#",
    ctaLabel: "Read story",
    ctaIcon: "arrowRight",
    category: "Ecosystem",
    popularRank: 3
  },
  {
    id: "ethereum-adoption",
    slug: "bhutan-adopts-ethereum-for-national-identity",
    title: "Bhutan adopts Ethereum for national identity",
    excerpt:
      "Verifiable credentials and digital signing now anchor to Ethereum’s globally distributed validator network.",
    publishedAt: "2025-10-14",
    image: media(
      "/media/news/ethereum-bhutan.jpeg",
      "Ethereum Foundation visit to Bhutan",
      1080,
      914,
    ),
    href: "#",
    ctaLabel: "Read story",
    ctaIcon: "arrowRight",
    category: "Infrastructure"
  },
  {
    id: "digital-signature-platform",
    slug: "next-generation-digital-signature-platform",
    title: "Next-generation digital signature platform sets a global standard",
    excerpt:
      "Decentralized identity paired with cryptographic verification for secure, legally sound digital signing.",
    publishedAt: "2025-09-09",
    image: media(
      "/media/news/digital-signature.png",
      "Digital signing in the Bhutan NDI wallet",
      1600,
      896,
    ),
    href: "#",
    ctaLabel: "Read story",
    ctaIcon: "arrowRight",
    category: "Product"
  },
  {
    id: "phenix-iden2",
    slug: "bhutan-ndi-iden2-announce-phenix",
    title: "Bhutan NDI and iDen2 announce Phenix, an end-to-end identity solution",
    excerpt:
      "A scalable solution that grows with national requirements — assessment, phased rollout, training and support.",
    publishedAt: "2025-08-20",
    image: media("/media/news/phenix.png", "Phenix", 1624, 914),
    href: "#",
    ctaLabel: "Read story",
    ctaIcon: "arrowRight",
    category: "Partnership"
  },
];
