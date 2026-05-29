"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Founder, NutriTrack",
    avatar: "PS",
    content: "The Web Start transformed our idea into a stunning, high-performance app in record time. Their attention to detail and communication were outstanding. Best agency we've worked with.",
    rating: 5,
    service: "Full-Stack Development",
    accentColor: "#7c3aed",
  },
  {
    name: "Rahul Mehta",
    role: "CEO, ShopLocal India",
    avatar: "RM",
    content: "Our WooCommerce store saw a 300% jump in conversions after the redesign. The team understood our customers better than we did. Absolutely incredible work.",
    rating: 5,
    service: "WordPress Development",
    accentColor: "#06b6d4",
  },
  {
    name: "Aisha Kapoor",
    role: "Marketing Director, Finova",
    avatar: "AK",
    content: "The brand identity they created gave us instant credibility with investors. Professional, creative, and delivered ahead of schedule. Highly recommend for any branding project.",
    rating: 5,
    service: "Branding",
    accentColor: "#10b981",
  },
  {
    name: "Vikram Singh",
    role: "COO, EdTech Startup",
    avatar: "VS",
    content: "SEO results speak for themselves — 400% organic traffic growth in 6 months. They know exactly what they're doing and the monthly reports are detailed and transparent.",
    rating: 5,
    service: "SEO",
    accentColor: "#f97316",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-glow-primary pointer-events-none" />

      <div className="container-custom relative">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Clients"
          titleHighlight="Say"
          description="Don't take our word for it — hear directly from the businesses we've helped grow."
          className="mb-16"
        />

        <div className="max-w-3xl mx-auto">
          {/* Main card */}
          <AnimatePresence mode="wait">
            <m.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="glass-strong rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden mb-8"
            >
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
                   style={{ background: t.accentColor }} />

              {/* Quote icon */}
              <Quote className="w-10 h-10 mb-6 opacity-30" style={{ color: t.accentColor }} />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-200 text-lg sm:text-xl leading-relaxed mb-8 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                     style={{ background: `linear-gradient(135deg, ${t.accentColor}, #06b6d4)` }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-3 py-1 rounded-full border" style={{ color: t.accentColor, borderColor: t.accentColor + "40", background: t.accentColor + "15" }}>
                    {t.service}
                  </span>
                </div>
              </div>
            </m.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: active === i ? 24 : 8,
                    height: 8,
                    background: active === i ? "linear-gradient(90deg,#7c3aed,#06b6d4)" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            <button onClick={next}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
