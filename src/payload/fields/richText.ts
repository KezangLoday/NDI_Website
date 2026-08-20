/**
 * The article editor.
 *
 * Deliberately smaller than Lexical's default feature set. The site's article
 * typography is a specific thing — one heading level inside the body, a
 * measure of 66 characters, a particular link treatment — and every feature
 * offered here is a way for an editor to produce something the renderer has to
 * have an answer for. So the toolbar carries what a press release and a
 * research summary actually need, and nothing else.
 *
 * What is left out, and why:
 *
 *  - **H1.** The page's `h1` is the headline, which is a field. A second one in
 *    the body would be wrong for both search engines and screen readers.
 *  - **Alignment and indentation.** Centred body copy has no place in this
 *    design, and an indent has nothing to indent relative to.
 *  - **Tables.** They would need responsive treatment the site does not have,
 *    and a table that overflows on a phone is worse than a list.
 *  - **Inline images.** Article artwork is the featured image, and the gallery
 *    field handles the rest — both of which the layout positions properly.
 *    Images placed mid-paragraph would need their own sizing rules.
 */
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { RichTextField } from "payload";

/**
 * Body copy for news stories and publications.
 *
 * `linkFields` restricts links to the two kinds that make sense: an address
 * typed in, or a reference to another document in the CMS. The second is what
 * keeps internal links working when a slug changes.
 */
export function articleEditor() {
  return lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      BlockquoteFeature(),
      LinkFeature({
        enabledCollections: ["news", "insights", "webinars", "jobs"],
      }),
      InlineToolbarFeature(),
    ],
  });
}

/**
 * A single-paragraph editor for short answers.
 *
 * FAQ answers and glossary definitions are one or two sentences that sometimes
 * need a link or a list. No headings: a heading inside an accordion panel is a
 * document outline nobody can navigate.
 */
export function proseEditor() {
  return lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature({ enabledCollections: ["news", "insights", "glossary"] }),
      InlineToolbarFeature(),
    ],
  });
}

/** The article body field, shared by News stories and Insights. */
export function bodyField(description: string): RichTextField {
  return {
    name: "body",
    type: "richText",
    editor: articleEditor(),
    label: "Article",
    admin: { description },
  };
}
