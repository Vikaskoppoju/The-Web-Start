"use client";
import { m } from "framer-motion";
import { GradientText } from "@/components/ui/GradientText";
import { Badge } from "@/components/ui/Badge";
import { Zap } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge variant="purple" className="mb-6 py-1.5 px-4">
            <Zap className="w-3.5 h-3.5" /> Our Story
          </Badge>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            We&apos;re Builders,
            <br />
            <GradientText>Not Just Coders</GradientText>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
            The Web Start was born from a simple belief: every business deserves a digital presence that actually works.
            We combine craft, code, and strategy to make that happen.
          </p>
        </m.div>
      </div>
    </section>
  );
}
