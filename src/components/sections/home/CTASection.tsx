"use client";
import { m } from "framer-motion";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";

export function CTASection() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919000000000";
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/thewebstart";
  const waUrl = `https://wa.me/${wa.replace(/\D/g, "")}?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container-custom relative">
        <m.div
          className="glass-strong rounded-3xl p-10 sm:p-16 border border-purple-500/25 relative overflow-hidden text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-25"
               style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20"
               style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20 rounded-3xl"
            style={{
              backgroundImage: "linear-gradient(rgba(124,58,237,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <m.div
              className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 rounded-full px-4 py-1.5 text-xs text-purple-300 font-medium mb-6"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Now Accepting Projects for 2025
            </m.div>

            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Ready to Build
              <br />
              <GradientText>Something Amazing?</GradientText>
            </h2>

            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              Let&apos;s turn your vision into a digital product that drives real results. Book a free discovery call today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/contact#inquiry" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
                Start Your Project
              </Button>
              <Button href={calendly} external size="lg" variant="secondary"
                icon={<Calendar className="w-4 h-4" />}>
                Book a Free Call
              </Button>
              <Button href={waUrl} external size="lg" variant="ghost"
                icon={<MessageCircle className="w-4 h-4" />}>
                Chat on WhatsApp
              </Button>
            </div>

            <p className="text-gray-600 text-xs mt-8">
              No commitment required. Free consultation. Response within 24 hours.
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
