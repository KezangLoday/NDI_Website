"use client";

import { useState, type FormEvent } from "react";

import { ServiceSelect } from "@/components/ui/ServiceSelect";
import { Icon } from "@/components/ui/icons";
import type { ServiceOption } from "@/content/types";

const FIELD =
  "ndi-field box-border w-full rounded-[10px] border border-grid bg-raised px-[14px] font-body text-sm text-strong outline-none";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-muted";

/** Business inquiry form. Presentational in Phase 1, as in the prototype. */
export function InquiryForm({ services }: { services: ServiceOption[] }) {
  const [service, setService] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      data-cta-form="1"
      onSubmit={onSubmit}
      className="relative flex flex-col gap-[18px] rounded-[16px] border border-grid p-5 min-[561px]:p-7 min-[901px]:rounded-[20px] min-[901px]:p-8"
      style={{
        background: "rgba(12,17,27,0.55)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 22px 50px -30px rgba(0,0,0,0.9)",
      }}
    >
      <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={LABEL}>Your name</span>
          <input name="name" required placeholder="Sonam Wangchuk" className={`${FIELD} h-12`} />
        </label>
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={LABEL}>Organization</span>
          <input name="organization" required placeholder="Bank of Bhutan" className={`${FIELD} h-12`} />
        </label>
      </div>

      <label className="flex min-w-0 flex-col gap-[7px]">
        <span className={LABEL}>Work email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@organization.bt"
          className={`${FIELD} h-12`}
        />
      </label>

      <div className="flex min-w-0 flex-col gap-[7px]">
        <span className={LABEL}>Service of interest</span>
        <ServiceSelect options={services} value={service} onChange={setService} />
      </div>

      <label className="flex min-w-0 flex-col gap-[7px]">
        <span className={LABEL}>Tell us about your use case</span>
        <textarea
          name="message"
          rows={4}
          placeholder="What are you trying to build, and for whom?"
          className={`${FIELD} min-h-[104px] resize-y py-[13px] leading-[1.55]`}
        />
      </label>

      <button
        type="submit"
        className="ndi-sweepbtn relative inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-6 font-display text-[15px] font-semibold"
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
        <p role="status" className="m-0 flex items-center gap-2 text-xs leading-[1.5] text-accent">
          <Icon name="check" size={14} strokeWidth={2.2} className="flex-none" />
          Thanks — this is a demo build, so nothing was sent yet.
        </p>
      ) : (
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          — We use your details only to respond to this inquiry
        </p>
      )}
    </form>
  );
}
