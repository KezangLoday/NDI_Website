import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getCapabilities, walletInHand } from "@/content";
import { mediaUrl } from "@/lib/media";

/**
 * Six capabilities, annotated onto the wallet itself.
 *
 * Thesis: the phone leads. This is the only place on Home where the product
 * appears at scale in a hand, and the six capabilities are things *it* does —
 * so they are labels attached to a device, not six equivalent cells in a grid.
 * Three attach on each side, each on a hairline crossing the gutter, and each
 * side's copy turns to face the centre so the whole composition reads inward.
 *
 * That also fixes what the grid could not: in a row of identical boxes nothing
 * leads and the eye has no path. Here the path is the device, then outward.
 *
 * Three layouts, not one that shrinks. Wide: annotations either side of the
 * phone, hairlines drawn. Intermediate: the phone takes the full width and the
 * six become two columns beneath it — there is no gutter left for a hairline to
 * cross, so the hairlines go rather than shrink to a stub. Narrow: one column.
 *
 * The motion is one gesture, choreographed from a single observer on the stage
 * rather than one Reveal per element: the device arrives out of a blur, then the
 * annotations step outward from it and their hairlines draw last. Geometry and
 * choreography both live in ndi-effects.css, because here the layout is the
 * section's subject rather than an arrangement of it.
 */
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

      <Reveal className="ndi-cap-stage mt-12 min-[1101px]:mt-14">
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
          /* The two sides start together and step down in parallel, so the pair
             at each height arrives as a pair. */
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
      </Reveal>
    </section>
  );
}
