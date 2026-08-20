/** Team members. */
import type { TeamMember as PayloadTeamMember } from "@/payload-types";
import type { TeamMember } from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import { nonEmpty, toMedia } from "./common";
import { LISTING_DEPTH, LISTING_LIMIT, published } from "./queries";

/** The fields `toTeamMember` reads. See the note on `NewsDoc` in `news.ts`. */
export type TeamMemberDoc = Pick<PayloadTeamMember, "id" | "name" | "role" | "tier"> &
  Partial<PayloadTeamMember>;

export function toTeamMember(doc: TeamMemberDoc): TeamMember {
  return {
    id: String(doc.id),
    name: doc.name,
    role: doc.role,
    tier: doc.tier,
    photo: toMedia(doc.photo, doc.name),
    photoPosition: nonEmpty(doc.photoPosition),
  };
}

/** Leadership first, then each tier in its configured order. */
export async function queryTeam(): Promise<TeamMember[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "team-members",
    where: published(),
    sort: ["tier", "order", "name"],
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: { name: true, role: true, tier: true, photo: true, photoPosition: true },
  });
  return docs.map(toTeamMember);
}
