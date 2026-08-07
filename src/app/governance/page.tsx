import type { Metadata } from "next";
import Link from "next/link";

import { Emphasis, PageHero, PageSection } from "@/components/layout/PageHero";
import { SpotlightCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import {
  actBody,
  actChapters,
  actPdfNote,
  actPdfUrl,
  frameworkSpecs,
  governanceStatus,
  governanceToc,
  institutionalBodies,
  offences,
  privacyBullets,
  purposeApplication,
  purposeBullets,
  standardsParagraphs,
} from "@/content/governance";
import type { GovernanceBullet } from "@/content/types";

export const metadata: Metadata = {
  title: "Governance — Bhutan NDI",
  description:
    "The Bhutan NDI Governance Framework and the National Digital Identity Act of Bhutan 2023.",
};

/** Inline statutory reference chip, e.g. §5–§10. */
function Ref({ children }: { children: string }) {
  return (
    <span className="ml-1.5 whitespace-nowrap font-mono text-[11px] tracking-[0.08em] text-accent">
      {children}
    </span>
  );
}

function Bullet({ item }: { item: GovernanceBullet }) {
  return (
    <div className="flex items-start gap-3.5">
      <span
        aria-hidden="true"
        className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-accent"
        style={{ boxShadow: "var(--glow-sm)" }}
      />
      <span className="text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
        {item.text}
        {item.ref ? <Ref>{item.ref}</Ref> : null}
      </span>
    </div>
  );
}

/** A numbered block in the right-hand column. */
function Block({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal id={id} className="scroll-mt-[120px]">
      <Eyebrow>— {number}</Eyebrow>
      <h2 className="mt-3 font-display text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.03em] text-strong">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

export default function GovernancePage() {
  return (
    <>
      <PageSection className="pb-4 pt-44">
        <PageHero
          eyebrow="— Governance"
          title={
            <>
              The <Emphasis>Governance Framework</Emphasis>
            </>
          }
          lead="Bhutan NDI Governance Framework is a family of legislative documents. The National Digital Identity Act of Bhutan 2023 is the mother of legislation for the framework."
        />
        <Reveal delay={0.05} className="mt-7 flex flex-wrap gap-2.5">
          {governanceStatus.map((status) => (
            <span
              key={status}
              className="inline-flex items-center gap-2 rounded-full border border-grid bg-white/[0.02] px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent"
                style={{ boxShadow: "var(--glow-sm)" }}
              />
              {status}
            </span>
          ))}
        </Reveal>
      </PageSection>

      <PageSection className="grid grid-cols-1 gap-12 pb-[104px] pt-14 min-[901px]:grid-cols-[260px_minmax(0,1fr)]">
        {/* On this page */}
        <nav
          aria-label="On this page"
          className="top-[110px] hidden h-max min-[901px]:sticky min-[901px]:block"
        >
          <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
            — On this page
          </div>
          <div className="flex flex-col">
            {governanceToc.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                className="rounded-lg px-3 py-2.5 text-[13.5px] text-muted transition-colors hover:bg-[color:var(--ndi-mint-08)] hover:text-accent"
              >
                {entry.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-16">
          <Block id="act" number="01" title="Bhutan NDI Act">
            <p className="text-[15px] leading-[1.68] text-muted [text-wrap:pretty]">{actBody}</p>

            <a
              href={actPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ndi-role-card mt-7 flex flex-col gap-5 rounded-2xl border border-grid bg-white/[0.02] p-6 min-[701px]:flex-row min-[701px]:items-center"
            >
              <span className="flex-none text-accent">
                <Icon name="fileText" size={30} />
              </span>
              <span className="flex-1">
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                  — The full Act
                </span>
                <span className="mt-1.5 block font-display text-[17px] font-semibold text-strong">
                  National Digital Identity Act of Bhutan 2023
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-muted">
                  {actPdfNote}
                  <Ref>§160</Ref>
                </span>
              </span>
              <span
                className="inline-flex flex-none items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-semibold"
                style={{ background: "var(--accent)", color: "var(--text-on-mint)" }}
              >
                <Icon name="download" size={18} strokeWidth={2} />
                Download PDF
              </span>
            </a>
          </Block>

          <Block id="purpose" number="02" title="Purpose & application">
            <p className="text-[15px] leading-[1.68] text-muted">
              The Act came into force on 24 July 2023. Its stated purposes:
              <Ref>§2, §4</Ref>
            </p>
            <div className="mt-5 flex flex-col gap-3.5">
              {purposeBullets.map((bullet) => (
                <Bullet key={bullet.text} item={bullet} />
              ))}
            </div>
            <p className="mt-6 text-[15px] leading-[1.68] text-muted [text-wrap:pretty]">
              {purposeApplication}
              <Ref>§3</Ref>
            </p>
          </Block>

          <Block id="institutions" number="03" title="Institutional framework">
            <p className="text-[15px] leading-[1.68] text-muted">
              The Act separates approval from operation across two bodies.
              <Ref>Chapter 2</Ref>
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4">
              {institutionalBodies.map((body) => (
                <SpotlightCard key={body.id}>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                    {body.label}
                  </span>
                  <div className="font-display text-[17px] font-semibold text-strong">
                    {body.subtitle}
                  </div>
                  {body.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[14.5px] leading-[1.65] text-muted [text-wrap:pretty]"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <div className="font-mono text-[11px] tracking-[0.08em] text-faint">
                    {body.ref}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </Block>

          <Block id="framework" number="04" title="What the framework specifies">
            <p className="text-[15px] leading-[1.68] text-muted [text-wrap:pretty]">
              The Administrative Body submits the Governance Framework to the Governing Body for
              approval, which ensures it is aligned with national needs and consistent with
              recognised international standards.
              <Ref>§14–§16</Ref>
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3.5 min-[701px]:grid-cols-2">
              {frameworkSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className="ndi-role-card relative overflow-hidden rounded-2xl border border-grid bg-white/[0.02] p-5"
                >
                  <div className="font-display text-[15.5px] font-semibold text-strong">
                    {spec.title}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">
                    {spec.description}
                    {spec.ref ? <Ref>{spec.ref}</Ref> : null}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="standards" number="05" title="Interoperability & standards">
            <div className="flex flex-col gap-5">
              {standardsParagraphs.map((paragraph) => (
                <p
                  key={paragraph.text}
                  className="text-[15px] leading-[1.68] text-muted [text-wrap:pretty]"
                >
                  {paragraph.text}
                  {paragraph.ref ? <Ref>{paragraph.ref}</Ref> : null}
                </p>
              ))}
            </div>
          </Block>

          <Block id="privacy" number="06" title="Privacy, residency & security">
            <div className="flex flex-col gap-3.5">
              {privacyBullets.map((bullet) => (
                <Bullet key={bullet.text} item={bullet} />
              ))}
            </div>
          </Block>

          <Block id="offences" number="07" title="Offences & penalties">
            <p className="text-[15px] leading-[1.68] text-muted">
              Chapter 12 grades offences against the Infrastructure.
              <Ref>§131–§146</Ref>
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-grid">
              {offences.map((row, index) => (
                <div
                  key={row.id}
                  className={`flex flex-col gap-2 px-5 py-4 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between min-[641px]:gap-6 ${
                    index > 0 ? "border-t border-subtle" : ""
                  }`}
                >
                  <span className="text-[14.5px] leading-[1.5] text-body">{row.offence}</span>
                  <span className="inline-flex w-max flex-none rounded-full border border-grid bg-white/[0.02] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                    {row.grade}
                  </span>
                </div>
              ))}
            </div>
          </Block>

          <Block id="chapters" number="08" title="Chapters of the Act">
            <div className="grid grid-cols-1 gap-3 min-[701px]:grid-cols-2">
              {actChapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className="flex items-baseline gap-3.5 rounded-xl border border-grid bg-white/[0.02] px-4 py-3"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-accent">
                    {chapter.number}
                  </span>
                  <span className="text-[14.5px] leading-[1.4] text-body">{chapter.title}</span>
                </div>
              ))}
            </div>
            <p className="mt-7 text-[15px] leading-[1.68] text-muted">
              Questions about the framework?{" "}
              <Link href="/#contact" className="text-accent">
                Contact the Bhutan NDI team
              </Link>
              .
            </p>
          </Block>
        </div>
      </PageSection>
    </>
  );
}
