import { media } from "@/lib/media";

import type { NewsItem } from "./types";

/** Prospective Payload collection: `news`. */
export const news: NewsItem[] = [
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
    popularRank: 2
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
