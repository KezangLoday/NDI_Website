"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { siteSettings } from "@/content/siteSettings";
import { externalLinkProps } from "@/lib/links";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { Icon } from "../ui/icons";

const { footer, contact, social } = siteSettings;

/**
 * Sticky "curtain" footer: the page scrolls away to reveal it, and its content
 * scales up from 0.86 as more of the band comes into view.
 *
 * The 430px band height is a CSS variable rather than a constant because the
 * footer content needs more room once the columns stack — the prototype's
 * fixed height clipped them on narrow screens.
 */
export function SiteFooter() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /**
   * Size the curtain band to the footer's own content, and fall back to a
   * normal block when it cannot fit.
   *
   * The band was three hard-coded values before; once the columns stack, the
   * content outgrows all of them and `overflow:hidden` cuts the copyright bar
   * off. The CSS values now act as a floor and the real height is measured.
   *
   * The curtain also only works while the footer is shorter than the viewport:
   * it reveals the band by scrolling the page off it, so a footer taller than
   * the screen has nothing to be revealed against and `top` would go negative.
   * Below that threshold the footer lays out as an ordinary block.
   */
  useEffect(() => {
    const curtain = curtainRef.current;
    const footer = footerRef.current;
    if (!curtain || !footer) return;

    const measure = () => {
      // offsetHeight, not a bounding rect: it is the settled layout height, so
      // the columns' entrance transform cannot inflate the band mid-animation.
      const height = footer.offsetHeight;
      curtain.style.setProperty("--foot-h", `${height}px`);
      curtain.dataset.mode = height <= window.innerHeight - 40 ? "curtain" : "static";
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    // Re-measure once webfonts have settled, which reflows the columns.
    const settle = setTimeout(measure, 400);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(settle);
    };
  }, []);

  /**
   * Zoom scrubbed by how much of the band has been revealed, and the columns'
   * staggered entrance.
   *
   * Both hang off the same scroll signal. The entrance used to be driven by an
   * IntersectionObserver on the footer, which never fired inside the clipped,
   * sticky curtain — so `.ndi-foot-in` was never applied and the columns and
   * copyright bar sat permanently 30px low, spilling past the band's bottom
   * edge and being clipped there. The scrub already knows when the band is in
   * view, so it flips the class too.
   */
  useEffect(() => {
    const zoom = zoomRef.current;
    const curtain = curtainRef.current;
    const footer = footerRef.current;
    if (!zoom || !curtain || !footer) return;

    if (reduced) {
      zoom.style.opacity = "1";
      zoom.style.transform = "none";
      footer.classList.add("ndi-foot-in");
      return;
    }

    let frame = 0;
    const scrub = () => {
      frame = 0;
      // Nothing to scrub against once the footer is a plain block.
      if (curtain.dataset.mode === "static") {
        zoom.style.opacity = "1";
        zoom.style.transform = "none";
        footer.classList.add("ndi-foot-in");
        return;
      }
      const rect = curtain.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / Math.max(1, rect.height)),
      );
      if (progress > 0.02) footer.classList.add("ndi-foot-in");
      const eased = 1 - Math.pow(1 - progress, 3);
      zoom.style.opacity = eased.toFixed(3);
      zoom.style.transform = `scale(${(0.86 + 0.14 * eased).toFixed(4)}) translateY(${((1 - eased) * 44).toFixed(1)}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(scrub);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    scrub();
    const settle = setTimeout(scrub, 400);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      ref={curtainRef}
      className="ndi-footer-curtain relative"
      style={{ height: "var(--foot-h)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="relative" style={{ height: "calc(100vh + var(--foot-h))", top: "-100vh" }}>
        <div className="sticky" style={{ height: "var(--foot-h)", top: "calc(100vh - var(--foot-h))" }}>
          <footer
            ref={footerRef}
            className="relative flex flex-col overflow-hidden border-t border-grid bg-sunken pt-[76px]"
            style={{ minHeight: "var(--foot-min)" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[120px] left-1/2 h-[360px] w-[820px] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(90,201,148,0.22), rgba(18,65,67,0.12) 45%, transparent 72%)",
                filter: "blur(20px)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-[140px] left-1/2 h-[300px] w-[520px] -translate-x-1/2"
              style={{
                background: "radial-gradient(circle, rgba(90,201,148,0.1), transparent 70%)",
                filter: "blur(10px)",
              }}
            />

            {/* Perspective grid floor */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[230px] overflow-hidden"
              style={{
                perspective: "220px",
                perspectiveOrigin: "50% 0%",
                WebkitMaskImage:
                  "radial-gradient(ellipse 76% 105% at 50% 100%, #000 42%, transparent 90%)",
                maskImage:
                  "radial-gradient(ellipse 76% 105% at 50% 100%, #000 42%, transparent 90%)",
              }}
            >
              <div
                className="absolute -left-[30%] -right-[30%] bottom-0 h-[900px]"
                style={{
                  transform: "rotateX(72deg)",
                  transformOrigin: "50% 100%",
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(90,201,148,0.30) 0 1px, transparent 1px 34px), repeating-linear-gradient(to bottom, rgba(90,201,148,0.30) 0 1px, transparent 1px 34px)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 12%, #000 45%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 12%, #000 45%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[120px]"
                style={{ background: "linear-gradient(to top, var(--surface-sunken), transparent)" }}
              />
            </div>

            <div
              ref={zoomRef}
              data-foot-zoom=""
              // flex-auto, not flex-1: a 0 basis would collapse this box and let
              // its content spill out of the band instead of growing it.
              className="relative z-[1] flex flex-auto flex-col opacity-0"
              style={{ transform: "scale(0.86)" }}
            >
              <div
                data-foot-grid=""
                className="mx-auto mb-11 grid w-full max-w-[1200px] grid-cols-1 gap-8 px-8 min-[561px]:grid-cols-2 min-[901px]:grid-cols-[1.5fr_1fr_1fr_1fr] min-[901px]:gap-14"
              >
                <div>
                  <div className="flex items-center">
                    <Image
                      src="/media/logos/ndi-horizontal-white.png"
                      alt="Bhutan NDI"
                      width={1680}
                      height={371}
                      className="h-[34px] w-auto"
                    />
                  </div>
                  <p className="mt-6 max-w-[280px] text-sm leading-[1.62] text-muted">
                    {footer.tagline}
                  </p>
                  <div className="mt-[26px] flex gap-2.5">
                    {social.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        aria-label={item.label}
                        className="ndi-social inline-flex h-10 w-10 items-center justify-center rounded-xl border border-grid bg-white/[0.02] text-muted"
                      >
                        <Icon name={item.icon} size={item.icon === "linkedin" ? 17 : 18} />
                      </a>
                    ))}
                  </div>
                </div>

                {footer.columns.map((column) => (
                  <div key={column.heading}>
                    <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                      {column.heading}
                    </div>
                    <div className="flex flex-col gap-3.5">
                      {column.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          {...externalLinkProps(link.href)}
                          className="ndi-fl inline-flex items-center text-[14.5px] text-muted"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                    Contact
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-2.5 text-[14.5px] text-muted">
                      <Icon name="mapPin" size={17} className="flex-none text-faint" />
                      {contact.location}
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="ndi-fl inline-flex items-center gap-2.5 text-[14.5px] text-muted"
                    >
                      <Icon name="mail" size={17} className="flex-none text-faint" />
                      {contact.email}
                    </a>
                    <a
                      href={contact.officePhoneHref}
                      className="ndi-fl inline-flex items-center gap-2.5 text-[14.5px] text-muted"
                    >
                      <Icon name="phoneOutline" size={17} className="flex-none text-faint" />
                      {contact.officePhoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="ndi-foot-bar relative z-[1] mx-auto mb-0 mt-auto flex w-full max-w-[1200px] flex-wrap justify-between gap-3 px-8 pb-[30px] pt-5 font-mono text-[11px] text-faint">
                <span>{footer.legal}</span>
                <span>{footer.legalLinks}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
