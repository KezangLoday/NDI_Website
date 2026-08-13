import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getOrganizations, organizationColumnDurations } from "@/content";
import type { Organization } from "@/content/types";
import { mediaUrl } from "@/lib/media";

function OrgTile({ organization, duplicate }: { organization: Organization; duplicate: boolean }) {
  return (
    <div
      data-org-tile="1"
      aria-hidden={duplicate || undefined}
      className="ndi-liquid relative flex w-full flex-none flex-col items-center gap-3 rounded-[14px] px-[18px] py-5 text-center"
    >
      <div className="ndi-org-logo flex h-[68px] w-[68px] flex-none items-center justify-center">
        <Image
          src={mediaUrl(organization.logo)}
          alt={duplicate ? "" : organization.logo.alt}
          width={organization.logo.width}
          height={organization.logo.height}
          sizes="68px"
          className="block h-full w-full object-contain"
        />
      </div>
      <div>
        <div className="font-display text-[15.5px] font-bold leading-[1.3] text-strong">
          {organization.name}
        </div>
        <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
          {organization.category}
        </div>
        <p className="mt-[9px] text-xs leading-[1.5] text-muted">{organization.description}</p>
      </div>
    </div>
  );
}

export async function TrustedBy() {
  const organizations = await getOrganizations();
  const columns = ([1, 2, 3] as const).map((column) =>
    organizations.filter((organization) => organization.column === column),
  );

  return (
    <section className="py-16">
      <Reveal className="mx-auto max-w-[1200px] px-8 text-left">
        <Eyebrow>— Trusted by leading organizations</Eyebrow>
        <h2 className="ndi-org-h2 mt-4 whitespace-nowrap font-display text-[min(40px,5vw)] font-bold leading-[1.1] tracking-[-0.01em] text-strong">
          Where your identity already works
        </h2>
        <p className="mt-[14px] max-w-[600px] text-base leading-[1.62] text-muted">
          Government agencies, banks, universities and telecoms issuing and verifying credentials
          today.
        </p>
      </Reveal>

      {/* The fade used to be a mask on this container. A mask creates a new
          backdrop root, so every tile inside it had nothing of the page to
          sample and their backdrop-filter did nothing at all. Two scrims,
          painted over the columns in the page's own colour at this scroll
          depth, fade the same way and leave the backdrop reachable. */}
      <div className="relative mx-auto mt-[34px] max-w-[1200px]">
        <div
          data-org-cols="1"
          className="flex max-h-[500px] justify-center gap-5 overflow-hidden px-8"
        >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`ndi-org-col min-w-0 flex-1 ${
              columnIndex === 1 ? "ndi-org-col-2" : columnIndex === 2 ? "ndi-org-col-3" : ""
            }`}
          >
            {/* The tiles are rendered twice so the -50% loop is seamless. */}
            <div
              className="ndi-org-track flex flex-col gap-5 pb-5"
              style={{
                animation: `ndiOrgUp ${
                  organizationColumnDurations[(columnIndex + 1) as 1 | 2 | 3]
                } linear infinite`,
              }}
            >
              {[...column, ...column].map((organization, tileIndex) => (
                <OrgTile
                  key={`${organization.id}-${tileIndex}`}
                  organization={organization}
                  duplicate={tileIndex >= column.length}
                />
              ))}
            </div>
          </div>
        ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[110px]"
          style={{ background: "linear-gradient(to bottom, rgb(19,26,40), rgba(19,26,40,0))" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px]"
          style={{ background: "linear-gradient(to top, rgb(15,21,32), rgba(15,21,32,0))" }}
        />
      </div>
    </section>
  );
}
