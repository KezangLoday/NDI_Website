import { SpotlightCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getCapabilities } from "@/content";

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

      <div className="mt-10 grid grid-cols-1 gap-[18px] min-[901px]:grid-cols-3">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.id} delay={0.05 * (index + 1)} className="h-full">
            <SpotlightCard>
              <span className="inline-flex h-6 flex-none items-center text-accent">
                <Icon name={capability.icon} size={22} />
              </span>
              <div>
                <h3 className="mb-[5px] font-display text-[17px] font-semibold text-strong">
                  {capability.title}
                </h3>
                <p className="text-sm leading-[1.55] text-muted">{capability.description}</p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
