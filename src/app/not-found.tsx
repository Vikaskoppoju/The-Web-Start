import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">404 — Page Not Found</p>
          <h1 className="font-display font-black text-6xl sm:text-8xl text-white mb-4">
            <GradientText>Oops.</GradientText>
          </h1>
          <p className="text-gray-400 text-xl max-w-md mx-auto mb-8">
            This page doesn&apos;t exist or has been moved.
          </p>
          <Button href="/" iconRight={<ArrowRight className="w-4 h-4" />}>
            Back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
