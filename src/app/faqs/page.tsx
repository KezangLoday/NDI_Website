import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "FAQs — Bhutan NDI",
  description: "Common questions from citizens and from organizations integrating with Bhutan NDI.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— FAQs"}
        title={"Answers about your identity"}
        description={"Common questions from citizens and from organizations integrating with Bhutan NDI."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="faqs" />
    </>
  );
}
