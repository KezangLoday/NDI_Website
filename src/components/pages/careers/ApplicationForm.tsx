"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { FIELD_BLOCK_CLASS, FIELD_CLASS, LABEL_CLASS } from "@/components/ui/formStyles";
import { Icon } from "@/components/ui/icons";
import type { Job } from "@/content/types";
import { formatCalendarDate } from "@/lib/format";

const MAX_CV_MB = 5;
const ACCEPTED = ".pdf,.doc,.docx";

/**
 * The application form, presentational in Phase 1 like the site's other two.
 *
 * It asks for exactly what the eligibility section asks about and nothing
 * beyond it: if the notice sets a bar on Class X, Class XII and the degree,
 * those three are fields, and if it does not ask for a photograph or a date of
 * birth then neither does this. A recruitment form is the one place on a
 * government site where every extra box is a small act of data collection, so
 * each is here because a stated criterion needs it.
 *
 * The CV is checked in the browser for type and size before it is accepted,
 * because finding out a file was too large after filling in eleven fields is
 * the worst version of this form. Nothing is uploaded in Phase 1; in Phase 2
 * this posts to Payload with the file going to S3.
 */
export function ApplicationForm({ job }: { job: Job }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      setFileError("");
      return;
    }
    if (picked.size > MAX_CV_MB * 1024 * 1024) {
      setFile(null);
      setFileError(`That file is ${(picked.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_CV_MB} MB — try exporting the PDF again at a lower quality.`);
      event.target.value = "";
      return;
    }
    setFileError("");
    setFile(picked);
  };

  const clearFile = () => {
    setFile(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setFileError("A CV is required. Attach a PDF or Word document of up to 5 MB.");
      inputRef.current?.focus();
      return;
    }
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-[18px] min-[601px]:grid-cols-2">
      <FieldGroup label="About you" />

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Full name</span>
        <input name="name" required autoComplete="name" placeholder="Sonam Wangchuk" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Citizenship ID</span>
        <input
          name="cid"
          required
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
        <input name="classX" type="number" required min={0} max={100} step="0.01" placeholder="e.g. 78.4" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Class XII aggregate (%)</span>
        <input name="classXII" type="number" required min={0} max={100} step="0.01" placeholder="e.g. 74.2" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Degree aggregate (%)</span>
        <input name="degree" type="number" required min={0} max={100} step="0.01" placeholder="e.g. 68.0" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Degree and institution</span>
        <input name="qualification" required placeholder="BE Computer Science, CST Phuentsholing" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Year of graduation</span>
        <input name="graduatedIn" type="number" required min={1970} max={2030} placeholder="2021" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={FIELD_BLOCK_CLASS}>
        <span className={LABEL_CLASS}>Relevant experience (years)</span>
        <input name="experience" type="number" required min={0} max={50} step="0.5" placeholder="5" className={`${FIELD_CLASS} h-12`} />
      </label>

      <FieldGroup label="Documents" />

      <div className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Curriculum vitae</span>
        {/* A styled label over a visually hidden input: the native control
            renders a different widget in every browser and none of them can be
            themed, so the button is ours and the input stays the input. */}
        <input
          ref={inputRef}
          id="cv"
          name="cv"
          type="file"
          accept={ACCEPTED}
          onChange={onFile}
          aria-describedby="cv-help"
          className="ndi-cv-input"
        />
        <label htmlFor="cv" className="ndi-cv-drop" data-has-file={file ? "1" : "0"}>
          <Icon name={file ? "fileCheck" : "download"} size={17} strokeWidth={1.8} className="flex-none text-accent" />
          <span className="min-w-0 flex-1 truncate text-[13.5px] text-body">
            {file ? file.name : "Attach your CV — PDF or Word, up to 5 MB"}
          </span>
          <span className="ndi-cv-action font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {file ? "Replace" : "Choose file"}
          </span>
        </label>
        {file ? (
          <button type="button" onClick={clearFile} className="ndi-cv-clear self-start font-mono text-[10px] uppercase tracking-[0.16em]">
            Remove file
          </button>
        ) : null}
        <span id="cv-help" className="text-[12px] leading-[1.5] text-faint">
          Certificates and the Security Clearance Certificate are collected at shortlisting, so there
          is no need to attach them here.
        </span>
        {fileError ? (
          <p role="alert" className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#f0866b]">
            <Icon name="shieldAlert" size={14} strokeWidth={2} className="mt-px flex-none" />
            {fileError}
          </p>
        ) : null}
      </div>

      <label className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Portfolio, GitHub or published work</span>
        <input name="portfolio" type="url" placeholder="https:// — optional, but it is usually the strongest part of an application" className={`${FIELD_CLASS} h-12`} />
      </label>

      <label className={`${FIELD_BLOCK_CLASS} min-[601px]:col-span-2`}>
        <span className={LABEL_CLASS}>Why this role</span>
        <textarea
          name="statement"
          rows={5}
          required
          maxLength={1500}
          placeholder={`In a few paragraphs: what you would bring to ${job.title}, and what you would want to change first.`}
          className={`${FIELD_CLASS} min-h-[132px] resize-y py-[13px] leading-[1.55]`}
        />
      </label>

      <label className="flex items-start gap-3 text-[13px] leading-[1.55] text-muted min-[601px]:col-span-2">
        <input name="consent" type="checkbox" required className="ndi-check mt-0.5 flex-none" />
        <span>
          I confirm the details above are accurate, and I consent to Bhutan NDI holding them for this
          recruitment. They are deleted six months after the post is filled.
        </span>
      </label>

      <button
        type="submit"
        className="ndi-sweepbtn relative mt-2 inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-8 font-display text-[15px] font-semibold min-[601px]:col-span-2 min-[601px]:w-auto min-[601px]:justify-self-start"
        style={{
          background: "linear-gradient(115deg, #8CF0C0 0%, #6FE0A9 24%, #4FC091 56%, #2FA189 80%, #1E8189 100%)",
          color: "#08130f",
          boxShadow: "var(--glow-sm)",
        }}
      >
        <span className="ndi-store-sweep" />
        <span className="ndi-store-glow" />
        <span className="relative z-[1]">Submit application</span>
        <Icon name="send" size={16} strokeWidth={1.9} className="ndi-sendnudge relative z-[1]" />
      </button>

      {submitted ? (
        <p role="status" className="m-0 flex items-center gap-2 text-xs leading-[1.5] text-accent min-[601px]:col-span-2">
          <Icon name="check" size={14} strokeWidth={2.2} className="flex-none" />
          Thanks — this is a demo build, so nothing was sent and no file was uploaded.
        </p>
      ) : (
        <p className="m-0 text-xs leading-[1.5] text-muted min-[601px]:col-span-2">
          Applications close on {formatCalendarDate(job.closesAt)}. Shortlisted candidates are contacted within two weeks
          of that date.
        </p>
      )}
    </form>
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
