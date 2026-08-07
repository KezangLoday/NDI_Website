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

function PersonCard({ member, height }: { member: TeamMember; height: number }) {
  return (
    <div className="ndi-role-card overflow-hidden rounded-2xl border border-grid bg-white/[0.02]">
      <div className="relative w-full" style={{ height }}>
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
      <div className="p-5">
        <div className="font-display text-[16.5px] font-semibold leading-[1.25] text-strong">
          {member.name}
        </div>
        <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
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
      <PageSection id="about" className="pb-6 pt-44">
        <Reveal className="grid grid-cols-1 items-center gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-14">
          <div>
            <Eyebrow>— About us</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(38px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
              We enhance and improve <Emphasis>digital services</Emphasis>
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
              Keeping security, privacy, and consent at the heart of Bhutan NDI.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {HERO_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-2 rounded-full border border-grid bg-white/[0.02] px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    style={{ boxShadow: "var(--glow-sm)" }}
                  />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-grid"
            style={{ boxShadow: "var(--inset-top), 0 18px 44px rgba(5,10,18,0.45)" }}
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
      <PageSection className="py-16">
        <Reveal>
          <h2 className="max-w-[900px] font-display text-[clamp(26px,3.2vw,38px)] font-semibold leading-[1.14] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Bhutan NDI has been introduced as the foundation for Bhutan&apos;s digital economy
          </h2>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[1.62] text-muted">
            Facilitating trusted interactions between individuals and organizations. Bhutan NDI:
          </p>

          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-5 min-[901px]:grid-cols-2">
            {story.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-accent"
                  style={{ boxShadow: "var(--glow-sm)" }}
                />
                <p className="text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-grid pt-8 min-[641px]:grid-cols-3">
            {story.stats.map((stat) => (
              <div key={stat.id}>
                <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong">
                  {stat.value}
                </div>
                <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </PageSection>

      {/* ============ VISION & MISSION ============ */}
      <PageSection className="py-16">
        <Reveal>
          <Eyebrow>— Vision &amp; mission</Eyebrow>
          <h2 className="mt-4 max-w-[900px] font-display text-[clamp(26px,3.2vw,38px)] font-semibold leading-[1.14] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            We aspire to deliver convenience and efficiency with our user-centric solutions
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <Eyebrow>— Our vision</Eyebrow>
          <div className="mt-7 grid grid-cols-1 gap-4 min-[641px]:grid-cols-3">
            {vision.map((pillar) => (
              <div
                key={pillar.id}
                className="ndi-spot flex flex-col items-center gap-4 rounded-2xl border border-grid bg-white/[0.02] px-6 py-9 text-center"
              >
                <div className="ndi-spot-halo" />
                <div className="ndi-spot-fill" />
                <Image
                  src={mediaUrl(pillar.icon)}
                  alt=""
                  width={pillar.icon.width}
                  height={pillar.icon.height}
                  className="h-16 w-16 object-contain"
                />
                <div className="font-display text-[17px] font-semibold text-strong">
                  {pillar.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Eyebrow>— Our mission</Eyebrow>
          <div className="mt-7 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4">
            {mission.map((statement) => (
              <div
                key={statement.id}
                className="ndi-spot flex flex-col gap-5 rounded-2xl border border-grid bg-white/[0.02] p-6"
              >
                <div className="ndi-spot-halo" />
                <div className="ndi-spot-fill" />
                <Image
                  src={mediaUrl(statement.icon)}
                  alt=""
                  width={statement.icon.width}
                  height={statement.icon.height}
                  className="h-14 w-auto object-contain"
                />
                <p className="text-[14.5px] leading-[1.62] text-muted [text-wrap:pretty]">
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
      <PageSection id="team" className="pb-[104px] pt-16">
        <Reveal>
          <Eyebrow>— Team</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
            The people behind the platform
          </h2>
        </Reveal>

        <Reveal
          delay={0.05}
          className="mt-9 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3"
        >
          {leadership.map((member) => (
            <PersonCard key={member.id} member={member} height={320} />
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <Eyebrow>— The team</Eyebrow>
          <div className="mt-7 grid grid-cols-2 gap-4 min-[641px]:grid-cols-3 min-[1001px]:grid-cols-4">
            {members.map((member) => (
              <PersonCard key={member.id} member={member} height={240} />
            ))}
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}
