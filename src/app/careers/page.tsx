import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Careers — Bhutan NDI",
  description: "Open roles across engineering, design and communications, based in Thimphu.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— Careers"}
        title={"Work on something a whole country uses"}
        description={"Open roles across engineering, design and communications, based in Thimphu."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="careers" />
    </>
  );
}
