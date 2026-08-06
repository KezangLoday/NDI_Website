import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Governance — Bhutan NDI",
  description: "The Bhutan NDI Act, the institutional framework, and the standards, privacy and penalties that sit behind it.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— Governance"}
        title={"The Governance Framework"}
        description={"The Bhutan NDI Act, the institutional framework, and the standards, privacy and penalties that sit behind it."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="act" />
      <div id="purpose" />
      <div id="institutions" />
      <div id="framework" />
      <div id="standards" />
      <div id="privacy" />
      <div id="offences" />
      <div id="chapters" />
    </>
  );
}
