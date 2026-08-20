/** Builds Lexical documents for the seed. */
import type { SeedBlock } from "./data/types";

/** The shape Payload's `richText` column holds. */
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

/** A Lexical node. */
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
    /* A bitmask: 0 is unformatted. */
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
    /* `linkType: "custom"` with a URL, rather than an internal document reference. */
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
        /* The lead-in wording lives in the block's text, so the link needs a space before it or the sentence runs into the anchor. */
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
