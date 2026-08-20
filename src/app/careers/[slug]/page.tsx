import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/layout/PageHero";
import { ApplicationForm } from "@/components/pages/careers/ApplicationForm";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { getJobBySlug, getJobs } from "@/content";
import { formatCalendarDate } from "@/lib/format";

/**
 * One vacancy: the terms of reference, then the form.
 *
 * Both on one page and in that order, because they are one task. A listing
 * that sends an applicant to a second page — or worse, to an email address —
 * loses the people who were reading on a phone between two other things.
 *
 * The facts an applicant checks first (type, slots, closing date, location)
 * are pulled out of the prose into a summary block at the top, and repeated
 * nowhere. The prose is then free to be prose.
 */

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const roles = await getJobs();
  return roles.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Vacancy not found — Bhutan NDI" };
  return {
    title: `${job.title} — Careers at Bhutan NDI`,
    description: job.summary,
  };
}

export default async function VacancyPage({ params }: Params) {
  const { slug } = await params;
  const [job, all] = await Promise.all([getJobBySlug(slug), getJobs()]);
  if (!job) notFound();

  const others = all.filter((entry) => entry.slug !== job.slug).slice(0, 3);

  const facts: [string, string][] = [
    ["Employment", job.employmentType],
    ["Positions", String(job.slots)],
    ["Location", job.location],
    ["Level", job.level],
    ["Posted", formatCalendarDate(job.postedAt)],
    ["Closes", formatCalendarDate(job.closesAt)],
  ];

  return (
    <>
      <PageSection className="pb-4 pt-36">
        <Reveal>
          <Link
            href="/careers#openings"
            className="ndi-backlink inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
          >
            <Icon name="arrowRight" size={13} strokeWidth={2} className="rotate-180" />
            All vacancies
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="ndi-vacancy-pill" data-tone="mint">
              {job.employmentType}
            </span>
            <span className="ndi-vacancy-pill" data-tone="plain">
              {job.slots} {job.slots === 1 ? "position" : "positions"}
            </span>
            <span className="ndi-vacancy-pill" data-tone="plain">
              {job.department}
            </span>
          </div>

          <h1 className="mt-5 max-w-[18ch] font-display text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.03em] text-strong [text-wrap:balance]">
            {job.title}
          </h1>
          <p className="mt-6 max-w-[64ch] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            {job.about}
          </p>

          <a
            href="#apply"
            data-dir="forward"
            className="ndi-backbtn mt-8 inline-flex h-[46px] items-center gap-2.5 rounded-full border border-grid px-[22px] font-display text-[14.5px] font-semibold text-body"
          >
            Apply for this role
            <Icon name="arrowRight" size={15} strokeWidth={2} />
          </a>
        </Reveal>
      </PageSection>

      <PageSection className="pb-[104px] pt-12">
        <div className="grid grid-cols-1 gap-12 min-[1001px]:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] min-[1001px]:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-faint">
                Terms of reference
              </h2>
              {/* The dummy eligibility bars come from the mock content and are
                  flagged there; HR replaces them before this is published. */}
              {job.sections.map((section) => (
                <section key={section.heading} className="mt-10 first:mt-7">
                  <h3 className="font-display text-[21px] font-semibold leading-[1.25] tracking-[-0.02em] text-strong">
                    {section.heading}
                  </h3>
                  <ul className="mt-4 flex max-w-[68ch] flex-col gap-3">
                    {section.items.map((item) => (
                      <li key={item} className="ndi-tor-item text-[15px] leading-[1.7] text-body [text-wrap:pretty]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Reveal>

            <Reveal delay={0.05} id="apply" className="mt-16 scroll-mt-28">
              <div className="border-t border-subtle pt-12">
                <h2 className="font-display text-[clamp(26px,3vw,34px)] font-semibold leading-[1.12] tracking-[-0.03em] text-strong">
                  Apply for this role
                </h2>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
                  One form, about five minutes. Everything marked required is a criterion in the
                  terms of reference above.
                </p>
                <div className="mt-9">
                  <ApplicationForm job={job} />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <aside className="min-[1001px]:sticky min-[1001px]:top-[110px]">
              <div data-gov-card="1" className="rounded-2xl border border-grid p-[22px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  At a glance
                </span>
                <dl className="mt-4 flex flex-col">
                  {facts.map(([term, value], index) => (
                    <div
                      key={term}
                      className={`flex items-baseline justify-between gap-4 py-2.5 ${
                        index < facts.length - 1 ? "border-b border-subtle" : ""
                      }`}
                    >
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {term}
                      </dt>
                      <dd className="text-right text-[13.5px] text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="#apply"
                  className="ndi-tut mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
                >
                  Go to the form
                  <Icon name="arrowRight" size={13} strokeWidth={2} />
                </a>
              </div>

              {others.length ? (
                <div className="mt-10">
                  <h2 className="font-display text-[16.5px] font-semibold tracking-[-0.02em] text-strong">
                    Other openings
                  </h2>
                  <div className="mt-4 flex flex-col">
                    {others.map((entry) => (
                      <Link
                        key={entry.id}
                        href={`/careers/${entry.slug}`}
                        className="ndi-otherjob group flex flex-col gap-1.5 border-t border-subtle py-4"
                      >
                        <span className="font-display text-[14.5px] font-semibold leading-[1.3] tracking-[-0.01em] text-strong">
                          {entry.title}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {entry.employmentType} · {entry.location}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </Reveal>
        </div>
      </PageSection>
    </>
  );
}
