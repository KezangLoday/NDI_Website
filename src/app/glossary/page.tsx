import type { Metadata } from "next";

import { Emphasis, PageHero, PageSection } from "@/components/layout/PageHero";
import { GlossaryBrowser } from "@/components/pages/GlossaryBrowser";
import { Reveal } from "@/components/ui/Reveal";
import { getGlossary } from "@/content";

export const metadata: Metadata = {
  title: "Glossary — Bhutan NDI",
  description:
    "Key terms across decentralized identity, verifiable credentials and digital trust, explained plainly.",
};

export default async function GlossaryPage() {
  const terms = await getGlossary();

  return (
    <>
      <PageSection className="pb-4 pt-44">
        <PageHero
          eyebrow="— Glossary"
          title={
            <>
              The language of <Emphasis>self-sovereign</Emphasis> identity
            </>
          }
          lead="Key terms across decentralized identity, verifiable credentials and digital trust — explained plainly."
        />
      </PageSection>

      <PageSection id="glossary" className="pb-[104px] pt-10">
        <Reveal>
          <GlossaryBrowser terms={terms} />
        </Reveal>
      </PageSection>
    </>
  );
}
