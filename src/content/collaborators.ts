import { media } from "@/lib/media";

import type { Collaborator, CollaboratorGroup } from "./types";

export const collaboratorGroups: CollaboratorGroup[] = [
  { id: "service-providers", label: "Service providers" },
  { id: "international-partners", label: "International partners" },
];

/**
 * Prospective Payload collection: `collaborators`.
 *
 * Logos sharing a slot occupy the same box and cross-fade between each other.
 * Slot order is significant: the carousel's per-column timing table is indexed
 * by it, which is what keeps the columns off the same beat.
 *
 * The three service-provider logos each sit in both columns, so neither column
 * is left static. The carousel skips any logo its sibling column is currently
 * showing, so the same mark never appears twice at once.
 */
export const collaborators: Collaborator[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    logo: media("/media/logos/collab/aws.png", "Amazon Web Services", 384, 384),
    group: "service-providers",
    slots: [0, 1],
    maxWidth: "80%",
    maxHeight: "96%",
  },
  {
    id: "dsr",
    name: "DSR",
    logo: media("/media/logos/collab/dsr.png", "DSR", 225, 225),
    group: "service-providers",
    slots: [0, 1],
    maxWidth: "80%",
    maxHeight: "96%",
  },
  {
    id: "regula",
    name: "Regula",
    logo: media("/media/logos/collab/regula.png", "Regula", 384, 119),
    group: "service-providers",
    slots: [0, 1],
    maxWidth: "96%",
    maxHeight: "58%",
  },
  {
    id: "w3c",
    name: "World Wide Web Consortium",
    logo: media("/media/logos/collab/w3c.png", "World Wide Web Consortium", 318, 159),
    group: "international-partners",
    slots: [2],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "id4africa",
    name: "ID4Africa",
    logo: media("/media/logos/collab/id4africa.png", "ID4Africa", 225, 225),
    group: "international-partners",
    slots: [2],
    maxWidth: "80%",
    maxHeight: "96%",
  },
  {
    id: "trust-over-ip",
    name: "Trust over IP Foundation",
    logo: media("/media/logos/collab/trust-over-ip.png", "Trust over IP Foundation", 310, 163),
    group: "international-partners",
    slots: [3],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "iiw",
    name: "Internet Identity Workshop",
    logo: media("/media/logos/collab/iiw.png", "Internet Identity Workshop", 256, 197),
    group: "international-partners",
    slots: [3],
    maxWidth: "70%",
    maxHeight: "88%",
  },
  {
    id: "diacc",
    name: "DIACC",
    logo: media("/media/logos/collab/diacc.png", "DIACC", 318, 159),
    group: "international-partners",
    slots: [4],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "identity-woman",
    name: "Identity Woman",
    logo: media("/media/logos/collab/identity-woman.png", "Identity Woman", 384, 96),
    group: "international-partners",
    slots: [4],
    maxWidth: "100%",
    maxHeight: "50%",
  },
  {
    id: "iden2",
    name: "iDen2",
    logo: media("/media/logos/collab/iden2.png", "iDen2", 502, 106),
    group: "international-partners",
    slots: [4],
    maxWidth: "100%",
    maxHeight: "48%",
  },
];
