"use client";
import { m } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ServiceData } from "@/lib/services-data";

export function ServicePageContent({ service }: { service: ServiceData }) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919000000000";
  const waUrl = `https://wa.me/${wa.replace(/\D/g, "")}?text=Hi%2C%20I%27m%20interested%20in%20your%20${encodeURIComponent(service.title)}%20service.`;

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <m.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge variant="purple" className="mb-6 py-1.5 px-4">Service</Badge>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            <GradientText>{service.title}</GradientText>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            {service.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact#inquiry" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
              Get a Quote
            </Button>
            <Button href={waUrl} external size="lg" variant="secondary">
              Chat on WhatsApp
            </Button>
          </div>
        </m.div>
      </section>

      {/* ── Description ───────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.p
            className="text-gray-400 text-lg leading-relaxed text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            {service.description}
          </m.p>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
                <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">What&apos;s Included</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-8">
                Everything You <GradientText>Need</GradientText>
              </h2>
              <ul className="space-y-4">
                {service.features.map((f, i) => (
                  <m.li key={i} className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}>
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                         style={{ background: service.accentColor + "25" }}>
                      <Check className="w-3 h-3" style={{ color: service.accentColor }} />
                    </div>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </m.li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="glass rounded-2xl p-8 border border-purple-500/20">
              <h3 className="font-display font-bold text-white text-xl mb-6">Our Process</h3>
              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <m.div key={i} className="flex gap-4"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                         style={{ background: `linear-gradient(135deg, ${service.accentColor}, #06b6d4)` }}>
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
