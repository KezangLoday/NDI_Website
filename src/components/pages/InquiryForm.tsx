"use client";

import { useState, type FormEvent } from "react";

import { ServiceSelect } from "@/components/ui/ServiceSelect";
import { Icon } from "@/components/ui/icons";
import type { ServiceOption } from "@/content/types";

const FIELD =
  "ndi-field box-border w-full rounded-xl border border-grid bg-white/[0.03] px-4 font-body text-[14.5px] text-strong outline-none";

/**
 * Business inquiry form. Presentational in Phase 1, as in the prototype.
 *
 * The design places this bare on the CTA panel — a two-column grid of
 * placeholder-only fields with no surround of its own — so there is no card
 * shell here; the panel behind it provides that.
 */
export function InquiryForm({ services }: { services: ServiceOption[] }) {
  const [service, setService] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      // No data-cta-form here: that hook paints the glass fill and conic lens
      // rim, which belong to Home's boxed contact card. This form is bare on
      // the CTA panel, as in the design, so the rim drew a stray outline across
      // the submit button and the note beneath it.
      data-cta-fields="1"
      onSubmit={onSubmit}
      className="relative grid grid-cols-1 gap-3.5 min-[561px]:grid-cols-2"
    >
      <label className="min-w-0">
        <span className="sr-only">Your name</span>
        <input name="name" required placeholder="Your name" className={`${FIELD} h-12`} />
      </label>
      <label className="min-w-0">
        <span className="sr-only">Organization</span>
        <input
          name="organization"
          required
          placeholder="Organization"
          className={`${FIELD} h-12`}
        />
      </label>

      <label className="min-w-0 min-[561px]:col-span-2">
        <span className="sr-only">Work email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="Work email"
          className={`${FIELD} h-12`}
        />
      </label>

      <div className="min-w-0 min-[561px]:col-span-2">
        <span className="sr-only">Service of interest</span>
        {/* Home's contact form says "Select a service or product"; this one has
            its own wording in the design. */}
        <ServiceSelect
          options={services}
          value={service}
          onChange={setService}
          placeholder="Service of interest — select one"
        />
      </div>

      <label className="min-w-0 min-[561px]:col-span-2">
        <span className="sr-only">Tell us about your use case</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your use case"
          className={`${FIELD} resize-y py-3.5 leading-[1.6]`}
        />
      </label>

      <button
        type="submit"
        className="ndi-sweepbtn relative inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-6 font-display text-[14.5px] font-semibold min-[561px]:col-span-2"
        style={{
          background:
            "linear-gradient(115deg, #8CF0C0 0%, #6FE0A9 24%, #4FC091 56%, #2FA189 80%, #1E8189 100%)",
          color: "#08130f",
          boxShadow: "var(--glow-sm)",
        }}
      >
        <span className="ndi-store-sweep" />
        <span className="ndi-store-glow" />
        <span className="relative z-[1]">Send inquiry</span>
        <Icon name="send" size={16} strokeWidth={1.9} className="relative z-[1]" />
      </button>

      {submitted ? (
        <p
          role="status"
          className="m-0 flex items-center gap-2 text-xs leading-[1.5] text-accent min-[561px]:col-span-2"
        >
          <Icon name="check" size={14} strokeWidth={2.2} className="flex-none" />
          Thanks — this is a demo build, so nothing was sent yet.
        </p>
      ) : (
        <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint min-[561px]:col-span-2">
          — We use your details only to respond to this inquiry
        </p>
      )}
    </form>
  );
}
