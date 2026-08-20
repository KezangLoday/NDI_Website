import type { Metadata } from "next";
import Image from "next/image";

import { PageSection } from "@/components/layout/PageHero";
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

/**
 * Revalidate daily as a floor. Only the team section is CMS-managed; publishing
 * a team member revalidates this route on demand.
 */
export const revalidate = 86_400;

const HERO_PILLS = ["Security", "Privacy", "Consent"];

/**
 * The leading verb of each story bullet, used as its heading.
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
      {/* `data-circuit-hero` puts the Home page's circuit field behind this
          section — see Atmosphere and measureMask. */}
      <PageSection
        id="about"
        data-circuit-hero=""
        className="relative pb-[72px] pt-[168px]"
      >
        <Reveal className="relative text-center">
          {/* The shared eyebrow, not a dotted pill: every other section on the
              site labels itself with the dash form, and one page wearing a
              different badge reads as a different site. */}
          <Eyebrow>— About Bhutan NDI</Eyebrow>

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

        {/* The three facts, divided rather than boxed — the hero has no panel
            to carry them now, and a bordered band would fight the traces
            behind it. */}
        <Reveal
          delay={0.08}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden min-[641px]:grid-cols-3"
        >
          {story.stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`py-5 text-center min-[641px]:py-2 ${
                index > 0 ? "border-t border-subtle min-[641px]:border-l min-[641px]:border-t-0" : ""
              }`}
            >
              <div className="font-display text-[24px] font-semibold tracking-[-0.02em] text-strong min-[641px]:text-[27px]">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>
      </PageSection>

      {/* ============ STORY ============ */}
      <PageSection data-circuit-next="" className="py-[72px]">
        <Reveal className="max-w-[820px]">
          <Eyebrow>— Our story</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(26px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            The foundation for Bhutan&apos;s digital economy
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-body [text-wrap:pretty]">
            Facilitating trusted interactions between individuals and organizations. Bhutan NDI:
          </p>
        </Reveal>

        {/* Thesis: this is prose, and prose needs measure. Four columns gave
            each sentence roughly 24 characters a line and six lines to fall
            down, which is unreadable however it is decorated. Full width with a
            hanging number puts every sentence on two lines at a comfortable
            measure, and the numerals — set large and faint in the gutter — are
            what carries the rhythm the columns were trying to supply. */}
        <div className="mt-10 flex max-w-[880px] flex-col">
          {story.bullets.map((bullet, index) => (
            <Reveal key={bullet} delay={0.06 * (index + 1)}>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-t border-subtle py-7 min-[641px]:gap-x-10">
                <span
                  aria-hidden="true"
                  className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-faint/70 min-[641px]:text-[34px]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[16px] leading-[1.7] text-body [text-wrap:pretty]">
                  <span className="font-semibold text-strong">{BULLET_KICKERS[index]}</span>{" "}
                  {bullet.replace(new RegExp(`^${BULLET_KICKERS[index]}\\s*`), "")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ============ VISION ============
          One composition, not three boxes and a caption. The statement is the
          vision; the three principles are what it rests on, so they sit beside
          it as a supporting column rather than as equal cards above it. The
          artwork is the asset here and was being shrunk inside mostly-empty
          panels — unboxed it can run at a size worth looking at. */}
      <PageSection className="py-14">
        <Reveal className="max-w-[760px]">
          <Eyebrow>— Our vision</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            We aspire to deliver convenience and efficiency with our user-centric solutions
          </h2>
        </Reveal>

        <div
          data-ndi-2col="1"
          className="mt-14 flex flex-col items-start gap-14 min-[901px]:flex-row min-[901px]:items-center min-[901px]:gap-16"
        >
          {/* flex-none rather than a grid column: a fraction column is far
              wider than three short labels and left a gulf before the quote. */}
          <div className="flex flex-none flex-col gap-10">
            {vision.map((pillar, index) => (
              <Reveal key={pillar.id} delay={0.06 * (index + 1)}>
                <div className="flex items-center gap-6">
                  <Image
                    src={mediaUrl(pillar.icon)}
                    alt=""
                    width={pillar.icon.width}
                    height={pillar.icon.height}
                    className="h-[68px] w-[68px] flex-none object-contain"
                  />
                  <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong">
                    {pillar.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24} className="min-[901px]:flex-1">
            <p className="border-l border-subtle pl-8 font-display text-[clamp(21px,2.4vw,28px)] font-medium leading-[1.44] tracking-[-0.02em] text-strong [text-wrap:pretty]">
              <span className="text-accent">Bhutan NDI</span> accelerates seamless access to
              government, business, and financial services by building a digital ecosystem rooted
              in trust.
            </p>
          </Reveal>
        </div>
      </PageSection>

      {/* ============ MISSION ============
          Four declarations, set as declarations. A card each made them look
          like four comparable products; with the mark beside the sentence and
          space instead of a border, they read as things the organisation is
          committing to. No rules either — the story section above already uses
          those, and repeating them would flatten the two into one texture. */}
      <PageSection className="py-14">
        <Reveal className="max-w-[760px]">
          <Eyebrow>— Our mission</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:pretty]">
            Four commitments we build against
          </h2>
        </Reveal>

        <div
          data-ndi-2col="1"
          className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 min-[761px]:grid-cols-2"
        >
          {mission.map((statement, index) => (
            <Reveal key={statement.id} delay={0.06 * (index + 1)}>
              <div className="flex items-start gap-5">
                <Image
                  src={mediaUrl(statement.icon)}
                  alt=""
                  width={statement.icon.width}
                  height={statement.icon.height}
                  className="h-14 w-14 flex-none object-contain"
                />
                <p className="max-w-[42ch] pt-1 text-[16px] leading-[1.65] text-body [text-wrap:pretty]">
                  {statement.segments.map((segment, segmentIndex) =>
                    segment.emphasis ? (
                      <span key={segmentIndex} className="font-semibold text-accent">
                        {segment.text}
                      </span>
                    ) : (
                      <span key={segmentIndex}>{segment.text}</span>
                    ),
                  )}
                </p>
              </div>
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
