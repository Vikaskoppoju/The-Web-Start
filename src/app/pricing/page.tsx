import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/sections/home/PricingSection";
import { FAQSection } from "@/components/sections/home/FAQSection";
import { CTASection } from "@/components/sections/home/CTASection";
import { GradientText } from "@/components/ui/GradientText";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent, flexible pricing for web development, design, SEO, and marketing services.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-8 text-center px-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Transparent Pricing</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-4">
            Simple, <GradientText>Honest</GradientText> Pricing
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            No hidden fees. No surprise invoices. Choose a plan that fits your goals.
          </p>
        </section>
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
