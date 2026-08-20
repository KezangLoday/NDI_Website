/**
 * A terse helper so the seed fixtures read cleanly.
 *
 * The seed data was written against the site's own `media()` helper; it lives
 * here now so the fixtures do not depend on frontend code they no longer have
 * anything to do with.
 */
import type { SeedMedia } from "./data/types";

export function media(url: string, alt: string, width: number, height: number): SeedMedia {
  return { url, alt, width, height };
}
