"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import type { Collaborator, CollaboratorGroup } from "@/content/types";
import { useLogoCarousel } from "@/hooks/useCarousels";
import { mediaUrl } from "@/lib/media";

interface CollaboratorCarouselProps {
  groups: CollaboratorGroup[];
  collaborators: Collaborator[];
}

export function CollaboratorCarousel({ groups, collaborators }: CollaboratorCarouselProps) {
  // Logos are bucketed by slot; each slot is one box that cross-fades between
  // the logos assigned to it. A logo may sit in several slots.
  const slotIds = Array.from(new Set(collaborators.flatMap((item) => item.slots))).sort(
    (a, b) => a - b,
  );
  const slots = slotIds.map((id) => collaborators.filter((item) => item.slots.includes(id)));

  // Slots drawing on an identical list of logos must not show the same one at
  // once; deriving the key from the list itself means that applies wherever it
  // is true, without anyone having to declare it.
  const exclusiveKeys = slots.map((items) => items.map((item) => item.id).join("|"));
  const shared = new Set(
    exclusiveKeys.filter((key, index) => exclusiveKeys.indexOf(key) !== index),
  );

  const { slots: slotState, hold } = useLogoCarousel(
    slots.map((items) => items.length),
    exclusiveKeys.map((key) => (shared.has(key) ? key : undefined)),
  );

  return (
    <section className="pb-[104px] pt-24">
      <Reveal className="mx-auto max-w-[1200px] px-8 text-left">
        <Eyebrow>— Partners &amp; collaborators</Eyebrow>
        <h2 className="mt-4 font-display text-[min(40px,5vw)] font-bold leading-[1.1] tracking-[-0.01em] text-strong">
          Built on open global standards
        </h2>
        <p className="mt-[14px] max-w-[600px] text-base leading-[1.62] text-muted">
          We work with the standards bodies and open-source communities shaping self-sovereign
          identity worldwide.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-14 max-w-[1200px] px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[min(1080px,96%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(90,201,148,0.10), transparent 70%)",
          }}
        />

        <div className="relative flex w-full flex-wrap items-start justify-between gap-[clamp(40px,6vw,104px)]">
          {groups.map((group) => {
            const groupSlots = slotIds
              .map((id, index) => ({ id, index, items: slots[index] }))
              .filter((slot) => slot.items[0]?.group === group.id);

            return (
              <div key={group.id} className="ndi-lc-group flex flex-[0_1_auto] flex-col gap-[22px]">
                <div className="flex items-center gap-3.5">
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {group.label}
                  </span>
                  {/* `flex-1` alone has a 0% basis, so it contributes nothing to
                      the group's max-content width. That is invisible while a
                      group is wider than its own label — the partners' four
                      boxes leave plenty for the rule to grow into — but the
                      single service-provider box is narrower than the words
                      above it, so there was no free space and the rule
                      collapsed to nothing. A floor gives every group a rule. */}
                  <span
                    aria-hidden="true"
                    className="h-px min-w-[72px] flex-1"
                    style={{
                      background: "linear-gradient(90deg, var(--border-grid), transparent)",
                    }}
                  />
                </div>

                <div className="ndi-lc-grid flex flex-wrap items-center gap-[clamp(20px,3vw,48px)]">
                  {groupSlots.map((slot) => {
                    const state = slotState[slot.index];
                    return (
                      <div
                        key={slot.id}
                        className="ndi-lc-col relative flex-none overflow-hidden"
                        /* Dimensions as properties, not inline width/height: the
                           set becomes a three-column grid on a phone and an
                           inline style cannot be overridden by a media query. */
                        style={
                          {
                            "--slot-w": "clamp(92px, 9.5vw, 150px)",
                            "--slot-h": "clamp(80px, 8vw, 118px)",
                          } as CSSProperties
                        }
                        onPointerEnter={() => hold(slot.index, true)}
                        onPointerLeave={() => hold(slot.index, false)}
                      >
                        {slot.items.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="ndi-lc-item"
                            data-active={state?.active === itemIndex ? "" : undefined}
                            data-exit={state?.exiting === itemIndex ? "" : undefined}
                            data-full-color={item.preserveColor ? "" : undefined}
                          >
                            <Image
                              src={mediaUrl(item.logo)}
                              alt={item.logo.alt}
                              width={item.logo.width}
                              height={item.logo.height}
                              sizes="150px"
                              className="block h-auto w-auto object-contain"
                              style={{ maxWidth: item.maxWidth, maxHeight: item.maxHeight }}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
