/** The article editor. */
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

/** Body copy for news stories and publications. */
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

/** A single-paragraph editor for short answers. */
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
