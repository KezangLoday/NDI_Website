"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { navGroups, siteSettings } from "@/content/siteSettings";
import type { MegaMenu, MegaMenuCard } from "@/content/types";
import { externalLinkProps } from "@/lib/links";
import { scrollToContact } from "@/lib/scroll";

import { GridPattern } from "./GridPattern";
import { Icon } from "../ui/icons";
import { ShinyButton } from "../ui/shiny-button";

const { nav, contact, mobileSocial } = siteSettings;

/**
 * Entrance stagger in the prototype's order — logo, nav links, then every
 * button — as a CSS animation delay, so nothing depends on a mount render.
 */
const entrance = (index: number): CSSProperties => ({
  animationDelay: `${60 + index * 75}ms`,
});

function activeNavKey(pathname: string): string | null {
  for (const [key, paths] of Object.entries(navGroups)) {
    if (paths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return key;
  }
  return null;
}

/** The doubled label that rolls up on hover. */
function RollUp({ label }: { label: string }) {
  return (
    <span className="ndi-rollup">
      <span className="ndi-rollup-col">
        <span>{label}</span>
        <span>{label}</span>
      </span>
    </span>
  );
}

function MegaCard({ card, reroll }: { card: MegaMenuCard; reroll: number }) {
  return (
    <Link
      href={card.href}
      className="ndi-gc relative flex min-h-[170px] flex-col justify-between gap-8 overflow-hidden rounded-xl border border-white/[0.14] bg-white/[0.02] p-[18px] transition-[background,border-color,box-shadow,transform] duration-[220ms]"
    >
      <GridPattern reroll={reroll} />
      <span className="ndi-navicon relative text-accent">
        <Icon name={card.icon} size={22} />
      </span>
      <div className="relative">
        <div className="font-display text-[15px] font-semibold text-strong">{card.label}</div>
        <div className="mt-[3px] text-[12.5px] leading-[1.45] text-muted">{card.description}</div>
      </div>
    </Link>
  );
}

function MegaListLink({ card }: { card: MegaMenuCard }) {
  return (
    <Link
      href={card.href}
      {...externalLinkProps(card.href)}
      className="ndi-fill flex items-center justify-between gap-3 rounded-xl border border-white/[0.14] bg-white/[0.02] px-4 py-[17px] text-body transition-[background,border-color] duration-[220ms]"
    >
      <div className="min-w-0">
        {/* Explicit sizes, not text-sm/text-xs: those bundle a line-height and
            the design leaves these inheriting the body's 1.62. */}
        <div className="font-display text-[14px] font-semibold text-strong">{card.label}</div>
        <div className="mt-0.5 text-[12px] text-body">{card.description}</div>
      </div>
      <span className="ndi-navicon flex-none text-accent">
        <Icon name={card.icon} size={20} />
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [reroll, setReroll] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeKey = activeNavKey(pathname);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Body scroll lock while the mobile sheet is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const open = (key: string) => {
    clearTimeout(closeTimer.current);
    // Each opening re-scatters the cards' wireframe grids, the way a fresh page
    // load does in the prototype.
    if (openMenu !== key) setReroll((n) => n + 1);
    setOpenMenu(key);
  };

  // Delayed close so moving from the trigger into the centred panel — which
  // leaves a horizontal dead zone below each trigger — doesn't dismiss it.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 70);
  };

  const goToContact = () => {
    if (pathname === "/") {
      scrollToContact();
    } else {
      router.push("/#contact");
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  const panelStyle = (key: string): CSSProperties => {
    const isOpen = openMenu === key;
    return {
      position: "absolute",
      top: "100%",
      left: "50%",
      paddingTop: 20,
      zIndex: 70,
      transform: `translateX(-50%) translateY(${isOpen ? "0" : "-6px"})`,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      pointerEvents: isOpen ? "auto" : "none",
      transition: isOpen
        ? "transform 0.18s var(--ease-out)"
        : "opacity 0.24s var(--ease-out), transform 0.24s var(--ease-out), visibility 0s 0.24s",
    };
  };

  const renderMenu = (menu: MegaMenu, triggerIndex: number) => (
    <div key={menu.key} style={{ position: "static" }} onMouseEnter={() => open(menu.key)} onMouseLeave={scheduleClose}>
      <button
        type="button"
        className="ndi-nav-in ndi-navlink inline-flex cursor-pointer items-center gap-[5px] whitespace-nowrap rounded-[9px] border-none bg-transparent px-2.5 py-2 font-display text-[13.5px] font-medium text-strong"
        data-active={activeKey === menu.key ? "1" : "0"}
        aria-expanded={openMenu === menu.key}
        onClick={() => (openMenu === menu.key ? setOpenMenu(null) : open(menu.key))}
        style={entrance(triggerIndex)}
      >
        <RollUp label={menu.label} />
        <Icon
          name="chevronDown"
          size={13}
          strokeWidth={2}
          className="transition-transform duration-[220ms] ease-ndi"
          style={{ transform: `rotate(${openMenu === menu.key ? 180 : 0}deg)` }}
        />
      </button>

      <div style={panelStyle(menu.key)}>
        <div
          className="grid gap-0 rounded-2xl border border-white/[0.08]"
          style={{
            width: menu.panelWidth,
            gridTemplateColumns: `1fr ${menu.key === "resources" ? "260px" : "320px"}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.006)), rgba(15,20,31,0.85)",
            backdropFilter: "blur(15px) saturate(140%)",
            WebkitBackdropFilter: "blur(15px) saturate(140%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 26px 64px -12px rgba(0,0,0,0.72), 0 6px 18px -8px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="grid gap-2 border-r border-white/[0.14] p-4"
            style={{ gridTemplateColumns: `repeat(${menu.cards.length}, 1fr)` }}
          >
            {menu.cards.map((card) => (
              <MegaCard key={card.href + card.label} card={card} reroll={reroll} />
            ))}
          </div>
          <div className="flex flex-col gap-2 p-4">
            {menu.links.map((card) => (
              <MegaListLink key={card.href + card.label} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed left-1/2 top-6 z-[60] flex h-16 w-[calc(100%-64px)] max-w-[1136px] -translate-x-1/2 items-center py-2.5 pl-[26px] pr-3">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)), rgba(18,24,37,0.80)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 34px -12px rgba(0,0,0,0.5)",
          }}
        />

        <Link
          href="/"
          className="ndi-nav-in relative z-[1] mr-4 inline-flex flex-none items-center"
          style={entrance(0)}
        >
          <Image
            src="/media/logos/ndi-horizontal-white.png"
            alt="Bhutan NDI"
            width={1680}
            height={371}
            priority
            className="block h-[26px] w-auto"
          />
        </Link>

        <nav className="ndi-desktop-nav relative z-[1] hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0.5 min-[901px]:flex">
          {nav.primary.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="ndi-nav-in ndi-navlink inline-flex items-center whitespace-nowrap rounded-[9px] px-2.5 py-2 font-display text-[13.5px] font-medium text-strong"
              data-active={activeKey === link.navKey ? "1" : "0"}
              aria-current={activeKey === link.navKey ? "page" : undefined}
              style={entrance(index + 1)}
            >
              <RollUp label={link.label} />
            </Link>
          ))}
          {nav.menus.map((menu, index) => renderMenu(menu, nav.primary.length + 1 + index))}
        </nav>

        {/* The entrance animation sits on this wrapper, not on the button:
            both would set `animation` on the same element, and the later rule
            would replace the shine's rotation outright. */}
        <div
          className="ndi-nav-in relative z-[1] ml-4 hidden flex-none min-[901px]:block"
          style={entrance(nav.primary.length + nav.menus.length + 1)}
        >
          <ShinyButton
            onClick={goToContact}
            className="h-11 tracking-[-0.01em]"
            style={
              {
                "--shiny-cta-px": "26px",
                "--shiny-cta-py": "0",
                "--shiny-cta-fs": "14px",
                "--shiny-cta-glow": "0.55",
              } as CSSProperties
            }
          >
            Contact Us
          </ShinyButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          className="ndi-nav-in relative z-[1] ml-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-strong min-[901px]:hidden"
          style={entrance(nav.primary.length + nav.menus.length + 2)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={mobileOpen ? "M18 6 6 18 M6 6l12 12" : "M4 6h16 M4 12h16 M4 18h16"} />
          </svg>
        </button>
      </header>

      {/* Mobile sheet */}
      <div
        className="ndi-sheet-overlay"
        onClick={closeMobile}
        style={{
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      />
      <aside
        className="ndi-sheet"
        aria-hidden={!mobileOpen}
        style={{ transform: `translateX(${mobileOpen ? "0" : "100%"})` }}
      >
        <div
          className="mx-3.5 mt-3.5 flex flex-none items-center justify-between gap-4 rounded-2xl border border-grid py-3 pl-4 pr-3"
          style={{
            background:
              "radial-gradient(115% 78% at 26% -6%, rgba(111,224,169,0.20) 0%, rgba(90,201,148,0.06) 42%, rgba(90,201,148,0) 68%), linear-gradient(162deg, #103440 0%, #101827 64%)",
          }}
        >
          <Image
            src="/media/logos/ndi-horizontal-white.png"
            alt="Bhutan NDI"
            width={1680}
            height={371}
            className="h-[26px] w-auto"
          />
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close"
            className="inline-flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-xl border border-grid bg-transparent text-strong transition-colors hover:border-[color:var(--border-strong)] hover:text-accent"
          >
            <Icon name="close" size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-[22px] pb-8 pt-[26px]">
          {nav.primary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="flex items-center justify-between gap-4 border-b border-subtle px-1 py-[22px] font-display text-[30px] font-semibold tracking-[-0.02em] text-strong hover:text-accent"
            >
              {link.label}
              <Icon name="arrowUpRight" size={20} className="flex-none opacity-55" />
            </Link>
          ))}

          {nav.menus.map((menu) => {
            const isOpen = openAccordion === menu.key;
            return (
              <div key={menu.key} className="contents">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(isOpen ? null : menu.key)}
                  aria-expanded={isOpen}
                  // leading-[normal] matches the design, where this trigger is a
                  // <button> and so keeps the UA's normal leading rather than
                  // inheriting the body's 1.62 the way the sibling links do.
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-subtle bg-transparent px-1 py-[22px] text-left font-display text-[30px] font-semibold leading-[normal] tracking-[-0.02em] text-strong"
                >
                  {menu.label}
                  <Icon
                    name="chevronDown"
                    size={20}
                    className="flex-none opacity-55 transition-transform duration-[280ms] ease-ndi"
                    style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
                  />
                </button>
                <div className="ndi-acc-panel" style={{ height: isOpen ? 272 : 0 }}>
                  <div className="flex flex-col py-1.5 pb-3.5">
                    {[...menu.cards, ...menu.links].map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        {...externalLinkProps(item.href)}
                        onClick={closeMobile}
                        className="px-1 py-3 text-[15px] text-body hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/#contact"
            onClick={(event) => {
              if (pathname === "/") {
                event.preventDefault();
                closeMobile();
                setTimeout(scrollToContact, 20);
              } else {
                closeMobile();
              }
            }}
            className="flex items-center justify-between gap-4 border-b border-subtle px-1 py-[22px] font-display text-[30px] font-semibold tracking-[-0.02em] text-accent hover:text-accent-hover"
          >
            Contact Us
            <Icon name="arrowUpRight" size={20} className="flex-none" />
          </Link>

          <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Bhutan NDI · {contact.location}
          </div>
          <div className="mt-4 flex gap-2.5">
            {mobileSocial.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="ndi-sheet-social inline-flex h-11 w-11 items-center justify-center rounded-xl border border-grid bg-transparent text-muted transition-all duration-[220ms]"
              >
                <Icon name={item.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
