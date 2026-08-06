import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "For Organizations — Bhutan NDI",
  description: "Core services, advanced capabilities and the integration path from first enquiry through to production.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— For organizations"}
        title={"Onboard customers in minutes, not weeks"}
        description={"Core services, advanced capabilities and the integration path from first enquiry through to production."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="solutions" />
      <div id="advanced" />
      <div id="inquiry" />
    </>
  );
}
