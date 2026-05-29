import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { MissionSection } from "@/components/sections/about/MissionSection";
import { ValuesSection } from "@/components/sections/about/ValuesSection";
import { CTASection } from "@/components/sections/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Web Start — our story, mission, and the team behind your digital success.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <MissionSection />
        <ValuesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
