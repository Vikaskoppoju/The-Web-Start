"use client";
import { m } from "framer-motion";
import Link from "next/link";
import { Code2, Globe, Palette, TrendingUp, Share2, Sparkles, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Code2, label: "Full-Stack Development",
    slug: "full-stack-development",
    desc: "Scalable web apps from frontend to backend — React, Next.js, Node.js, databases, cloud APIs.",
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    accent: "#7c3aed",
  },
  {
    icon: Globe, label: "WordPress Development",
    slug: "wordpress-development",
    desc: "Custom themes, plugins, WooCommerce stores, and blazing-fast WordPress sites.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
    accent: "#3b82f6",
  },
  {
    icon: Palette, label: "UI/UX Design",
    slug: "ui-ux-design",
    desc: "Pixel-perfect, user-centred interfaces. Wireframes, design systems, and Figma prototypes.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15",
    accent: "#ec4899",
  },
  {
    icon: TrendingUp, label: "SEO",
    slug: "seo",
    desc: "Technical audits, keyword strategy, on-page optimization, and link building for organic growth.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    accent: "#10b981",
  },
  {
    icon: Share2, label: "Social Media Marketing",
    slug: "social-media-marketing",
    desc: "Engage your audience with strategic content, community management, and paid campaigns.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
    accent: "#f97316",
  },
  {
    icon: Sparkles, label: "Branding",
    slug: "branding",
    desc: "Logos, brand systems, colour palettes, typography, and complete brand identity packages.",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    accent: "#8b5cf6",
  },
];

export function ServicesGrid() {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeader
          eyebrow="What We Do"
          title="Premium Services"
          titleHighlight="Built to Perform"
          description="From concept to launch and beyond — every service we offer is engineered for real business results."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <m.div
              key={svc.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <Link href={`/services/${svc.slug}`} className="group block h-full">
                <TiltCard
                  className={cn(
                    "relative h-full glass rounded-2xl p-7 overflow-hidden",
                    "border border-white/[0.07] transition-all duration-300",
                    "group-hover:border-opacity-50"
                  )}
                  maxTilt={10}
                  glareOpacity={0.1}
                >
                  {/* Gradient background on hover */}
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl", svc.gradient)} />

                  {/* Corner glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                       style={{ background: svc.accent + "40" }} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110", svc.iconBg)}>
                      <svc.icon className={cn("w-6 h-6", svc.iconColor)} />
                    </div>

                    {/* Label */}
                    <h3 className="font-display font-bold text-white text-lg mb-3 group-hover:text-white transition-colors">
                      {svc.label}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 group-hover:text-gray-400 transition-colors">
                      {svc.desc}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-1 text-sm font-medium"
                         style={{ color: svc.accent }}>
                      Learn more
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
