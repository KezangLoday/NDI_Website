"use client";

import { VacancyCard } from "@/components/pages/careers/VacancyCard";
import { useGlowCards } from "@/hooks/useGlowCards";
import type { Job } from "@/content/types";

/**
 * The open-positions grid.
 *
 * A client component only because the cards carry the proximity-tracked border
 * arc, and the hook that drives it has to run somewhere. The cards themselves
 * stay server-rendered markup underneath.
 */
export function VacancyGrid({ jobs }: { jobs: Job[] }) {
  useGlowCards();

  return (
    <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3">
      {jobs.map((job) => (
        <VacancyCard key={job.id} job={job} />
      ))}
    </div>
  );
}
