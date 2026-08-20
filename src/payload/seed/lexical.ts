/**
 * Builds Lexical documents for the seed.
 *
 * The seed fixtures were written as plain strings and simple block arrays, which
 * is the right shape for content someone typed by hand. Payload stores Lexical's
 * node tree. This converts between them.
 *
 * Hand-built rather than driven through Lexical's headless editor, and that is a
 * considered trade: the headless route means instantiating an editor, importing
 * the same feature set the field is configured with, and keeping the two in
 * step. For a seed that produces paragraphs, headings, and one trailing link per
 * paragraph, the node shapes are stable, documented, and about forty lines.
 *
 * Every node carries `version: 1` and the format/indent/direction fields
 * Lexical expects. Omitting them produces a document the editor loads but
 * cannot serialise back, which fails at the moment an editor tries to save —
 * long after the seed has been declared a success.
 */
import type { SeedBlock } from "./data/types";

/**
 * The shape Payload's `richText` column holds.
 *
 * A type alias rather than an interface, deliberately: TypeScript gives object
 * type aliases an implicit index signature and interfaces none, and Payload's
 * generated rich-text type carries `[k: string]: unknown`. As an interface this
 * would not be assignable to it, which is a distinction with no meaning here.
 */
export type LexicalDocument = {
  root: {
    type: "root";
    children: LexicalNode[];
    direction: "ltr" | null;
    format: "";
    indent: number;
    version: number;
  };
};

/**
 * A Lexical node.
 *
 * `type` and `version` are required because Payload's generated rich-text type
 * requires them on every child — which is a useful constraint to inherit rather
 * than widen away, since a node missing either is one the editor cannot load.
 */
type LexicalNode = { type: string; version: number; [key: string]: unknown };

function root(children: LexicalNode[]): LexicalDocument {
  return {
    root: {
      type: "root",
      children,
      direction: children.length > 0 ? "ltr" : null,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

function text(value: string): LexicalNode {
  return {
    type: "text",
    /* A bitmask: 0 is unformatted. Bold is 1, italic 2, and so on — nothing the
       seed produces needs any of them. */
    format: 0,
    detail: 0,
    mode: "normal",
    style: "",
    text: value,
    version: 1,
  };
}

function link(label: string, href: string): LexicalNode {
  return {
    type: "link",
    children: [text(label)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 3,
    /*
     * `linkType: "custom"` with a URL, rather than an internal document
     * reference. Every link in the seed points off-site — to a partner's
     * announcement or a journal — so there is nothing in the CMS to reference.
     */
    fields: {
      linkType: "custom",
      newTab: true,
      url: href,
    },
  };
}

function paragraph(children: LexicalNode[]): LexicalNode {
  return {
    type: "paragraph",
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    version: 1,
  };
}

function heading(value: string): LexicalNode {
  return {
    type: "heading",
    /* h2 because h1 is the page's headline field; the editor offers h2 and h3. */
    tag: "h2",
    children: [text(value)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  };
}

/** One or more paragraphs from plain text, split on blank lines. */
export function plainToLexical(value: string): LexicalDocument {
  const paragraphs = value
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return root(paragraphs.map((part) => paragraph([text(part)])));
}

/** An article from the seed's block array. */
export function blocksToLexical(blocks: SeedBlock[] | undefined): LexicalDocument | undefined {
  if (!blocks || blocks.length === 0) return undefined;

  return root(
    blocks.map((block) => {
      if (block.kind === "heading") return heading(block.text);
      const children: LexicalNode[] = [text(block.text)];
      if (block.link) {
        /* The lead-in wording lives in the block's text, so the link needs a
           space before it or the sentence runs into the anchor. */
        children.push(text(" "), link(block.link.label, block.link.href));
      }
      return paragraph(children);
    }),
  );
}

/** An empty document, for a required rich-text field with nothing to say yet. */
export function emptyLexical(): LexicalDocument {
  return root([paragraph([])]);
}
