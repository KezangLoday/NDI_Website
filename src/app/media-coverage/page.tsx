import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Media Coverage — Bhutan NDI",
  description: "International and national coverage, interviews and features on Bhutan’s national digital identity.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— Media coverage"}
        title={"Bhutan NDI in the press"}
        description={"International and national coverage, interviews and features on Bhutan’s national digital identity."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="media" />
    </>
  );
}
