"use client";

import Image from "next/image";

import { StoreButtons } from "@/components/ui/StoreButtons";
import { useRotatingPhrase } from "@/hooks/useCarousels";

/** The line after "Your identity," cycles through these every 4200ms. */
const PHRASES = ["in your control.", "verifiable.", "decentralized.", "tamper-proof."];

/** Entrance stagger from the prototype: 70ms, then 95ms apart. */
const heroInDelay = (index: number) => ({ animationDelay: `${70 + index * 95}ms` });

export function Hero() {
  const active = useRotatingPhrase(PHRASES.length);

  return (
    <section
      data-hero-grid="1"
      className="mx-auto box-border max-w-[1200px] px-8 pb-[clamp(48px,7vh,72px)] pt-[clamp(120px,15vh,184px)]"
    >
      <div>
        <div
          className="ndi-hero-in flex items-baseline gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent"
          style={heroInDelay(0)}
        >
          <span aria-hidden="true" className="text-accent">
            —
          </span>
          <span>World&apos;s first SSI national identity</span>
        </div>

        <div className="mt-[22px] w-[min(594px,100%)] overflow-hidden pb-0.5">
          <h1 className="ndi-clip m-0 font-display text-[clamp(42px,5.9vw,78px)] font-bold leading-[1.1] text-strong">
            Your identity,{" "}
            <span className="relative block h-[1.14em] min-w-0 overflow-hidden">
              {PHRASES.map((phrase, index) => {
                // Only the phrase just left exits upward; the rest park below, so wrapping from last back to first keeps the same motion.
                const state =
                  index === active
                    ? "in"
                    : index === (active - 1 + PHRASES.length) % PHRASES.length
                      ? "out"
                      : "pending";
                return (
                  <span
                    key={phrase}
                    className="ndi-wave-text ndi-rotator absolute inset-0 block whitespace-nowrap"
                    data-state={state}
                    aria-hidden={state !== "in"}
                  >
                    {phrase}
                  </span>
                );
              })}
            </span>
          </h1>
        </div>

        <p
          className="ndi-hero-in mt-2.5 max-w-[605px] text-[18px] leading-[1.62] text-muted"
          style={heroInDelay(1)}
        >
          Access services securely, verify your identity digitally, and manage your credentials —
          all from one trusted wallet built on the principle of self-sovereign identity technology.
        </p>

        <div className="ndi-hero-in" style={heroInDelay(2)}>
          <StoreButtons />
        </div>
      </div>

      <div
        data-hero-visual="1"
        className="ndi-hero-in relative flex min-h-[min(640px,70svh)] items-center justify-center"
        style={heroInDelay(3)}
      >
        <div
          aria-hidden="true"
          className="absolute h-[80%] w-[min(560px,112%)]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 46%, rgba(90,201,148,0.2) 0%, rgba(90,201,148,0.1) 26%, rgba(78,176,132,0.04) 48%, transparent 74%)",
            filter: "blur(34px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute h-[54%] w-[min(340px,80%)]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(126,232,182,0.22) 0%, rgba(90,201,148,0.08) 38%, transparent 70%)",
            filter: "blur(46px)",
          }}
        />

        {/* Two separate images so each phone floats on its own cycle. */}
        <div id="ndiHeroPhones" className="relative z-[3] min-w-0">
          <Image
            src="/media/hero-phone-home.png"
            alt="Bhutan NDI wallet — home screen with favourite credentials"
            width={1400}
            height={2157}
            priority
            className="absolute left-0 top-0 z-[1] h-auto w-[59%]"
            style={{
              filter:
                "drop-shadow(0 30px 54px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(90,201,148,0.18))",
              animation: "ndiFloat 7.5s ease-in-out infinite",
            }}
          />
          <Image
            src="/media/hero-phone-credentials.png"
            alt="Bhutan NDI wallet — credentials list"
            width={1400}
            height={1777}
            priority
            className="absolute bottom-0 right-0 z-[2] h-auto w-[66%]"
            style={{
              filter:
                "drop-shadow(0 34px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 46px rgba(90,201,148,0.2))",
              animation: "ndiFloatSlow 7.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
