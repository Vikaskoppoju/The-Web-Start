"use client";
import { useRef } from "react";
import { useScroll, useTransform, m, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, Play, MessageCircle, Globe, Smartphone, Palette, TrendingUp, Code2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

/* ── animation presets ──────────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (d = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.75, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATS = [
  { value: "50+",  label: "Projects" },
  { value: "100%", label: "Satisfaction" },
  { value: "5+",   label: "Yrs Experience" },
  { value: "24hr", label: "Response" },
];

const SERVICES = [
  { icon: Globe,      label: "Web Development" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Palette,    label: "UI / UX Design" },
  { icon: TrendingUp, label: "SEO & Growth" },
  { icon: Code2,      label: "Full-Stack" },
  { icon: Megaphone,  label: "Digital Marketing" },
];

/* ── component ──────────────────────────────────────────────────────────── */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null!);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const wa    = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919000000000";
  const waUrl = `https://wa.me/${wa.replace(/\D/g, "")}?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#04040a]"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── BACKGROUND ─────────────────────────────────────────────────────── */}

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Orb 1 — violet, top-left */}
      <m.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 700, height: 700, top: "-20%", left: "-15%",
          background: "radial-gradient(circle, rgba(109,40,217,0.28) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.08, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 2 — cyan, top-right */}
      <m.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 600, height: 600, top: "-10%", right: "-12%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.12, 1], x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Orb 3 — indigo, bottom-center */}
      <m.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 500, height: 500, bottom: "-10%", left: "30%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ scale: [1, 1.06, 1], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent)",
        }}
      />

      {/* Top glow line */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.6) 40%, rgba(139,92,246,0.9) 50%, rgba(6,182,212,0.6) 60%, transparent 90%)" }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "50%", height: "35vh",
          background: "linear-gradient(to bottom, rgba(124,58,237,0.15) 0%, transparent 100%)",
          filter: "blur(24px)",
        }}
      />

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <m.div
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-10 flex flex-col items-center text-center"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <m.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, rgba(109,40,217,0.18), rgba(6,182,212,0.1))",
              border: "1px solid rgba(124,58,237,0.35)",
              color: "#c4b5fd",
              boxShadow: "0 0 30px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Premium Digital Agency — India
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/80 text-[11px] font-semibold tracking-wide">Available</span>
            </span>
          </span>
        </m.div>

        {/* Headline */}
        <m.div custom={0.1} variants={fadeUp} initial="hidden" animate="visible" className="mb-6 w-full">
          <h1
            className="font-display font-black tracking-tight leading-[1.0] text-white w-full"
            style={{ fontSize: "clamp(3rem, 8.5vw, 6.5rem)" }}
          >
            <span className="block">We Build</span>
            <span
              className="block"
              style={{
                backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #818cf8 30%, #22d3ee 70%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Digital Products
            </span>
            <span className="block">
              That{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 40%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Convert.
              </span>
            </span>
          </h1>
        </m.div>

        {/* Sub-headline */}
        <m.p
          custom={0.22} variants={fadeUp} initial="hidden" animate="visible"
          className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10"
        >
          From stunning websites to scalable apps — we design, develop, and grow
          your digital presence with <span className="text-gray-300 font-medium">precision and speed.</span>
        </m.p>

        {/* CTAs */}
        <m.div
          custom={0.34} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Button href="/contact#inquiry" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
            Start Your Project
          </Button>
          <Button href="/portfolio" size="lg" variant="secondary" icon={<Play className="w-4 h-4" />}>
            View Our Work
          </Button>
          <Button href={waUrl} external size="lg" variant="ghost" icon={<MessageCircle className="w-4 h-4" />}>
            WhatsApp Us
          </Button>
        </m.div>

        {/* Stats row */}
        <m.div
          custom={0.46} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-wrap justify-center gap-px mb-16 rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-8 py-5"
              style={{
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span className="font-display font-extrabold text-3xl text-white mb-0.5"
                style={{
                  backgroundImage: "linear-gradient(135deg, #fff 50%, rgba(167,139,250,0.8) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                {s.value}
              </span>
              <span className="text-gray-600 text-[11px] tracking-widest uppercase font-medium">{s.label}</span>
            </div>
          ))}
        </m.div>

        {/* Floating service pills */}
        <m.div
          custom={0.56} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-wrap justify-center gap-2.5"
        >
          {SERVICES.map(({ icon: Icon, label }) => (
            <m.span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-400 cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              whileHover={{
                color: "#e2e8f0",
                borderColor: "rgba(124,58,237,0.4)",
                background: "rgba(124,58,237,0.08)",
                y: -2,
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-3.5 h-3.5 text-violet-500" />
              {label}
            </m.span>
          ))}
        </m.div>
      </m.div>

      {/* Scroll cue */}
      <m.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <m.div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <m.span
            className="w-1 h-2 rounded-full"
            style={{ background: "rgba(167,139,250,0.6)" }}
            animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </m.div>
        <span className="text-[9px] tracking-[0.3em] uppercase text-gray-700">Scroll</span>
      </m.div>

      {/* Seamless bottom blend */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none"
        style={{ height: 200, background: "linear-gradient(to bottom, transparent 0%, #04040a 100%)" }}
      />
    </section>
  );
}
