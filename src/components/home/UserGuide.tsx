import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getWalletBenefits } from "@/content";

/** The mint ring bullet used beside each benefit. */
const BULLET_BACKGROUND =
  "radial-gradient(circle at 50% 50%, var(--accent) 0 3.2px, rgba(90,201,148,0.35) 3.2px 4.2px, " +
  "rgba(90,201,148,0.10) 4.2px 7.4px, rgba(90,201,148,0.04) 7.4px 100%)";

export async function UserGuide() {
  const benefits = await getWalletBenefits();

  return (
    <section id="user-guide" className="mx-auto max-w-[1200px] px-8 py-[88px]">
      <Reveal className="grid grid-cols-1 items-center gap-9 min-[901px]:grid-cols-[1.05fr_1fr] min-[901px]:gap-16">
        <div
          className="ndi-guide-video relative overflow-hidden rounded-2xl border border-grid bg-[#0c111b]"
          style={{ boxShadow: "var(--inset-top), 0 18px 44px rgba(5,10,18,0.45)" }}
        >
          <div className="relative aspect-video">
            <iframe
              src="https://www.youtube.com/embed/hzBgpzzot7w?si=WPBj6fLoNoPbyTaB"
              title="Bhutan NDI — individual user guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 block h-full w-full border-0"
            />
          </div>
        </div>

        <div>
          <Eyebrow>— Individual user guide</Eyebrow>
          <h2 className="mt-4 font-display text-[min(40px,5vw)] font-bold leading-[1.1] tracking-[-0.01em] text-strong">
            What the wallet gives <span className="text-accent">you</span>
          </h2>
          <ul className="mt-[26px] flex list-none flex-col gap-[13px] p-0">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-start gap-[13px]">
                <span
                  aria-hidden="true"
                  className="mt-[5px] h-[18px] w-[18px] flex-none rounded-full border border-[rgba(90,201,148,0.30)]"
                  style={{
                    background: BULLET_BACKGROUND,
                    boxShadow:
                      "0 0 10px rgba(90,201,148,0.35), inset 0 0 6px rgba(90,201,148,0.25)",
                  }}
                />
                <span
                  className="text-[16.5px] leading-[1.55] text-body"
                  style={{ textWrap: "pretty" }}
                >
                  {benefit.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
