import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "About Us — Bhutan NDI",
  description: "Our story, vision and mission, and the people building the platform.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— About us"}
        title={"We enhance and improve digital trust"}
        description={"Our story, vision and mission, and the people building the platform."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="about" />
      <div id="team" />
    </>
  );
}
