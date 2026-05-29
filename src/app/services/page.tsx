import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { CTASection } from "@/components/sections/home/CTASection";
import { GradientText } from "@/components/ui/GradientText";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-Stack Development, WordPress, UI/UX Design, SEO, Social Media Marketing, and Branding — premium digital services.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-8 text-center px-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">What We Offer</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-4">
            Our <GradientText>Services</GradientText>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Everything your business needs to win online — under one roof.
          </p>
        </section>
        <ServicesGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
