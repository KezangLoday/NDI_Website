import { Reveal } from "@/components/ui/Reveal";
import { RuleGrid, RuleItem } from "@/components/ui/RuleGrid";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
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

      <RuleGrid className="mt-10 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.id} delay={0.05 * (index + 1)}>
            <RuleItem icon={capability.icon} title={capability.title}>
              {capability.description}
            </RuleItem>
          </Reveal>
        ))}
      </RuleGrid>
    </section>
  );
}
