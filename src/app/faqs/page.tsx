import type { Metadata } from "next";
import Link from "next/link";

import { Emphasis, PageSection } from "@/components/layout/PageHero";
import { FaqBrowser } from "@/components/pages/FaqBrowser";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getFaqs } from "@/content";

export const metadata: Metadata = {
  title: "FAQs — Bhutan NDI",
  description:
    "Registration, credentials, consent and recovery for citizens — and the protocol questions integration teams ask.",
};

export default async function FaqsPage() {
  const items = await getFaqs();

  return (
    <>
      <PageSection className="pb-4 pt-44">
        <Reveal className="max-w-[820px]">
          <Eyebrow>— FAQs</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(38px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Answers about your <Emphasis>identity</Emphasis>
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            Registration, credentials, consent and recovery for citizens — and the protocol
            questions integration teams ask. Still stuck?{" "}
            <Link href="/#contact" className="text-accent hover:text-accent-hover">
              Talk to our support team
            </Link>
            .
          </p>
        </Reveal>
      </PageSection>

      <PageSection id="faqs" className="pb-[104px] pt-10">
        <Reveal>
          <FaqBrowser items={items} />
        </Reveal>
      </PageSection>
    </>
  );
}
