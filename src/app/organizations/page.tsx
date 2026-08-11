import type { Metadata } from "next";

import { Emphasis, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { IntegrationPipeline } from "@/components/pages/IntegrationPipeline";
import { InquiryForm } from "@/components/pages/InquiryForm";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import { Icon } from "@/components/ui/icons";
import {
  getOrgHeroPills,
  getOrgServiceOptions,
  getOrgServices,
  getPipeline,
  getSiteSettings,
  getWhyPartnerRows,
} from "@/content";

export const metadata: Metadata = {
  title: "For Organizations — Bhutan NDI",
  description:
    "Verify identity, authenticate users and sign documents on government-backed digital identity infrastructure. One integration, every service.",
};

/**
 * The bento slots: a tall centre column flanked by two short cards a side.
 *
 * The reference runs three rows with the centre spanning all of them. That
 * cannot work here: the short cards need ~312px to hold their content and the
 * revealed value, and three rows of that make the centre 968px tall carrying
 * one card's worth of copy. Two rows keeps the silhouette and halves the
 * empty space.
 */
const BENTO_SLOTS = [
  "min-[901px]:col-start-1 min-[901px]:col-end-2 min-[901px]:row-start-1 min-[901px]:row-end-2",
  "min-[901px]:col-start-2 min-[901px]:col-end-3 min-[901px]:row-start-1 min-[901px]:row-end-3",
  "min-[901px]:col-start-3 min-[901px]:col-end-4 min-[901px]:row-start-1 min-[901px]:row-end-2",
  "min-[901px]:col-start-1 min-[901px]:col-end-2 min-[901px]:row-start-2 min-[901px]:row-end-3",
  "min-[901px]:col-start-3 min-[901px]:col-end-4 min-[901px]:row-start-2 min-[901px]:row-end-3",
];

export default async function OrganizationsPage() {
  const [pills, services, whyRows, steps, options, settings] = await Promise.all([
    getOrgHeroPills(),
    getOrgServices(),
    getWhyPartnerRows(),
    getPipeline(),
    getOrgServiceOptions(),
    getSiteSettings(),
  ]);

  const core = services.filter((service) => service.tier === "core");
  const advanced = services.filter((service) => service.tier === "advanced");

  return (
    <>
      {/* ============ HERO ============ */}
      <PageSection className="pb-12 pt-44">
        <Reveal className="max-w-[860px]">
          <Eyebrow>— For organizations</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(38px,5.2vw,62px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Onboard customers in minutes, <Emphasis>not weeks</Emphasis>
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            Verify identity, authenticate users and sign documents on government-backed digital
            identity infrastructure. One integration, every service.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <GradientButton href="#inquiry">
              <span>Start a business inquiry</span>
              <Icon name="arrowRight" size={16} strokeWidth={2} />
            </GradientButton>
          </div>
        </Reveal>

        {/* Thesis: these four support the headline, they do not compete with
            it. As boxes — and then as a divided row — they read as a second
            headline block and split the hero's attention four ways. Set as one
            running line they stay legible, take a quarter of the vertical
            space, and let the CTA remain the only thing asking to be clicked. */}
        <Reveal delay={0.05} className="mt-12 max-w-[1000px]">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2.5 text-[15px] leading-[1.5] text-muted">
            {pills.map((pill, index) => (
              <span key={pill.id} className="inline-flex items-baseline gap-2.5">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="mr-0.5 h-[3px] w-[3px] translate-y-[-4px] rounded-full bg-accent"
                  />
                ) : null}
                <span className="font-display text-[16px] font-semibold tracking-[-0.01em] text-strong">
                  {pill.label}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                  {pill.sublabel}
                </span>
              </span>
            ))}
          </p>
        </Reveal>
      </PageSection>

      {/* ============ SOLUTIONS ============ */}
      <PageSection id="solutions" className="py-20">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Solutions"
            title="Core services"
            size="clamp(30px,3.6vw,44px)"
            lead="Each service, the use case it solves, and what your organization gets from it."
          />
        </Reveal>
        <Reveal className="mt-10">
          <BentoGrid className="min-[901px]:grid-rows-2">
            {core.map((service, index) => (
              <BentoCard
                key={service.id}
                name={service.title}
                description={service.useCase}
                value={service.value}
                icon={service.icon}
                className={BENTO_SLOTS[index] ?? ""}
              />
            ))}
          </BentoGrid>
        </Reveal>
      </PageSection>

      {/* ============ ADVANCED SERVICES ============ */}
      <PageSection id="advanced" className="py-[72px]">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Advanced services"
            title="For high-assurance needs"
            size="clamp(30px,3.6vw,44px)"
          />
        </Reveal>
        {/* Thesis: these are reference material — niche services a technical
            reader looks up, not a showcase to browse. A term/definition table
            gives every name the same left edge to scan down, and lets the
            explanation run at a readable measure instead of being squeezed into
            a third of the width. It also reads as clearly secondary to the
            bento above, which is what it is. */}
        <div className="mt-9 flex flex-col">
          {advanced.map((service, index) => (
            <Reveal key={service.id} delay={0.04 * (index + 1)}>
              <div className="grid grid-cols-1 gap-x-12 gap-y-2 border-t border-subtle py-6 min-[761px]:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
                <div className="flex items-start gap-3">
                  <span className="mt-[1px] flex-none text-accent" aria-hidden="true">
                    <Icon name={service.icon} size={19} />
                  </span>
                  <h3 className="font-display text-[16.5px] font-semibold tracking-[-0.01em] text-strong">
                    {service.title}
                  </h3>
                </div>
                <p className="max-w-[62ch] text-[14.5px] leading-[1.65] text-muted min-[761px]:pt-px">
                  {service.useCase}
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.04 * (advanced.length + 1)}>
            <div className="grid grid-cols-1 gap-x-12 gap-y-2 border-y border-subtle py-6 min-[761px]:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                — Not sure which fits?
              </div>
              <a
                href="#inquiry"
                className="ndi-va inline-flex w-max items-center gap-2.5 font-display text-[16.5px] font-semibold tracking-[-0.01em] text-strong"
              >
                Talk to our integration team
                <Icon name="arrowRight" size={16} strokeWidth={2} />
              </a>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* ============ WHY PARTNER ============ */}
      <PageSection className="py-[72px]">
        <div data-ndi-2col="1" className="grid grid-cols-1 items-start gap-14 min-[901px]:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="top-[120px] h-max min-[901px]:sticky">
            <SubSectionHeader
              eyebrow="— Why partner"
              title="Why organizations build on Bhutan NDI"
              size="clamp(30px,3.6vw,42px)"
              lead="National infrastructure, standards-based technology, and a growing ecosystem of issuers and verifiers."
            />
            <a
              href="#inquiry"
              className="ndi-tut mt-[22px] inline-flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-[-0.01em] text-accent"
            >
              Start a conversation
              <Icon name="arrowRight" size={17} strokeWidth={2} />
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            {whyRows.map((row) => (
              <div
                key={row.id}
                data-why-row="1"
                className="ndi-why-row grid grid-cols-[44px_minmax(0,1fr)] items-start gap-x-5 gap-y-2 rounded-xl border-b border-subtle py-6"
              >
                <span className="row-span-2 inline-flex h-11 w-11 items-center justify-center font-mono text-[14px] text-accent">
                  {row.number}
                </span>
                <div
                  data-why-head="1"
                  className="flex min-h-11 flex-wrap items-center justify-between gap-4"
                >
                  <span className="font-display text-[18px] font-semibold tracking-[-0.02em] text-strong">
                    {row.title}
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-subtle px-[11px] py-[5px] font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    {row.tag}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.62] text-muted [text-wrap:pretty]">
                  {row.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </PageSection>

      {/* ============ INTEGRATION PATH ============ */}
      <PageSection className="pb-[72px] pt-14">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Integration path"
            title="From enquiry to production"
            size="clamp(28px,3.2vw,38px)"
          />
        </Reveal>
        <Reveal delay={0.05} className="mt-9">
          <IntegrationPipeline steps={steps} />
        </Reveal>
      </PageSection>

      {/* ============ BUSINESS INQUIRY ============ */}
      <PageSection id="inquiry" className="pb-[104px] pt-14">
        <Reveal
          data-ndi-2col="1"
          className="relative grid grid-cols-1 items-start gap-10 overflow-hidden rounded-3xl border border-grid p-9 min-[901px]:grid-cols-[0.9fr_1.1fr] min-[901px]:gap-14 min-[901px]:p-[52px]"
          style={{
            background: "linear-gradient(162deg, #103440 0%, #101827 64%)",
            boxShadow: "var(--inset-top), 0 24px 60px rgba(0,0,0,0.34)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-[140px] h-[340px] w-[520px]"
            style={{
              background: "radial-gradient(circle, rgba(90,201,148,0.18), transparent 70%)",
              filter: "blur(14px)",
            }}
          />
          <div className="relative">
            <SubSectionHeader
              eyebrow="— Business inquiry"
              title="Let's scope your integration"
              size="clamp(28px,3.2vw,38px)"
              lead="Send us the outline of what you need. Our team replies within two working days."
            />
            <div className="mt-7 flex flex-col gap-3.5">
              <a
                href={`mailto:${settings.contact.email}`}
                className="ndi-plainlink inline-flex items-center gap-2.5 text-[14.5px] text-muted"
              >
                <Icon name="mail" size={17} className="flex-none text-faint" />
                {settings.contact.email}
              </a>
              <a
                href={settings.contact.officePhoneHref}
                className="ndi-plainlink inline-flex items-center gap-2.5 text-[14.5px] text-muted"
              >
                <Icon name="phone" size={17} className="flex-none text-faint" />
                {settings.contact.officePhoneDisplay}
              </a>
            </div>
          </div>

          <InquiryForm services={options} />
        </Reveal>
      </PageSection>
    </>
  );
}
