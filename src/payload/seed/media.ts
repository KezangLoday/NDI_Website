/** A terse helper so the seed fixtures read cleanly. */
import type { SeedMedia } from "./data/types";

export function media(url: string, alt: string, width: number, height: number): SeedMedia {
  return { url, alt, width, height };
}
