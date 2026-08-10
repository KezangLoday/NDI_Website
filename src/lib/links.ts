/**
 * Props for a link that may point off-site.
 *
 * External destinations open in a new tab so a visitor never loses their place
 * on the site, and carry `noopener` so the opened page cannot reach back
 * through `window.opener`.
 */
export function externalLinkProps(href: string) {
  return /^https?:\/\//.test(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}
