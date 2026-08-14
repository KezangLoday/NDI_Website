import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getCapabilities } from "@/content";

/**
 * Six capabilities, as a two-column index rather than a grid of cells.
 *
 * Thesis: these are equal-weight facts about the platform, read by scanning.
 * A three-column grid gave each one a cell of identical size and identical
 * spacing, so nothing led and the eye had no path. Two columns halve the scan
 * targets per row, the title sits on the icon's line so an entry reads as one
 * object rather than three stacked ones, and the interval between entries far
 * exceeds the interval inside them — which is what gives the section a cadence.
 *
 * The hairline between entries draws itself in as the entry arrives, a beat
 * after the text starts rising. It supplies the spine the boxes used to give
 * without putting anything back in a container, and it is the one piece of
 * motion here: these are not interactive, so per the animation framework
 * nothing should respond to hover.
 */
export async function Capabilities() {
  const capabilities = await getCapabilities();

  return (
    <section className="mx-auto max-w-[1200px] px-8 py-[72px]">
      <Reveal>
        <SectionHeader
          eyebrow="— Capabilities"
          title="Digital trust, engineered for you"
          action={<ViewAllLink href="/organizations">View all features</ViewAllLink>}
        />
      </Reveal>

      <div className="ndi-cap-list mt-12 grid grid-cols-1 gap-x-20 min-[761px]:grid-cols-2">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.id} delay={0.05 * (index + 1)}>
            <div className="relative pb-9 pt-6">
              <span aria-hidden="true" className="ndi-cap-rule" />
              <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-4">
                <span className="mt-[3px] text-accent" aria-hidden="true">
                  <Icon name={capability.icon} size={20} />
                </span>
                <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em] text-strong">
                  {capability.title}
                </h3>
                <p className="col-start-2 mt-2 max-w-[46ch] text-[14.5px] leading-[1.65] text-muted">
                  {capability.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
