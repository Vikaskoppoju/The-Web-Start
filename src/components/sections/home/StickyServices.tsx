"use client";
import { useRef } from "react";
import { useScroll, useTransform, m, type MotionValue } from "framer-motion";
import { Code2, Globe, Palette, TrendingUp, Share2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GradientText } from "@/components/ui/GradientText";
import { TiltCard } from "@/components/ui/TiltCard";

const services = [
  {
    icon: Code2, label: "Full-Stack Development",
    slug: "full-stack-development",
    desc: "End-to-end web apps — React, Next.js, Node.js, APIs, cloud deployments.",
    number: "01", accent: "#7c3aed", bg: "from-purple-900/40 to-purple-900/10",
    tags: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    icon: Globe, label: "WordPress Development",
    slug: "wordpress-development",
    desc: "Custom themes, plugins, WooCommerce stores — fast, secure, scalable.",
    number: "02", accent: "#3b82f6", bg: "from-blue-900/40 to-blue-900/10",
    tags: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    icon: Palette, label: "UI/UX Design",
    slug: "ui-ux-design",
    desc: "Research-driven design systems, wireframes, and pixel-perfect Figma prototypes.",
    number: "03", accent: "#ec4899", bg: "from-pink-900/40 to-pink-900/10",
    tags: ["Figma", "Design System", "Prototyping"],
  },
  {
    icon: TrendingUp, label: "SEO",
    slug: "seo",
    desc: "Technical audits, keyword strategy, content, link building — sustainable growth.",
    number: "04", accent: "#10b981", bg: "from-emerald-900/40 to-emerald-900/10",
    tags: ["Technical SEO", "Content", "Analytics"],
  },
  {
    icon: Share2, label: "Social Media Marketing",
    slug: "social-media-marketing",
    desc: "Strategy, content creation, community management, and paid campaigns.",
    number: "05", accent: "#f97316", bg: "from-orange-900/40 to-orange-900/10",
    tags: ["Meta Ads", "Content", "Analytics"],
  },
  {
    icon: Sparkles, label: "Branding",
    slug: "branding",
    desc: "Logo, visual identity, brand guidelines — a system that stands out and lasts.",
    number: "06", accent: "#8b5cf6", bg: "from-violet-900/40 to-violet-900/10",
    tags: ["Logo Design", "Brand Identity", "Style Guide"],
  },
];

// ── Each card is its own component so useTransform hooks are at component level
interface CardProps {
  svc: (typeof services)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function ServiceCard({ svc, index, total, scrollYProgress }: CardProps) {
  const start = index / total;
  const end   = (index + 1) / total;

  // Ensure offsets are strictly non-decreasing and within [0,1]
  const s0 = Math.max(0, start - 0.06);
  const s1 = start + 0.09;
  const e0 = Math.max(s1 + 0.01, end - 0.09);
  const e1 = Math.min(1, end);

  const y       = useTransform(scrollYProgress, [s0, s1, e0, e1], ["110%",  "0%", "0%",    "-110%"]);
  const opacity = useTransform(scrollYProgress, [s0, s1, e0, e1], [0,       1,    1,         0]);
  const scale   = useTransform(scrollYProgress, [s0, s1, e0, e1], [0.9,    1,    1,         0.9]);

  return (
    <m.div className="absolute inset-0" style={{ y, opacity, scale }}>
      <TiltCard
        className={`h-full glass rounded-3xl border border-white/10 bg-gradient-to-br ${svc.bg} overflow-hidden`}
        maxTilt={8}
        glareOpacity={0.12}
      >
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-10">
          {/* Number watermark */}
          <div className="absolute top-6 right-8 font-display font-black text-8xl lg:text-9xl text-white/[0.04] select-none leading-none pointer-events-none">
            {svc.number}
          </div>

          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                 style={{ background: svc.accent + "25", border: `1px solid ${svc.accent}40` }}>
              <svc.icon className="w-7 h-7" style={{ color: svc.accent }} />
            </div>
            <h3 className="font-display font-bold text-3xl lg:text-4xl text-white mb-4 leading-tight">
              {svc.label}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              {svc.desc}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-wrap gap-2">
              {svc.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ color: svc.accent, borderColor: svc.accent + "50", background: svc.accent + "15" }}>
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/services/${svc.slug}`}
              className="flex items-center gap-2 text-sm font-semibold group flex-shrink-0 ml-4"
              style={{ color: svc.accent }}>
              Learn more
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </TiltCard>
    </m.div>
  );
}

// Scroll progress bar — own component so useTransform is at component level
function ProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="mt-10">
      <div className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full">
        <m.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ scaleX: scrollYProgress, transformOrigin: "left", background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }}
        />
      </div>
      <p className="text-gray-600 text-xs mt-3">Scroll to explore all services</p>
    </div>
  );
}

// ── Main exported section ─────────────────────────────────────────────────────
export function StickyServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: `${services.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">

        {/* Left — fixed panel */}
        <div className="absolute left-0 top-0 bottom-0 w-[38%] hidden lg:flex flex-col justify-center px-12 z-10">
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase block mb-4">
              What We Do
            </span>
            <h2 className="font-display font-black text-5xl xl:text-6xl text-white leading-tight mb-6">
              Every Service
              <br />
              <GradientText>You Need</GradientText>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Six specialised services. One team. Zero compromise.
            </p>
            <ProgressBar scrollYProgress={scrollYProgress} />
          </m.div>
        </div>

        {/* Right — stacked animated cards */}
        <div className="ml-auto w-full lg:w-[58%] h-screen flex flex-col justify-center px-4 sm:px-8 lg:pr-12 overflow-hidden">
          <div className="relative h-[420px]">
            {services.map((svc, i) => (
              <ServiceCard
                key={svc.slug}
                svc={svc}
                index={i}
                total={services.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
