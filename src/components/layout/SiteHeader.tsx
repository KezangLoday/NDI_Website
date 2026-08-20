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
import { ShinyButton } from "../ui/ShinyButton";

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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeKey = activeNavKey(pathname);

  /* Home is reachable from the logo, which is not obvious on a phone where the
     logo reads as branding. The mobile list says so explicitly. */
  const mobilePrimary = [{ label: "Home", href: "/", navKey: undefined as string | undefined }, ...nav.primary];

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
      <header className="fixed left-1/2 top-4 z-[60] flex h-16 w-[calc(100%-28px)] max-w-[1136px] -translate-x-1/2 items-center py-2.5 pl-[18px] pr-3 min-[901px]:top-6 min-[901px]:w-[calc(100%-64px)] min-[901px]:pl-[26px]">
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
            sizes="150px"
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
          aria-label={mobileOpen ? "Close menu" : "Menu"}
          aria-expanded={mobileOpen}
          aria-controls="ndi-mobile-menu"
          className="ndi-nav-in relative z-[1] ml-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-strong transition-colors duration-[220ms] min-[901px]:hidden"
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

      {/* Mobile menu.
          Anchored under the header rather than sliding in as its own surface:
          the header already carries the logo and the control that opened this,
          so a sheet with a second logo and a second close button restated both
          and moved them while it did. The bar stays where it was and the menu
          opens beneath it. */}
      <div
        className="ndi-menu-scrim min-[901px]:hidden"
        onClick={closeMobile}
        aria-hidden="true"
        style={{
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      />
      <div
        id="ndi-mobile-menu"
        className="ndi-menu-panel min-[901px]:hidden"
        aria-hidden={!mobileOpen}
        style={{
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
          pointerEvents: mobileOpen ? "auto" : "none",
          transform: `translateY(${mobileOpen ? "0" : "-8px"})`,
        }}
      >
        <nav className="flex flex-col px-5 pb-12 pt-1" aria-label="Mobile">
          {mobilePrimary.map((link) => {
            const isActive = link.navKey
              ? activeKey === link.navKey
              : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                data-active={isActive ? "1" : "0"}
                aria-current={isActive ? "page" : undefined}
                className="ndi-menu-row flex items-center justify-between gap-4 border-b border-subtle px-1 py-[18px]"
              >
                <span className="ndi-menu-label font-display text-[26px] font-semibold tracking-[-0.02em]">
                  {link.label}
                </span>
                <Icon name="arrowUpRight" size={19} className="flex-none opacity-50" />
              </Link>
            );
          })}

          {nav.menus.map((menu) => {
            const groupActive = activeKey === menu.key;
            return (
              /* Native disclosure rather than a measured height. `name` makes the
                 set exclusive in the browsers that support it, and the element
                 sizes itself, which a grid row set to 1fr does not do inside an
                 auto-height container. */
              <details
                key={menu.key}
                name="ndi-mobile-menu-section"
                className="ndi-menu-details"
                open={groupActive}
              >
                <summary
                  data-active={groupActive ? "1" : "0"}
                  className="ndi-menu-row flex cursor-pointer items-center justify-between gap-4 border-b border-subtle px-1 py-[18px]"
                >
                  <span className="ndi-menu-label font-display text-[26px] font-semibold leading-[normal] tracking-[-0.02em]">
                    {menu.label}
                  </span>
                  <Icon
                    name="chevronDown"
                    size={19}
                    className="ndi-menu-caret flex-none opacity-50"
                  />
                </summary>
                {/* Sub-items sat at 15px under a 30px heading, which read as
                    fine print rather than as the section's contents. */}
                <div className="flex flex-col gap-0.5 py-2 pb-4 pl-1">
                  {[...menu.cards, ...menu.links].map((item) => {
                    const itemActive = pathname === item.href.split("#")[0];
                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        {...externalLinkProps(item.href)}
                        onClick={closeMobile}
                        data-active={itemActive ? "1" : "0"}
                        className="ndi-menu-sub flex items-center gap-2.5 rounded-lg px-2 py-2.5 font-display text-[18px] font-medium"
                      >
                        <span className="ndi-menu-sub-dot" aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}

          {/* White, not mint: in the accent colour it read as the active page. */}
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
            data-active="0"
            className="ndi-menu-row flex items-center justify-between gap-4 border-b border-subtle px-1 py-[18px]"
          >
            <span className="ndi-menu-label font-display text-[26px] font-semibold tracking-[-0.02em]">
              Contact Us
            </span>
            <Icon name="arrowUpRight" size={19} className="flex-none opacity-50" />
          </Link>

          <div className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            Bhutan NDI · {contact.location}
          </div>
          <div className="mt-3.5 flex gap-2.5">
            {mobileSocial.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...externalLinkProps(item.href)}
                aria-label={item.label}
                className="ndi-sheet-social inline-flex h-11 w-11 items-center justify-center rounded-xl border border-grid bg-transparent text-muted transition-all duration-[220ms]"
              >
                <Icon name={item.icon} size={18} />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
