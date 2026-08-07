import type { Metadata } from "next";

import { Emphasis, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { IntegrationPipeline } from "@/components/pages/IntegrationPipeline";
import { InquiryForm } from "@/components/pages/InquiryForm";
import { SpotlightCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import {
  getOrgHeroPills,
  getOrgServiceOptions,
  getOrgServices,
  getPipeline,
  getSiteSettings,
  getWhyPartnerRows,
} from "@/content";
import type { OrgService } from "@/content/types";

export const metadata: Metadata = {
  title: "For Organizations — Bhutan NDI",
  description:
    "Verify identity, authenticate users and sign documents on government-backed digital identity infrastructure. One integration, every service.",
};

function ServiceCard({ service }: { service: OrgService }) {
  return (
    <SpotlightCard>
      <span className="inline-flex h-6 flex-none items-center text-accent">
        <Icon name={service.icon} size={22} />
      </span>
      <h3 className="font-display text-[17px] font-semibold leading-[1.3] text-strong">
        {service.title}
      </h3>
      <div className="flex flex-col gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Use case
          </div>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-muted">{service.useCase}</p>
        </div>
        {service.value ? (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Value
            </div>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-muted">{service.value}</p>
          </div>
        ) : null}
      </div>
    </SpotlightCard>
  );
}

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
      <PageSection className="pb-6 pt-44">
        <Reveal className="max-w-[860px]">
          <Eyebrow>— For organizations</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(38px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Onboard customers in minutes, <Emphasis>not weeks</Emphasis>
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            Verify identity, authenticate users and sign documents on government-backed digital
            identity infrastructure. One integration, every service.
          </p>
          <a
            href="#inquiry"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--text-on-mint)" }}
          >
            Start a business inquiry
            <Icon name="arrowRight" size={16} strokeWidth={2} />
          </a>
        </Reveal>

        <Reveal delay={0.05} className="mt-12 grid grid-cols-2 gap-4 min-[1001px]:grid-cols-4">
          {pills.map((pill) => (
            <div
              key={pill.id}
              className="rounded-2xl border border-grid bg-white/[0.02] px-5 py-4"
            >
              <div className="font-display text-[16px] font-semibold text-strong">
                {pill.label}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {pill.sublabel}
              </div>
            </div>
          ))}
        </Reveal>
      </PageSection>

      {/* ============ SOLUTIONS ============ */}
      <PageSection id="solutions" className="py-16">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Solutions"
            title="Core services"
            lead="Each service, the use case it solves, and what your organization gets from it."
          />
        </Reveal>
        <div className="mt-9 grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {core.map((service, index) => (
            <Reveal key={service.id} delay={0.05 * (index + 1)} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ============ ADVANCED SERVICES ============ */}
      <PageSection id="advanced" className="py-16">
        <Reveal>
          <SubSectionHeader eyebrow="— Advanced services" title="For high-assurance needs" />
        </Reveal>
        <div className="mt-9 grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {advanced.map((service, index) => (
            <Reveal key={service.id} delay={0.05 * (index + 1)} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-grid bg-white/[0.02] px-6 py-5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
              — Not sure which fits?
            </span>
            <a href="#inquiry" className="font-display text-sm font-semibold text-accent">
              Talk to our integration team →
            </a>
          </div>
        </Reveal>
      </PageSection>

      {/* ============ WHY PARTNER ============ */}
      <PageSection className="py-16">
        <div className="grid grid-cols-1 gap-12 min-[901px]:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <Reveal className="top-[120px] h-max min-[901px]:sticky">
            <SubSectionHeader
              eyebrow="— Why partner"
              title="Why organizations build on Bhutan NDI"
              lead="National infrastructure, standards-based technology, and a growing ecosystem of issuers and verifiers."
            />
            <a
              href="#inquiry"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-grid bg-white/[0.02] px-5 py-3 font-display text-sm font-semibold text-strong"
            >
              Start a conversation
              <Icon name="arrowRight" size={16} strokeWidth={2} />
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            {whyRows.map((row, index) => (
              <div
                key={row.id}
                className={`ndi-why-row grid grid-cols-[44px_minmax(0,1fr)] items-start gap-5 py-7 ${
                  index > 0 ? "border-t border-subtle" : ""
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-grid font-mono text-[13px] text-accent">
                  {row.number}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[18px] font-semibold text-strong">
                      {row.title}
                    </h3>
                    <span className="rounded-full border border-grid bg-white/[0.02] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent">
                      {row.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                    {row.description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </PageSection>

      {/* ============ INTEGRATION PATH ============ */}
      <PageSection className="py-16">
        <Reveal>
          <SubSectionHeader eyebrow="— Integration path" title="From enquiry to production" />
        </Reveal>
        <Reveal delay={0.05} className="mt-9">
          <IntegrationPipeline steps={steps} />
        </Reveal>
      </PageSection>

      {/* ============ BUSINESS INQUIRY ============ */}
      <PageSection id="inquiry" className="pb-[104px] pt-16">
        <Reveal className="grid grid-cols-1 items-start gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-14">
          <div>
            <SubSectionHeader
              eyebrow="— Business inquiry"
              title="Let's scope your integration"
              lead="Send us the outline of what you need. Our team replies within two working days."
            />
            <div className="mt-8 flex flex-col gap-2.5">
              <a
                href={`mailto:${settings.contact.email}`}
                className="ndi-contact-row flex items-center gap-3.5 rounded-xl border border-grid bg-white/[0.02] px-3.5 py-3 text-[15px] text-body"
              >
                <span className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-grid bg-[color:var(--ndi-mint-08)] text-accent">
                  <Icon name="mail" size={18} />
                </span>
                {settings.contact.email}
              </a>
              <a
                href={settings.contact.officePhoneHref}
                className="ndi-contact-row flex items-center gap-3.5 rounded-xl border border-grid bg-white/[0.02] px-3.5 py-3 text-[15px] text-body"
              >
                <span className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-grid bg-[color:var(--ndi-mint-08)] text-accent">
                  <Icon name="phoneOutline" size={18} />
                </span>
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
