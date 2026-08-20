"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { FIELD_BLOCK_CLASS, FIELD_CLASS, LABEL_CLASS } from "@/components/ui/formStyles";
import { Icon } from "@/components/ui/icons";
import type { DocumentRequirement, Job } from "@/content/types";
import { formatCalendarDate, formatFileSize } from "@/lib/format";

/**
 * The application form.
 *
 * It asks for exactly what the vacancy asks about and nothing beyond it. The
 * document slots are not hard-coded: they come from the job's own
 * `requiredDocuments` and `optionalDocuments`, so a post that needs a Class X
 * certificate shows a Class X field and a consultancy that needs only a CV
 * shows only that. A recruitment form is the one place on a government site
 * where every extra box is a small act of data collection, so each one here is
 * present because a stated criterion needs it.
 *
 * Files are checked in the browser for type before they are accepted, because
 * finding out after filling in eleven fields is the worst version of this form.
 * That check is a courtesy: the server verifies each file's actual bytes against
 * its claimed type, and the browser cannot be trusted about either.
 *
 * There is deliberately no size limit. The CMS imposes none, the optimisation
 * pipeline handles size better than an applicant guessing at an export setting,
 * and a limit here would mostly punish someone whose only scanner produces
 * 12-megapixel JPEGs.
 *
 * Submission posts multipart form data to Payload's own endpoint rather than
 * going through a Server Action, because a Server Action body is capped at 1MB
 * by default — which a perfectly ordinary set of scanned certificates exceeds.
 */

/** Payload mounts collection endpoints under the collection's REST path. */
const SUBMIT_URL = "/api/job-applications/submit";

const ACCEPTED = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic";

const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

interface Receipt {
  reference: string;
  jobTitle: string;
  submittedAt: string;
  duplicate: boolean;
}

