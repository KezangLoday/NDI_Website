/**
 * The rich-text renderer.
 *
 * Payload stores article bodies as Lexical's node tree; this maps that tree onto
 * the typography the site already has. Every class here is lifted from the
 * hand-written markup it replaces — the 21px display heading, the 16.5px body at
 * 1.75 leading, the `.ndi-inline-link` underline — so a story that used to be a
 * hard-coded array of paragraphs renders identically now that an editor is
 * typing it.
 *
 * It builds on Payload's own `RichText`, overriding converters rather than
 * walking the tree by hand. The traversal, the text-format bitmask and the
 * escaping are all things Payload has already got right, and a second
 * implementation of them is a second set of bugs.
 */
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { RichTextContent } from "@/content/types";

/**
 * Heading levels, mapped to the article scale.
 *
 * `h1` is absent because the editor does not offer it: the page's `h1` is the
 * headline field. An `h1` arriving from an older document renders as an `h2`
 * rather than being dropped — losing an editor's text would be worse than
 * demoting it.
 */
const HEADING_CLASS: Record<"h2" | "h3", string> = {
  h2: "mt-11 font-display text-[21px] font-semibold leading-[1.25] tracking-[-0.02em] text-strong first:mt-0 [text-wrap:balance]",
  h3: "mt-8 font-display text-[17.5px] font-semibold leading-[1.35] tracking-[-0.01em] text-strong first:mt-0",
};

const PARAGRAPH_CLASS =
  "mt-5 text-[16.5px] leading-[1.75] text-body first:mt-0 [text-wrap:pretty]";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    return node.tag === "h3" ? (
      <h3 className={HEADING_CLASS.h3}>{children}</h3>
    ) : (
      <h2 className={HEADING_CLASS.h2}>{children}</h2>
    );
  },

  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    /*
     * Lexical emits an empty paragraph for a blank line. Rendering it would add
     * a 5px margin and an empty box to the flow — invisible except for the gap
     * it leaves, which is the kind of thing that makes an article look subtly
     * badly set.
     */
    if (children.length === 0) return null;
    return <p className={PARAGRAPH_CLASS}>{children}</p>;
  },

  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const className = "mt-5 flex flex-col gap-2.5 first:mt-0";
    return node.tag === "ol" ? (
      <ol className={`${className} ndi-rt-ol`}>{children}</ol>
    ) : (
      <ul className={className}>{children}</ul>
    );
  },

  listitem: ({ node, nodesToJSX }) => (
    /* `.ndi-tor-item` is the site's existing bulleted-item rule — the mint
       marker and the hanging indent — so a list in an article and a clause in a
       terms of reference are set the same way. */
    <li className="ndi-tor-item text-[16.5px] leading-[1.7] text-body [text-wrap:pretty]">
      {nodesToJSX({ nodes: node.children })}
    </li>
  ),

  quote: ({ node, nodesToJSX }) => (
    <blockquote className="mt-7 border-l-2 border-[var(--accent)] pl-5 text-[17px] italic leading-[1.65] text-body first:mt-0">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),

  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const href = resolveLinkHref(node.fields);
    if (!href) return <>{children}</>;

    return /^https?:\/\//.test(href) ? (
      <a
        href={href}
        className="ndi-inline-link"
        /* External destinations open in a new tab so a reader does not lose
           their place, and carry noopener so the opened page cannot reach back
           through window.opener. */
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="ndi-inline-link">
        {children}
      </Link>
    );
  },
});

/**
 * Turns a Lexical link node's fields into an href.
 *
 * Two kinds. A custom link carries a URL the editor typed. An internal link
 * carries a relationship, which is the one worth having — it survives a slug
 * change, where a typed URL would quietly start 404ing.
 */
function resolveLinkHref(fields: unknown): string | null {
  if (typeof fields !== "object" || fields === null) return null;
  const link = fields as {
    linkType?: unknown;
    url?: unknown;
    doc?: { relationTo?: unknown; value?: unknown } | null;
  };

  if (link.linkType === "internal" && link.doc) return internalHref(link.doc);

  if (typeof link.url === "string") {
    /* Anything that is not http(s), site-relative or an anchor is dropped
       rather than rendered: `javascript:` in an href executes on the reader's
       page with this site's origin. */
    if (/^https?:\/\//.test(link.url) || link.url.startsWith("/") || link.url.startsWith("#")) {
      return link.url;
    }
  }
  return null;
}

/** The public route for a linked CMS document. */
function internalHref(doc: { relationTo?: unknown; value?: unknown }): string | null {
  const value = doc.value;
  const slug =
    typeof value === "object" && value !== null && "slug" in value
      ? (value as { slug?: unknown }).slug
      : null;
  if (typeof slug !== "string") return null;

  switch (doc.relationTo) {
    case "news":
      return `/resources/news/${slug}`;
    case "insights":
      return `/resources/insights/${slug}`;
    case "webinars":
      return "/resources/webinars";
    case "jobs":
      return `/careers/${slug}`;
    default:
      return null;
  }
}

/**
 * An article body.
 *
 * `disableContainer` because the callers already set the measure — the
 * `max-w-[66ch]` wrapper is part of the page layout, not of the text.
 */
export function ArticleBody({ content }: { content: RichTextContent }): ReactNode {
  return (
    <RichText
      data={content}
      converters={converters}
      disableContainer
      disableTextAlign
      disableIndent
    />
  );
}

/**
 * Short prose: a FAQ answer, a glossary definition.
 *
 * Same converters, wrapped so the first paragraph can lose its top margin —
 * these render inside a panel that provides its own padding, and the article's
 * leading gap would double it.
 */
export function ProseBody({ content }: { content: RichTextContent }): ReactNode {
  return (
    <div className="ndi-rt-prose">
      <RichText
        data={content}
        converters={converters}
        disableContainer
        disableTextAlign
        disableIndent
      />
    </div>
  );
}

/**
 * Whether a rich-text value has anything in it.
 *
 * Lexical's empty state is not null — it is a root node containing one empty
 * paragraph — so a plain truthiness check is always true, and every empty
 * article would render an empty div instead of its fallback copy.
 */
export function hasRichText(content: RichTextContent | null | undefined): boolean {
  if (!content) return false;
  const children = content.root?.children;
  if (!Array.isArray(children) || children.length === 0) return false;
  return children.some(nodeHasContent);
}

function nodeHasContent(node: unknown): boolean {
  if (typeof node !== "object" || node === null) return false;
  const candidate = node as { type?: unknown; text?: unknown; children?: unknown };
  if (typeof candidate.text === "string" && candidate.text.trim().length > 0) return true;
  // An upload or a horizontal rule carries no text but is still content.
  if (candidate.type === "upload" || candidate.type === "horizontalrule") return true;
  if (Array.isArray(candidate.children)) return candidate.children.some(nodeHasContent);
  return false;
}
