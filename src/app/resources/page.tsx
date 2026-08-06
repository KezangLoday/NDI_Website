import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Resources — Bhutan NDI",
  description: "News and updates, webinar recordings, and insights and publications from the Bhutan NDI programme.",
};

export default function Page() {
  return (
    <>
      <PagePlaceholder
        eyebrow={"— Resources"}
        title={"Announcements, sessions and research"}
        description={"News and updates, webinar recordings, and insights and publications from the Bhutan NDI programme."}
      />
      {/* Anchors the nav and other pages deep-link to; kept so those links resolve. */}
      <div id="news" />
      <div id="webinars" />
      <div id="insights" />
    </>
  );
}
