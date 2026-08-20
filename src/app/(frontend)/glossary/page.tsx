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

/** Revalidate daily as a floor; publishing revalidates this route on demand. */
export const revalidate = 86_400;


export default async function GlossaryPage() {
  const terms = await getGlossary();

  return (
    <>
      <PageSection className="pb-2 pt-44">
        <PageHero
          title={
            <>
              The language of <Emphasis>self-sovereign</Emphasis> identity
            </>
          }
          lead="A collection of definitions to help you understand, use and adapt to the Bhutan NDI ecosystem faster. A constantly evolving list, with new vocabulary added regularly."
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
