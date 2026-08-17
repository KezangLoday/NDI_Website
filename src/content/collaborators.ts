import { media } from "@/lib/media";

import type { Collaborator, CollaboratorGroup } from "./types";

/** Render order, left to right. */
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
 * Four boxes for the seven international partners, one for the two service
 * providers.
 *
 * All four international boxes draw on the same list rather than owning two
 * logos each. Seven logos do not divide into four boxes without leaving one
 * box holding a single logo, which would sit frozen while its neighbours
 * turned; sharing the list gives every box all seven to cycle through, and the
 * exclusivity rule — which applies to boxes whose lists are identical — keeps
 * the same mark off the row twice at once.
 */
export const collaborators: Collaborator[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    // Supplied at 978x621, of which 55% of the width and half the height were
    // transparent margin; trimmed to the mark so the optical sizing below means
    // what it says rather than sizing a mostly-empty canvas.
    logo: media("/media/logos/collab/aws.png", "Powered by AWS", 440, 317),
    group: "service-providers",
    slots: [0],
    // Sized down against the row rather than against the box. At 92% it filled
    // 9,500px² where nothing else passed 7,700 — a two-line lockup reads bigger
    // than its bounding box already, and full colour among monochrome adds to
    // that. 74% puts it at ~6,200px², in the band the rest of the row occupies.
    maxWidth: "74%",
    maxHeight: "70%",
    // AWS does not permit its mark to be recoloured; the smile stays orange.
    preserveColor: true,
  },
  {
    id: "regula",
    name: "Regula",
    logo: media("/media/logos/collab/regula.png", "Regula", 384, 119),
    group: "service-providers",
    slots: [0],
    maxWidth: "96%",
    maxHeight: "58%",
  },
  {
    id: "w3c",
    name: "World Wide Web Consortium",
    logo: media("/media/logos/collab/w3c.png", "World Wide Web Consortium", 318, 159),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "id4africa",
    name: "ID4Africa",
    logo: media("/media/logos/collab/id4africa.png", "ID4Africa", 225, 225),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "80%",
    maxHeight: "96%",
  },
  {
    id: "trust-over-ip",
    name: "Trust over IP Foundation",
    logo: media("/media/logos/collab/trust-over-ip.png", "Trust over IP Foundation", 310, 163),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "iiw",
    name: "Internet Identity Workshop",
    logo: media("/media/logos/collab/iiw.png", "Internet Identity Workshop", 256, 197),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "70%",
    maxHeight: "88%",
  },
  {
    id: "diacc",
    name: "DIACC",
    logo: media("/media/logos/collab/diacc.png", "DIACC", 318, 159),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "90%",
    maxHeight: "74%",
  },
  {
    id: "identity-woman",
    name: "Identity Woman",
    logo: media("/media/logos/collab/identity-woman.png", "Identity Woman", 384, 96),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "100%",
    maxHeight: "50%",
  },
  {
    id: "iden2",
    name: "iDen2",
    logo: media("/media/logos/collab/iden2.png", "iDen2", 502, 106),
    group: "international-partners",
    slots: [1, 2, 3, 4],
    maxWidth: "100%",
    maxHeight: "48%",
  },
];
