/** File-type verification by content, not by claim. */

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
    /* A .docx is a ZIP. */
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

/** Verifies a buffer's contents against its declared MIME type. */
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

/** Control characters and DEL, which have no business in a displayed name. */
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001f\\u007f]", "g");

/** Reduces a submitted filename to something safe to store and to show. */
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
