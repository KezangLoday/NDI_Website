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
  title: "Bhutan NDI — Your identity, in your control",
  description:
    "Access services securely, verify your identity digitally, and manage your credentials — all from one trusted wallet built on the principle of self-sovereign identity technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body>
        {/* isolate creates the stacking context the atmosphere layers sit behind */}
        <div className="relative isolate min-h-screen">
          <Atmosphere />
          <PointerSpotlightProvider />
          <div className="relative z-[1]">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
