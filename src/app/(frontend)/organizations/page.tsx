import type { Metadata } from "next";

import { Emphasis, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { IntegrationPipeline } from "@/components/pages/IntegrationPipeline";
import { InquiryForm } from "@/components/pages/InquiryForm";
import { BentoCard, BentoGrid } from "@/components/ui/BentoGrid";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import { Icon } from "@/components/ui/icons";
import Image from "next/image";

import {
  getOrgServiceOptions,
  getOrgServices,
  getPipeline,
  getSiteSettings,
  getWhyPartnerRows,
  orgHeroImage,
} from "@/content";
import type { OrgService } from "@/content/types";
import { mediaUrl } from "@/lib/media";

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

/** An advanced service: a plainer card, three across. */
function AdvancedCard({ service }: { service: OrgService }) {
  return (
    <div className="ndi-spot ndi-adv-card flex h-full flex-col gap-3 rounded-2xl border border-grid bg-white/[0.02] p-6">
      <div className="ndi-spot-halo" />
      <div className="ndi-spot-fill" />
      <span className="text-accent">
        <Icon name={service.icon} size={20} />
      </span>
      <div className="font-display text-[16.5px] font-semibold text-strong">{service.title}</div>
      <p className="text-[13.5px] leading-[1.6] text-muted">{service.useCase}</p>
    </div>
  );
}

export default async function OrganizationsPage() {
  const [services, whyRows, steps, options, settings] = await Promise.all([
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
      {/* One cell, two layers. The artwork and the copy are both in grid
          area 1/1 and overlap: the credentials fan out of the top-right of the
          picture and cross over the copy column, so the wallet can be large
          without the text being pushed into a narrow lane beside it.

          The overlap is safe rather than lucky. Measured on the asset, the
          right 40% of it carries only the fan and nothing below 40% of its
          height — the phone is entirely in the left 60% — so the copy, anchored
          to the bottom of the cell, sits in a region of the picture that is
          pure transparency. The cards pass over it; no glyph is ever behind
          one.

          Below 1101px the two unstack into ordinary rows and the copy leads. */}
      <PageSection className="ndi-orghero-section pb-14">
        <div className="ndi-orghero">
          <Reveal className="ndi-orghero-copy">
            <Eyebrow>— For organizations</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(36px,3.9vw,50px)] font-semibold leading-[1.06] tracking-[-0.03em] text-strong [text-wrap:pretty]">
              Onboard customers in minutes, <Emphasis>not weeks</Emphasis>
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
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

          {/* The device treatment is the home hero's, not a new one: two soft
              mint pools behind the subject, and a dark lift and a mint rim as
              drop shadows on the artwork itself. The home hero's float is left
              off — that one has two phones drifting against each other, which
              is what makes the motion read; a single object bobbing on its own
              just looks loose. */}
          <Reveal delay={0.08} className="ndi-orghero-art">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[26%] top-[52%] h-[70%] w-[64%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(90,201,148,0.20) 0%, rgba(90,201,148,0.10) 26%, rgba(78,176,132,0.04) 48%, transparent 74%)",
                filter: "blur(38px)",
              }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[62%] top-[22%] h-[42%] w-[46%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(126,232,182,0.20) 0%, rgba(90,201,148,0.07) 38%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />
            <Image
              src={mediaUrl(orgHeroImage)}
              alt={orgHeroImage.alt}
              width={orgHeroImage.width}
              height={orgHeroImage.height}
              priority
              sizes="(max-width: 1100px) 92vw, 780px"
              className="relative block h-auto w-full"
              style={{
                filter:
                  "drop-shadow(0 34px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 46px rgba(90,201,148,0.18))",
              }}
            />
          </Reveal>
        </div>
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
        <div data-ndi-3col="1" className="mt-9 grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1001px]:grid-cols-3">
          {advanced.map((service, index) => (
            <Reveal key={service.id} delay={0.05 * (index + 1)} className="h-full">
              <AdvancedCard service={service} />
            </Reveal>
          ))}
          {/* The prompt sits as the last cell of the same grid, not below it. */}
          <Reveal delay={0.05 * (advanced.length + 1)} className="h-full">
            <a
              href="#inquiry"
              className="ndi-advcta flex h-full flex-col justify-between gap-5 rounded-2xl border p-6"
              style={{
                borderColor: "rgba(90,201,148,0.25)",
                background:
                  "radial-gradient(120% 90% at 20% 0%, rgba(90,201,148,0.14), rgba(90,201,148,0.02) 60%, transparent)",
              }}
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                — Not sure which fits?
              </span>
              <span className="inline-flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-[-0.02em] text-strong">
                Talk to our integration team
                <Icon name="arrowRight" size={17} strokeWidth={2} />
              </span>
            </a>
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
