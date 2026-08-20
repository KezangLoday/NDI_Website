/** Validation for the external URLs the CMS stores. */
import type { Validate } from "payload";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export interface UrlValidationResult {
  readonly ok: boolean;
  readonly reason?: string;
}

/** Shared by the field validator and the tests. */
export function checkExternalUrl(value: unknown): UrlValidationResult {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: false, reason: "empty" };
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return {
      ok: false,
      reason: "Enter a full address including https://, e.g. https://kuenselonline.com/article.",
    };
  }
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return { ok: false, reason: "Only http:// and https:// addresses can be linked to." };
  }
  // `new URL('https://')` throws, but 'https://?x' does not — it parses with an empty host, which would render as a link to nowhere.
  if (url.hostname.length === 0 || !url.hostname.includes(".")) {
    return { ok: false, reason: "That address has no domain name in it." };
  }
  return { ok: true };
}

export const validateExternalUrl: Validate<string | null | undefined> = (value) => {
  const result = checkExternalUrl(value);
  if (result.ok) return true;
  return result.reason === "empty" ? "A link is required." : (result.reason ?? "Invalid link.");
};

/** The same check, for fields where the link is optional. */
export const validateOptionalExternalUrl: Validate<string | null | undefined> = (value) => {
  if (value === null || value === undefined || value === "") return true;
  const result = checkExternalUrl(value);
  return result.ok ? true : (result.reason ?? "Invalid link.");
};
