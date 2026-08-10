import Link from "next/link";

import { Eyebrow } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";

/**
 * Stub for the nine page designs that are out of scope for Phase 1.
 *
 * They exist so every link in the nav and footer resolves rather than 404s,
 * and so the shared shell (atmosphere, header, footer) can be reviewed on a
 * non-home route.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1200px] flex-col items-start justify-center px-8 pb-24 pt-[184px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] text-strong">
        {title}
      </h1>
      <p className="mt-5 max-w-[560px] text-[17px] leading-[1.62] text-muted">{description}</p>
      <p className="mt-3 max-w-[560px] text-[15px] leading-[1.62] text-faint">
        This page is designed but not yet built — Phase 1 covers the home page.
      </p>
      <Link
        href="/"
        className="ndi-va mt-8 inline-flex h-[38px] flex-none items-center gap-[7px] rounded-[10px] border border-divider bg-[#18202c] px-[15px] font-display text-[13.5px] font-semibold text-strong transition-[border-color,background,color] duration-[280ms] ease-ndi"
      >
        Back to home
        <Icon name="arrowRight" size={14} strokeWidth={1.9} />
      </Link>
    </section>
  );
}
