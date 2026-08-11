import type { Metadata } from "next";
import Image from "next/image";

import { PageSection } from "@/components/layout/PageHero";
import { GlowPanel } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getMissionStatements, getStory, getTeam, getVisionPillars } from "@/content";
import type { TeamMember } from "@/content/types";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "About Us — Bhutan NDI",
  description:
    "Keeping security, privacy, and consent at the heart of Bhutan NDI — our story, vision and mission, and the people building the platform.",
};

const HERO_PILLS = ["Security", "Privacy", "Consent"];

/**
 * The leading verb of each story bullet, used as its card's kicker.
 *
 * Taken from the copy rather than written fresh: the four bullets already open
 * on a verb, and lifting it gives the grid a heading without inventing one.
 */
const BULLET_KICKERS = ["Empowers", "Allows", "Inspires", "Supports"];

/** Initials stand in until the client supplies a portrait. */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <div
      className="flex h-full w-full items-center justify-center font-display text-[32px] font-semibold text-accent/70"
      style={{ background: "linear-gradient(160deg, #16303c 0%, #131b28 70%)" }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/** Leadership run larger than the rest of the team in the design. */
function PersonCard({ member, lead = false }: { member: TeamMember; lead?: boolean }) {
  return (
    <div className="ndi-role-card overflow-hidden rounded-2xl border border-grid bg-white/[0.02]">
      <div className="relative w-full" style={{ height: lead ? 320 : 240, background: "#0c111b" }}>
        {member.photo ? (
          <Image
            src={mediaUrl(member.photo)}
            alt={member.photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover"
            style={{ objectPosition: member.photoPosition ?? "50% 50%" }}
          />
        ) : (
          <Monogram name={member.name} />
        )}
      </div>
      <div className={lead ? "p-5" : "p-4"}>
        <div
          className={`font-display font-semibold leading-[1.25] text-strong ${
            lead ? "text-[18px]" : "text-[15.5px]"
          }`}
        >
          {member.name}
        </div>
        <div
          className={`mt-1.5 font-mono uppercase tracking-[0.14em] text-faint ${
            lead ? "text-[10.5px]" : "text-[10px]"
          }`}
        >
          {member.role}
        </div>
      </div>
    </div>
  );
}

export default async function CompanyPage() {
  const [story, vision, mission, team] = await Promise.all([
    getStory(),
    getVisionPillars(),
    getMissionStatements(),
    getTeam(),
  ]);

  const leadership = team.filter((member) => member.tier === "leadership");
  const members = team.filter((member) => member.tier === "team");

  return (
    <>
      {/* ============ HERO ============
          Centred under a lit arc, with the story photograph carried below the
          copy as a wide panel rather than squeezed into a second column. */}
      {/* `clip` rather than `hidden`: the arc is wider than the viewport on
          narrow screens, and hidden would make this a scroll container. */}
      <PageSection id="about" className="relative overflow-x-clip pb-[72px] pt-[168px]">
        <div aria-hidden="true" className="ndi-arc top-[84px]" />

        <Reveal className="relative text-center">
          <span className="inline-flex h-8 items-center gap-2.5 rounded-full border border-grid bg-white/[0.03] px-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full bg-accent"
              style={{ boxShadow: "var(--glow-sm)" }}
            />
            About Bhutan NDI
          </span>

          {/* Two lines, the second in the accent — the move all three
              references share, and what gives the headline its shape. */}
          <h1 className="mx-auto mt-6 max-w-[900px] font-display text-[clamp(38px,5.4vw,62px)] font-semibold leading-[1.06] tracking-[-0.03em] text-strong">
            We enhance and improve
            <br />
            <span className="ndi-wave-text">digital services</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[620px] text-[18px] leading-[1.6] text-body [text-wrap:pretty]">
            Keeping security, privacy, and consent at the heart of Bhutan NDI.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {HERO_PILLS.map((pill) => (
              <span
                key={pill}
                className="inline-flex h-9 items-center gap-[9px] rounded-full border border-grid bg-white/[0.02] px-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
              >
                <span
                  aria-hidden="true"
                  className="h-[5px] w-[5px] rounded-full bg-accent"
                  style={{ boxShadow: "var(--glow-sm)" }}
                />
                {pill}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="relative mt-14 overflow-hidden rounded-3xl border border-grid"
          style={{ boxShadow: "var(--inset-top), 0 34px 80px -30px rgba(0,0,0,0.75)" }}
        >
          <div className="relative h-[300px] min-[641px]:h-[420px] min-[1001px]:h-[480px]">
            <Image
              src={mediaUrl(story.image)}
              alt={story.image.alt}
              fill
              sizes="(max-width: 1264px) 100vw, 1136px"
              priority
              className="object-cover"
              style={{ objectPosition: story.imagePosition }}
            />
          </div>

          {/* The facts ride on the photograph's lower edge, over a scrim, so
              the panel carries them instead of needing a band of its own.
              Stacked they would cover most of the picture, so below 641px they
              drop underneath it on a solid fill instead. */}
          <div
            className="grid grid-cols-1 gap-5 bg-[#0b111c] px-6 py-6 min-[641px]:absolute min-[641px]:inset-x-0 min-[641px]:bottom-0 min-[641px]:grid-cols-3 min-[641px]:gap-6 min-[641px]:bg-transparent min-[641px]:bg-[linear-gradient(180deg,transparent,rgba(9,13,21,0.92)_62%)] min-[641px]:px-9 min-[641px]:pb-8 min-[641px]:pt-16"
          >
            {story.stats.map((stat) => (
              <div key={stat.id}>
                <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong min-[641px]:text-[26px]">
                  {stat.value}
                </div>
                <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </PageSection>

      {/* ============ STORY ============
          The four points were a wall of bulleted prose. Same copy, now a card
          each, so the section can be scanned before it is read. */}
      <PageSection className="py-[72px]">
        <Reveal className="max-w-[820px]">
          <Eyebrow>— Our story</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(26px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            The foundation for Bhutan&apos;s digital economy
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-body [text-wrap:pretty]">
            Facilitating trusted interactions between individuals and organizations. Bhutan NDI:
          </p>
        </Reveal>

        <div
          data-ndi-4col="1"
          className="mt-9 grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4"
        >
          {story.bullets.map((bullet, index) => (
            <Reveal key={bullet} delay={0.05 * (index + 1)} className="h-full">
              <GlowPanel
                className="flex flex-col p-[26px]"
                glowColor={index % 2 === 0 ? "mint" : "spring"}
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2.5 mt-4 font-display text-[17px] font-semibold text-strong">
                  {BULLET_KICKERS[index] ?? ""}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {bullet}
                </p>
              </GlowPanel>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ============ VISION ============ */}
      <PageSection className="py-14">
        <Reveal className="max-w-[760px]">
          <Eyebrow>— Our vision</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            We aspire to deliver convenience and efficiency with our user-centric solutions
          </h2>
        </Reveal>

        <div
          data-ndi-3col="1"
          className="mt-9 grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-3"
        >
          {vision.map((pillar, index) => (
            <Reveal key={pillar.id} delay={0.05 * (index + 1)} className="h-full">
              <GlowPanel className="flex flex-col items-center gap-4 p-8 text-center">
                <Image
                  src={mediaUrl(pillar.icon)}
                  alt=""
                  width={pillar.icon.width}
                  height={pillar.icon.height}
                  className="h-20 w-20 object-contain"
                />
                <div className="font-display text-[17px] font-semibold text-strong">
                  {pillar.label}
                </div>
              </GlowPanel>
            </Reveal>
          ))}
        </div>

        {/* The statement the three pillars add up to, given the width to land. */}
        <Reveal delay={0.2}>
          <p className="mx-auto mt-11 max-w-[820px] text-center font-display text-[clamp(20px,2.3vw,26px)] font-medium leading-[1.42] tracking-[-0.02em] text-strong [text-wrap:pretty]">
            <span className="text-accent">Bhutan NDI</span> accelerates seamless access to
            government, business, and financial services by building a digital ecosystem rooted in
            trust.
          </p>
        </Reveal>
      </PageSection>

      {/* ============ MISSION ============ */}
      <PageSection className="py-14">
        <Reveal className="max-w-[760px]">
          <Eyebrow>— Our mission</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Four commitments we build against
          </h2>
        </Reveal>

        <div
          data-ndi-4col="1"
          className="mt-9 grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4"
        >
          {mission.map((statement, index) => (
            <Reveal key={statement.id} delay={0.05 * (index + 1)} className="h-full">
              <GlowPanel
                className="flex flex-col gap-5 p-[26px]"
                glowColor={index % 2 === 0 ? "mint" : "spring"}
              >
                <Image
                  src={mediaUrl(statement.icon)}
                  alt=""
                  width={statement.icon.width}
                  height={statement.icon.height}
                  className="h-16 w-16 object-contain"
                />
                <p className="text-[14.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {statement.segments.map((segment, segmentIndex) =>
                    segment.emphasis ? (
                      <span key={segmentIndex} className="text-accent">
                        {segment.text}
                      </span>
                    ) : (
                      <span key={segmentIndex}>{segment.text}</span>
                    ),
                  )}
                </p>
              </GlowPanel>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ============ TEAM ============ */}
      <PageSection id="team" className="pb-[104px] pt-14">
        <Reveal className="max-w-[760px]">
          <Eyebrow>— Team</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
            The people behind the platform
          </h2>
        </Reveal>

        <Reveal
          delay={0.05}
          data-ndi-3col="1"
          className="mt-9 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3"
        >
          {leadership.map((member) => (
            <PersonCard key={member.id} member={member} lead />
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Eyebrow>— The team</Eyebrow>
          <div
            data-ndi-3col="1"
            className="mt-6 grid grid-cols-2 gap-4 min-[641px]:grid-cols-3 min-[1001px]:grid-cols-4"
          >
            {members.map((member) => (
              <PersonCard key={member.id} member={member} />
            ))}
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}
