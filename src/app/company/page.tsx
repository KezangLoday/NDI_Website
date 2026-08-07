import type { Metadata } from "next";
import Image from "next/image";

import { Emphasis, PageSection } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import {
  getMissionStatements,
  getStory,
  getTeam,
  getVisionPillars,
} from "@/content";
import type { TeamMember } from "@/content/types";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "About Us — Bhutan NDI",
  description:
    "Keeping security, privacy, and consent at the heart of Bhutan NDI — our story, vision and mission, and the people building the platform.",
};

const HERO_PILLS = ["Security", "Privacy", "Consent"];

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
      {/* ============ HERO / ABOUT ============ */}
      <PageSection id="about" className="pb-6 pt-[168px]">
        <Reveal
          data-ndi-2col="1"
          className="grid grid-cols-1 items-center gap-10 min-[901px]:grid-cols-[1.05fr_0.95fr] min-[901px]:gap-12"
        >
          <div>
            <Eyebrow>— About us</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(38px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
              We enhance and improve <Emphasis>digital services</Emphasis>
            </h1>
            <p className="mt-6 max-w-[620px] text-[19px] leading-[1.6] text-body [text-wrap:pretty]">
              Keeping security, privacy, and consent at the heart of Bhutan NDI.
            </p>
            <div className="mt-9 flex flex-wrap gap-2.5">
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
          </div>

          <div
            className="relative h-[400px] overflow-hidden rounded-3xl border border-grid"
            style={{ background: "#0c111b", boxShadow: "var(--inset-top), 0 20px 48px rgba(0,0,0,0.3)" }}
          >
            <Image
              src={mediaUrl(story.image)}
              alt={story.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              priority
              className="object-cover"
              style={{ objectPosition: story.imagePosition }}
            />
          </div>
        </Reveal>
      </PageSection>

      {/* ============ STORY ============ */}
      <PageSection className="pb-[72px] pt-6">
        <Reveal className="max-w-[1100px]">
          <h2 className="max-w-[760px] font-display text-[clamp(24px,2.7vw,32px)] font-semibold leading-[1.2] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Bhutan NDI has been introduced as the foundation for Bhutan&apos;s digital economy
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-body">
            Facilitating trusted interactions between individuals and organizations. Bhutan NDI:
          </p>

          <div
            data-ndi-2col="1"
            className="mt-6 grid grid-cols-1 gap-x-10 gap-y-[18px] min-[901px]:grid-cols-2"
          >
            {story.bullets.map((bullet) => (
              <div key={bullet} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"
                  style={{ boxShadow: "var(--glow-sm)" }}
                />
                <p className="text-[15.5px] leading-[1.65] text-muted [text-wrap:pretty]">
                  {bullet}
                </p>
              </div>
            ))}
          </div>

          {/* Three facts, laid out as a row rather than a bordered band. */}
          <div className="mt-[34px] flex flex-wrap gap-9">
            {story.stats.map((stat) => (
              <div key={stat.id}>
                <div className="font-display text-[24px] font-semibold tracking-[-0.02em] text-strong">
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

      {/* ============ VISION & MISSION ============ */}
      <PageSection className="py-14">
        <Reveal>
          <Eyebrow>— Vision &amp; mission</Eyebrow>
          <h2 className="mt-4 max-w-[700px] font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            We aspire to deliver convenience and efficiency with our user-centric solutions
          </h2>
        </Reveal>

        {/* The vision block sits inside one glass panel, closing on the
            statement that gives the section its point. */}
        <Reveal
          delay={0.05}
          className="relative mt-8 overflow-hidden rounded-3xl border border-grid p-7 min-[641px]:p-10"
          style={{
            background: "var(--grad-card)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "var(--inset-top), 0 18px 44px rgba(0,0,0,0.28)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-[120px] h-[280px] w-[340px]"
            style={{
              background: "radial-gradient(circle, rgba(90,201,148,0.16), transparent 70%)",
              filter: "blur(12px)",
            }}
          />
          <div className="relative font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent">
            — Our vision
          </div>
          <div
            data-ndi-3col="1"
            className="relative mt-7 grid grid-cols-1 gap-4 min-[641px]:grid-cols-3"
          >
            {vision.map((pillar) => (
              <div
                key={pillar.id}
                className="flex flex-col items-center gap-3.5 rounded-2xl border border-grid bg-white/[0.02] p-[26px]"
              >
                <Image
                  src={mediaUrl(pillar.icon)}
                  alt=""
                  width={pillar.icon.width}
                  height={pillar.icon.height}
                  className="h-16 w-16 object-contain"
                />
                <div className="font-display text-[16.5px] font-semibold text-strong">
                  {pillar.label}
                </div>
              </div>
            ))}
          </div>
          <p className="relative mx-auto mt-7 max-w-[760px] text-center font-display text-[21px] font-medium leading-[1.4] tracking-[-0.02em] text-strong [text-wrap:pretty]">
            <span className="text-accent">Bhutan NDI</span> accelerates seamless access to
            government, business, and financial services by building a digital ecosystem rooted in
            trust.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-11">
          <Eyebrow>— Our mission</Eyebrow>
          <div
            data-ndi-3col="1"
            className="mt-6 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4"
          >
            {mission.map((statement) => (
              <div
                key={statement.id}
                className="flex flex-col gap-4 rounded-2xl border border-grid bg-white/[0.02] p-[26px]"
              >
                <Image
                  src={mediaUrl(statement.icon)}
                  alt=""
                  width={statement.icon.width}
                  height={statement.icon.height}
                  className="h-16 w-16 object-contain"
                />
                <p className="text-[14.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {statement.segments.map((segment, index) =>
                    segment.emphasis ? (
                      <span key={index} className="text-accent">
                        {segment.text}
                      </span>
                    ) : (
                      <span key={index}>{segment.text}</span>
                    ),
                  )}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </PageSection>

      {/* ============ TEAM ============ */}
      <PageSection id="team" className="pb-[104px] pt-14">
        <Reveal>
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
