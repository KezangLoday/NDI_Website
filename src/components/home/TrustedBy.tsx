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
      className="relative flex w-full flex-none flex-col items-center gap-3 rounded-[14px] border border-grid px-[18px] py-5 text-center"
      style={{
        background: "linear-gradient(160deg, #162c37 0%, #1c2535 60%)",
        boxShadow: "var(--inset-top)",
      }}
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

      {/* The window used to fade its ends with a mask on this element. A mask
          makes an element a backdrop root, which left every tile inside it
          declaring `backdrop-filter` with nothing behind it to sample — the
          circuit read through the glass sharp instead of frosted. The fade is
          now two scrims that are siblings of the columns rather than an
          ancestor of the tiles, so the glass works. */}
      <div
        data-org-cols="1"
        className="relative mx-auto mt-[34px] flex max-h-[500px] max-w-[1200px] justify-center gap-5 overflow-hidden px-8"
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

        <span aria-hidden="true" className="ndi-org-fade" data-edge="top" />
        <span aria-hidden="true" className="ndi-org-fade" data-edge="bottom" />
      </div>
    </section>
  );
}
