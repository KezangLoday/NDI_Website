import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "For Users — Bhutan NDI",
  description: "Access services securely, verify your identity digitally, and manage your credentials from one trusted wallet.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— For citizens"}
        title={"Bhutan NDI for you"}
        description={"Access services securely, verify your identity digitally, and manage your credentials from one trusted wallet."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="use-cases" />
      <div id="in-action" />
      <div id="get-started" />
    </>
  );
}
