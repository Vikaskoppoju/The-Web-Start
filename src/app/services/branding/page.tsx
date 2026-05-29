import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/home/CTASection";
import { ServicePageContent } from "@/components/sections/services/ServicePageContent";
import { servicesData } from "@/lib/services-data";

const SLUG = "branding";
const svc = servicesData[SLUG];

export const metadata: Metadata = {
  title: svc?.metaTitle,
  description: svc?.metaDesc,
};

export default function ServicePage() {
  if (!svc) notFound();
  return (
    <>
      <Navbar />
      <ServicePageContent service={svc} />
      <CTASection />
      <Footer />
    </>
  );
}
