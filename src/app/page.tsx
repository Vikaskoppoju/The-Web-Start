import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/home/HeroSection";

// Dynamic imports — only load when scrolled near
const StatsSection        = dynamic(() => import("@/components/sections/home/StatsSection").then(m => ({ default: m.StatsSection })));
const StickyServices      = dynamic(() => import("@/components/sections/home/StickyServices").then(m => ({ default: m.StickyServices })));
const WhyUsSection        = dynamic(() => import("@/components/sections/home/WhyUsSection").then(m => ({ default: m.WhyUsSection })));
const HorizontalPortfolio = dynamic(() => import("@/components/sections/home/HorizontalPortfolio").then(m => ({ default: m.HorizontalPortfolio })));
const TestimonialsSection = dynamic(() => import("@/components/sections/home/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const PricingSection      = dynamic(() => import("@/components/sections/home/PricingSection").then(m => ({ default: m.PricingSection })));
const FAQSection          = dynamic(() => import("@/components/sections/home/FAQSection").then(m => ({ default: m.FAQSection })));
const CTASection          = dynamic(() => import("@/components/sections/home/CTASection").then(m => ({ default: m.CTASection })));

export const metadata: Metadata = {
  title: "The Web Start — Premium Software Agency",
  description:
    "Full-Stack Development, WordPress, UI/UX Design, SEO, Social Media Marketing, and Branding. We build digital products that convert.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero with 3D particles + depth parallax */}
        <HeroSection />

        {/* Stats counter bar */}
        <StatsSection />

        {/* Sticky scroll services — each card reveals on scroll */}
        <StickyServices />

        {/* Why Us */}
        <WhyUsSection />

        {/* Horizontal scroll portfolio */}
        <HorizontalPortfolio />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
