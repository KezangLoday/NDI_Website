/**
 * File-type verification by content, not by claim.
 *
 * The MIME type on an upload comes from the browser, which took it from the
 * file extension. It is a hint, and an attacker controls it completely — so the
 * `mimeTypes` allow-list on the collection stops an honest mistake and nothing
 * more. This reads the first bytes of the file and checks they are what the type
 * says they are.
 *
 * What that buys, concretely: `payload.pdf.exe` renamed to `payload.pdf` no
 * longer reaches storage, and neither does an HTML file dressed as a JPEG —
 * which matters because a stored HTML file served from the site's own origin is
 * a script running as the site.
 *
 * What it does not claim to be is malware scanning. It verifies that a file is
 * the format it says it is; whether a genuine PDF contains something hostile is
 * a question for a scanner, and that is flagged as a deployment decision rather
 * than pretended away here.
 */

/** Longest signature below, plus the largest offset. */
const HEADER_BYTES = 32;

interface Signature {
  readonly mimeTypes: readonly string[];
  /** Byte sequence, with `null` for a byte that may be anything. */
  readonly magic: readonly (number | null)[];
  readonly offset?: number;
  readonly label: string;
}

const SIGNATURES: readonly Signature[] = [
  { label: "PDF", mimeTypes: ["application/pdf"], magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { label: "JPEG", mimeTypes: ["image/jpeg", "image/jpg"], magic: [0xff, 0xd8, 0xff] },
  {
    label: "PNG",
    mimeTypes: ["image/png"],
    magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  {
    /* RIFF....WEBP — the four size bytes in the middle vary, hence the nulls. */
    label: "WebP",
    mimeTypes: ["image/webp"],
    magic: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50],
  },
  {
    /* ISO base media container; the `ftyp` brand at offset 4 marks HEIC/HEIF. */
    label: "HEIC/HEIF",
    mimeTypes: ["image/heic", "image/heif"],
    magic: [0x66, 0x74, 0x79, 0x70],
    offset: 4,
  },
  {
    /*
     * A .docx is a ZIP. So is a .jar, an .xlsx and an .apk — the signature only
     * establishes "this is a ZIP container", which is as far as a header check
     * can go. Payload's extension and MIME allow-list is what narrows it to a
     * Word document, and the pair together are what stop an executable being
     * renamed.
     */
    label: "ZIP container (DOCX)",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  {
    /* Legacy .doc — an OLE2 compound document. */
    label: "Word 97-2003",
    mimeTypes: ["application/msword"],
    magic: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  },
];

export interface FileTypeCheck {
  readonly ok: boolean;
  readonly reason?: string;
}

/**
 * Verifies a buffer's contents against its declared MIME type.
 *
 * Returns `ok` for a type with no signature on file — an unknown-but-allowed
 * type is the collection's decision to make, and failing closed here would mean
 * that adding a MIME type to a collection silently stopped working.
 */
export function verifyFileType(data: Buffer, declaredMimeType: string): FileTypeCheck {
  const expected = SIGNATURES.filter((signature) => signature.mimeTypes.includes(declaredMimeType));
  if (expected.length === 0) return { ok: true };

  if (data.byteLength < HEADER_BYTES) {
    return { ok: false, reason: "That file is too small to be a valid document." };
  }

  if (expected.some((signature) => matches(data, signature))) return { ok: true };

  const label = expected[0]?.label ?? declaredMimeType;
  return {
    ok: false,
    reason: `That file is named as a ${label} but its contents are not one. Re-export it and try again.`,
  };
}

function matches(data: Buffer, signature: Signature): boolean {
  const offset = signature.offset ?? 0;
  return signature.magic.every((byte, index) => byte === null || data[offset + index] === byte);
}

/**
 * Control characters and DEL, which have no business in a displayed name.
 *
 * Built from escapes via the constructor rather than written as a literal, so
 * the source of this file stays printable.
 */
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001f\\u007f]", "g");

/**
 * Reduces a submitted filename to something safe to store and to show.
 *
 * Payload generates the filename it actually writes to disk, so this is not
 * what prevents path traversal — it is what stops a hostile filename being
 * *displayed* to HR in the admin panel, and what keeps the original name
 * readable in a list. Control characters and path separators go; the rest of
 * the name, including non-Latin scripts, is left alone, because
 * "Kinley_Dorji_CV" is the part that makes a document identifiable.
 */
export function safeDisplayFilename(name: string): string {
  const withoutPath = name.split(/[\\/]/).pop() ?? name;
  const cleaned = withoutPath
    .replace(CONTROL_CHARS, "")
    // A leading dot hides the file in unix listings and reads as a config file.
    .replace(/^\.+/, "")
    .trim()
    .slice(0, 180);
  return cleaned.length > 0 ? cleaned : "document";
}
