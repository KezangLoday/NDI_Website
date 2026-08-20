/** Props for a link that may point off-site. */
export function externalLinkProps(href: string) {
  return /^https?:\/\//.test(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}
