import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";

import { CapabilityStage } from "./CapabilityStage";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getCapabilities, walletInHand } from "@/content";
import { mediaUrl } from "@/lib/media";

/** Six capabilities, annotated onto the wallet itself. */
export async function Capabilities() {
  const capabilities = await getCapabilities();
  const perSide = Math.ceil(capabilities.length / 2);

  return (
    <section className="mx-auto max-w-[1200px] px-8 py-[72px]">
      <Reveal>
        <SectionHeader
          eyebrow="— Capabilities"
          title="Digital trust, engineered for you"
          action={<ViewAllLink href="/organizations">View all features</ViewAllLink>}
        />
      </Reveal>

      <CapabilityStage className="ndi-cap-stage mt-14 min-[1101px]:mt-20">
        <div className="ndi-cap-phone">
          <span aria-hidden="true" className="ndi-cap-halo" />
          <Image
            src={mediaUrl(walletInHand)}
            alt={walletInHand.alt}
            width={walletInHand.width}
            height={walletInHand.height}
            sizes="(max-width: 760px) 74vw, (max-width: 1100px) 44vw, 34vw"
            className="relative block h-auto w-full"
          />
        </div>

        {capabilities.map((capability, index) => {
          const side = index < perSide ? "left" : "right";
          /* The two sides start together and step down in parallel, so the pair at each height arrives as a pair. */
          const row = index % perSide;
          return (
            <div
              key={capability.id}
              className="ndi-cap-item"
              data-side={side}
              style={{ "--d": `${(0.085 * row).toFixed(3)}s` } as CSSProperties}
            >
              <span aria-hidden="true" className="ndi-cap-node">
                <Icon name={capability.icon} size={19} />
              </span>
              <span aria-hidden="true" className="ndi-cap-wire" />
              <div className="ndi-cap-copy">
                <h3 className="font-display text-[17.5px] font-semibold tracking-[-0.02em] text-strong">
                  {capability.title}
                </h3>
                <p className="mt-1.5 max-w-[32ch] text-[14px] leading-[1.6] text-muted">
                  {capability.description}
                </p>
              </div>
            </div>
          );
        })}
      </CapabilityStage>
    </section>
  );
}
