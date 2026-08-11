import { FeatureCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getUseCases } from "@/content";

export async function WhatYouCanDo() {
  const useCases = await getUseCases();

  return (
    <section id="how-it-works" className="mx-auto max-w-[1200px] px-8 pb-6 pt-14">
      <Reveal>
        <SectionHeader
          eyebrow="— What you can do"
          title="Everything you need, in one wallet"
          description="Real things you can do today with your Bhutan NDI digital identity — no paperwork, no passwords."
          action={<ViewAllLink href="/users">See what you can do</ViewAllLink>}
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-[18px] min-[561px]:grid-cols-2 min-[901px]:grid-cols-4">
        {useCases.map((useCase, index) => (
          <Reveal key={useCase.id} delay={0.05 * (index + 1)} className="h-full">
            {/* The glow is bracketed rather than alternating: NDI mint on the
                two outer cards, the brighter spring green on the ones between,
                so the row reads as a set that closes on the accent. */}
            <FeatureCard
              glowColor={index === 0 || index === useCases.length - 1 ? "mint" : "spring"}
            >
              <span className="inline-flex h-[26px] items-center text-accent">
                <Icon name={useCase.icon} size={24} />
              </span>
              <h3 className="mb-1.5 mt-[18px] font-display text-[18px] font-semibold text-strong">
                {useCase.title}
              </h3>
              <p className="text-sm leading-[1.55] text-muted">{useCase.description}</p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
