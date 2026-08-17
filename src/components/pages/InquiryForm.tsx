"use client";

import { useState, type FormEvent } from "react";

import { ServiceSelect } from "@/components/ui/ServiceSelect";
import { FIELD_BLOCK_CLASS, FIELD_CLASS, LABEL_CLASS } from "@/components/ui/formStyles";
import { Icon } from "@/components/ui/icons";
import type { ServiceOption } from "@/content/types";

/**
 * Business inquiry form. Presentational in Phase 1, as in the prototype.
 *
 * Laid out like Home's contact form — same field treatment, same mono labels
 * above each field, same worked-example placeholders — because it is the same
 * form asked on a different page, and the two reading differently made the
 * site look like two sites.
 *
 * The labels were previously `sr-only`, leaving the placeholder as the only
 * visible name for each field. That is the one form pattern that fails as soon
 * as anyone starts typing: the label disappears exactly when it is needed to
 * check the answer.
 *
 * There is no card shell here. The design places this bare on the CTA panel,
 * which supplies the surround.
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
      onSubmit={onSubmit}
      className="relative grid grid-cols-1 gap-[18px] min-[561px]:grid-cols-2"
    >
      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Full name</span>
        <input
          name="name"
          required
          placeholder="Sonam Wangchuk"
          className={`${FIELD_CLASS} h-12`}
        />
      </label>
      {/* Required here, unlike Home's: an integration inquiry that does not say
          who is asking cannot be scoped or routed. */}
      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Organization</span>
        <input
          name="organization"
          required
          placeholder="Where do you work?"
          className={`${FIELD_CLASS} h-12`}
        />
      </label>

      <label className={`${FIELD_BLOCK_CLASS} min-[561px]:col-span-2`}>
        <span className={LABEL_CLASS}>Work email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.bt"
          className={`${FIELD_CLASS} h-12`}
        />
      </label>

      <div className={`${FIELD_BLOCK_CLASS} min-[561px]:col-span-2`}>
        <span className={LABEL_CLASS}>Service or product of interest</span>
        {/* The design's wording, "Service of interest — select one", was the
            field's only name while the label was hidden. With the label back
            the instruction is redundant, so this takes the shared default. */}
        <ServiceSelect options={services} value={service} onChange={setService} />
      </div>

      <label className={`${FIELD_BLOCK_CLASS} min-[561px]:col-span-2`}>
        <span className={LABEL_CLASS}>How can we help?</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your use case and rough timeline."
          className={`${FIELD_CLASS} min-h-[104px] resize-y py-[13px] leading-[1.55]`}
        />
      </label>

      <button
        type="submit"
        className="ndi-sweepbtn relative inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-6 font-display text-[15px] font-semibold min-[561px]:col-span-2"
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
        <Icon name="send" size={16} strokeWidth={1.9} className="ndi-sendnudge relative z-[1]" />
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
        <p className="m-0 text-xs leading-[1.5] text-muted min-[561px]:col-span-2">
          We use your details only to answer this enquiry. Nothing is shared without your consent.
        </p>
      )}
    </form>
  );
}
