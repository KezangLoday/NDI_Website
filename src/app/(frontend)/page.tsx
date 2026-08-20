import { Capabilities } from "@/components/home/Capabilities";
import { Collaborators } from "@/components/home/Collaborators";
import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { NewsSection } from "@/components/home/NewsSection";
import { TrustedBy } from "@/components/home/TrustedBy";
import { UserGuide } from "@/components/home/UserGuide";
import { WhatYouCanDo } from "@/components/home/WhatYouCanDo";

export default function HomePage() {
  return (
    <>
      <div id="top" />
      <Hero />
      <WhatYouCanDo />
      <Capabilities />
      <NewsSection />
      <TrustedBy />
      <UserGuide />
      <Collaborators />
      <ContactSection />
    </>
  );
}
