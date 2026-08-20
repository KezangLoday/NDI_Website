import type { Metadata } from "next";
import { Host_Grotesk, Inter, DM_Mono } from "next/font/google";

import { Atmosphere } from "@/components/layout/Atmosphere";
import { PointerSpotlightProvider } from "@/components/layout/PointerSpotlightProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for OG/Twitter image URLs; without it Next falls back to localhost.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bhutanndi.com"),
  title: "Bhutan NDI — Your identity, in your control",
  description:
    "Access services securely, verify your identity digitally, and manage your credentials — all from one trusted wallet built on the principle of self-sovereign identity technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides `scroll-behavior` on navigation; without this,
      // route changes glide to the top rather than jumping. Anchors stay smooth.
      data-scroll-behavior="smooth"
      className={`${hostGrotesk.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body>
        {/* isolate creates the stacking context the atmosphere layers sit behind */}
        <div className="relative isolate min-h-screen">
          <Atmosphere />
          <PointerSpotlightProvider />
          {/* data-ndi-content marks the flow content for useCircuitBands, which
              must measure this rather than the document: the band layers are
              absolutely positioned and count toward document height, so sizing
              them from it would mean they could never shrink again. */}
          {/* overflow-x-clip, not hidden: the footer's glow pools and its grid
              floor are drawn wider than the page on purpose, and without a clip
              they widened the document by 45px. A horizontal scroll range makes
              the fixed header size itself against the wider box, which pushed
              the burger off the right edge of a phone.

              `clip` rather than `hidden` because `hidden` would make this a
              scroll container and break the sticky footer curtain and the
              pinned journey. Fixed children are unaffected either way. */}
          <div data-ndi-content="" className="relative z-[1] overflow-x-clip">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
