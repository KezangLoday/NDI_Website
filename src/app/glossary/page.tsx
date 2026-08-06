import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Glossary — Bhutan NDI",
  description: "Key terms across decentralized identity, verifiable credentials and digital trust, explained plainly.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— Glossary"}
        title={"The language of self-sovereign identity"}
        description={"Key terms across decentralized identity, verifiable credentials and digital trust, explained plainly."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="glossary" />
    </>
  );
}
