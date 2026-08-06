import { getCollaboratorGroups, getCollaborators } from "@/content";

import { CollaboratorCarousel } from "./CollaboratorCarousel";

export async function Collaborators() {
  const [groups, collaborators] = await Promise.all([
    getCollaboratorGroups(),
    getCollaborators(),
  ]);

  return <CollaboratorCarousel groups={groups} collaborators={collaborators} />;
}