export function ApplicationForm({ job }: { job: Job }) {
  const slots = useMemo(
    () => [...job.applications.requiredDocuments, ...job.applications.optionalDocuments],
    [job.applications.requiredDocuments, job.applications.optionalDocuments],
  );

  const [files, setFiles] = useState<Record<string, File>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onFile = (kind: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;

    if (!picked) {
      setFiles((current) => {
        const next = { ...current };
        delete next[kind];
        return next;
      });
      setFieldErrors((current) => ({ ...current, [kind]: "" }));
      return;
    }

    if (!ACCEPTED_MIME.has(picked.type)) {
      event.target.value = "";
      setFieldErrors((current) => ({
        ...current,
        [kind]: "That file type is not accepted. Attach a PDF, a Word document, or a photograph.",
      }));
      return;
    }

    setFieldErrors((current) => ({ ...current, [kind]: "" }));
    setFiles((current) => ({ ...current, [kind]: picked }));
  };

  const clearFile = (kind: string) => {
    setFiles((current) => {
      const next = { ...current };
      delete next[kind];
      return next;
    });
    setFieldErrors((current) => ({ ...current, [kind]: "" }));
    const input = formRef.current?.elements.namedItem(inputName(kind));
    if (input instanceof HTMLInputElement) input.value = "";
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const missing = job.applications.requiredDocuments.filter((slot) => !files[slot.kind]);
    if (missing.length > 0) {
      setFieldErrors((current) => {
        const next = { ...current };
        for (const slot of missing) next[slot.kind] = "This document is required.";
        return next;
      });
      /* Send them to the first missing one rather than making them hunt. */
      const first = formRef.current?.elements.namedItem(inputName(missing[0].kind));
      if (first instanceof HTMLInputElement) first.focus();
      return;
    }

    const form = new FormData(event.currentTarget);
    /* The file inputs are visually hidden and carry their own names; the state
       above is the source of truth, so the raw inputs are replaced with it. */
    for (const slot of slots) form.delete(inputName(slot.kind));
    for (const [kind, file] of Object.entries(files)) form.append(`document:${kind}`, file);
    form.set("job", job.id);

    setSubmitting(true);
    try {
      const response = await fetch(SUBMIT_URL, { method: "POST", body: form });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setFormError(errorMessageOf(payload));
        return;
      }
      setReceipt(receiptOf(payload));
    } catch {
      setFormError(
        "Your application could not be sent — the connection failed. Nothing was submitted, so it is safe to try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) return <Confirmation receipt={receipt} />;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate={false}
      className="grid grid-cols-1 gap-[18px] min-[601px]:grid-cols-2"
    >
      <FieldGroup label="About you" />

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Full name</span>
        <input name="fullName" required autoComplete="name" placeholder="Sonam Wangchuk" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Citizenship ID</span>
        <input
          name="citizenshipId"
          inputMode="numeric"
          pattern="[0-9]{11}"
          placeholder="11 digits"
          title="Your CID is the 11-digit number on your citizenship card."
          className={`${FIELD_CLASS} h-12`}
        />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.bt" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Mobile number</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+975 17 000 000"
          className={`${FIELD_CLASS} h-12`}
        />
      </label>

      <label className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Current location</span>
        <input name="location" required placeholder="Dzongkhag, or the city you are applying from" className={`${FIELD_CLASS} h-12`} />
      </label>

      <FieldGroup
        label="Academic record"
        note="Enter the aggregate percentage from each certificate. Transcripts are verified at interview, not now."
      />

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Class X aggregate (%)</span>
        <input name="classXPercent" type="number" min={0} max={100} step="0.01" placeholder="e.g. 78.4" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Class XII aggregate (%)</span>
        <input name="classXIIPercent" type="number" min={0} max={100} step="0.01" placeholder="e.g. 74.2" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Degree aggregate (%)</span>
        <input name="degreePercent" type="number" min={0} max={100} step="0.01" placeholder="e.g. 68.0" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Degree and institution</span>
        <input name="qualification" placeholder="BE Computer Science, CST Phuentsholing" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Year of graduation</span>
        <input name="graduationYear" type="number" min={1970} max={2100} placeholder="2021" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Relevant experience (years)</span>
        <input name="experienceYears" type="number" min={0} max={60} step="0.5" placeholder="5" className={`${FIELD_CLASS} h-12`} />
      </label>

      <FieldGroup
        label="Documents"
        note={
          job.applications.optionalDocuments.length
            ? "The documents marked required are the ones this vacancy asks for. The rest are optional."
            : "This vacancy asks for the documents below."
        }
      />

      {slots.map((slot) => (
        <FileSlot
          key={slot.kind}
          slot={slot}
          file={files[slot.kind]}
          error={fieldErrors[slot.kind]}
          onChange={onFile(slot.kind)}
          onClear={() => clearFile(slot.kind)}
        />
      ))}

      <label className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Portfolio, GitHub or published work</span>
        <input name="portfolioUrl" type="url" placeholder="https:// — optional, but it is usually the strongest part of an application" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Why this role</span>
        <textarea
          name="statement"
          rows={5}
          maxLength={4000}
          placeholder={`In a few paragraphs: what you would bring to ${job.title}, and what you would want to change first.`}
          className={`${FIELD_CLASS} min-h-[132px] resize-y py-[13px] leading-[1.55]`}
        />
      </label>

      <label className="flex items-start gap-3 text-[13px] leading-[1.55] text-muted min-[601px]:col-span-2">
        <input name="consent" type="checkbox" value="true" required className="ndi-check mt-0.5 flex-none" />
        <span>
          I confirm the details above are accurate, and I consent to Bhutan NDI holding them for this
          recruitment. They are deleted six months after the post is filled.
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="ndi-sweepbtn relative mt-2 inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-8 font-display text-[15px] font-semibold disabled:cursor-wait disabled:opacity-70 min-[601px]:col-span-2 min-[601px]:w-auto min-[601px]:justify-self-start"
        style={{
          background: "linear-gradient(115deg, #8CF0C0 0%, #6FE0A9 24%, #4FC091 56%, #2FA189 80%, #1E8189 100%)",
          color: "#08130f",
          boxShadow: "var(--glow-sm)",
        }}
      >
        <span className="ndi-store-sweep" />
        <span className="ndi-store-glow" />
        <span className="relative z-[1]">
          {submitting ? "Sending your application…" : "Submit application"}
        </span>
        <Icon name="send" size={16} strokeWidth={1.9} className="ndi-sendnudge relative z-[1]" />
      </button>

      {formError ? (
        <p
          role="alert"
          className="m-0 flex items-start gap-2 text-[13px] leading-[1.55] text-[#f0866b] min-[601px]:col-span-2"
        >
          <Icon name="shieldAlert" size={15} strokeWidth={2} className="mt-px flex-none" />
          {formError}
        </p>
      ) : (
        <p className="m-0 text-xs leading-[1.5] text-muted min-[601px]:col-span-2">
          Applications close on {formatCalendarDate(job.closesAt)}. Shortlisted candidates are
          contacted within two weeks of that date.
        </p>
      )}
    </form>
  );
}

/**
 * One document slot.
 *
 * A styled label over a visually hidden input: the native control renders a
 * different widget in every browser and none of them can be themed, so the
 * button is ours and the input stays the input.
 */
function FileSlot({
  slot,
  file,
  error,
  onChange,
  onClear,
}: {
  slot: DocumentRequirement;
  file: File | undefined;
  error: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const id = `doc-${slot.kind}`;
  return (
    <div className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
      <span className={LABEL_CLASS}>
        {slot.label}
        {slot.required ? null : (
          <span className="ml-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
            optional
          </span>
        )}
      </span>
      <input
        id={id}
        name={inputName(slot.kind)}
        type="file"
        accept={ACCEPTED}
        onChange={onChange}
        aria-describedby={`${id}-help`}
        className="ndi-cv-input"
      />
      <label htmlFor={id} className="ndi-cv-drop" data-has-file={file ? "1" : "0"}>
        <Icon
          name={file ? "fileCheck" : "download"}
          size={17}
          strokeWidth={1.8}
          className="flex-none text-accent"
        />
        <span className="min-w-0 flex-1 truncate text-[13.5px] text-body">
          {file ? file.name : `Attach your ${slot.label.toLowerCase()} — PDF, Word or a photograph`}
        </span>
        <span className="ndi-cv-action font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {file ? "Replace" : "Choose file"}
        </span>
      </label>
      {file ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="ndi-cv-clear self-start font-mono text-[10px] uppercase tracking-[0.16em]"
          >
            Remove file
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {formatFileSize(file.size)}
          </span>
        </div>
      ) : null}
      <span id={`${id}-help`} className="sr-only">
        Accepted formats: PDF, Word, JPEG, PNG.
      </span>
      {error ? (
        <p role="alert" className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#f0866b]">
          <Icon name="shieldAlert" size={14} strokeWidth={2} className="mt-px flex-none" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The receipt.
 *
 * Four things, because they are the four things an applicant needs: it arrived,
 * what it is called, what they applied for, and what happens next. Nothing about
 * how they will be assessed — the endpoint does not return it and this would not
 * show it if it did.
 */
function Confirmation({ receipt }: { receipt: Receipt }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border p-7"
      style={{
        borderColor: "rgba(90,201,148,0.32)",
        background:
          "radial-gradient(115% 78% at 26% -6%, rgba(111,224,169,0.16) 0%, rgba(90,201,148,0.05) 42%, rgba(90,201,148,0) 68%), rgba(255,255,255,0.02)",
      }}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
        <Icon name="check" size={14} strokeWidth={2.4} />
        Application received
      </span>

      <h3 className="mt-3 font-display text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-strong">
        Your reference is {receipt.reference}
      </h3>

      <dl className="mt-5 flex flex-col">
        {[
          ["Applied for", receipt.jobTitle],
          ["Submitted", formatCalendarDate(receipt.submittedAt.slice(0, 10))],
          ["Reference", receipt.reference],
        ].map(([term, value], index, all) => (
          <div
            key={term}
            className={`flex items-baseline justify-between gap-4 py-2.5 ${
              index < all.length - 1 ? "border-b border-subtle" : ""
            }`}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{term}</dt>
            <dd className="text-right text-[13.5px] text-body">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 max-w-[58ch] text-[14px] leading-[1.65] text-muted [text-wrap:pretty]">
        Keep that reference — it is how we will identify your application if you get in touch. Every
        application is read after the closing date, not before, so there is nothing to chase in the
        meantime. Shortlisted candidates are contacted within two weeks of the deadline; if you do
        not hear from us by then, you have not been shortlisted on this occasion.
      </p>

      {receipt.duplicate ? (
        <p className="mt-4 max-w-[58ch] text-[13px] leading-[1.6] text-faint [text-wrap:pretty]">
          We already had an application from this email address for this vacancy. Both are kept and
          this one is flagged for our team, who will treat the later submission as the one you meant.
        </p>
      ) : null}
    </div>
  );
}

/** A rule and a name for each run of fields, so the form reads as three asks. */
function FieldGroup({ label, note }: { label: string; note?: string }) {
  return (
    /* More room above the rule than below it, so each heading reads as
       belonging to the fields that follow rather than floating between two
       groups. The first one takes the form's own top edge. */
    <div className="mt-4 min-[601px]:col-span-2 first:mt-0">
      <div className="flex items-center gap-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>
      {note ? <p className="mt-2 text-[12.5px] leading-[1.55] text-muted">{note}</p> : null}
    </div>
  );
}

/** The DOM name for a document slot's file input. */
function inputName(kind: string): string {
  return `file-${kind}`;
}

/**
 * The error message from a failed submission.
 *
 * The endpoint returns a considered sentence for every refusal it makes — the
 * deadline has passed, a document is missing, this file is not what it claims —
 * so showing it is better than a generic apology. Anything unrecognised falls
 * back, because an unparsed response is not a message to put in front of
 * someone.
 */
function errorMessageOf(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const message = (payload as { error?: unknown }).error;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return "Your application could not be submitted. Please check the form and try again.";
}

function receiptOf(payload: unknown): Receipt {
  const source = typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {};
  return {
    reference: typeof source.reference === "string" ? source.reference : "—",
    jobTitle: typeof source.jobTitle === "string" ? source.jobTitle : "this vacancy",
    submittedAt:
      typeof source.submittedAt === "string" ? source.submittedAt : new Date().toISOString(),
    duplicate: source.duplicate === true,
  };
}
