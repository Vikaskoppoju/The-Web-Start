"use client";
import { useRef } from "react";
import { useScroll, useTransform, m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { GradientText } from "@/components/ui/GradientText";
import { TiltCard } from "@/components/ui/TiltCard";
import { Badge } from "@/components/ui/Badge";

const projects = [
  {
    title: "HealthSync Dashboard",
    client: "HealthSync Inc.",
    category: "Full-Stack",
    tags: ["Next.js", "TypeScript", "D3.js"],
    description: "Real-time health analytics platform with interactive dashboards and predictive insights for 50k+ users.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    slug: "healthsync-dashboard",
    accent: "#7c3aed",
    badgeVariant: "purple" as const,
    year: "2024",
  },
  {
    title: "Luxe E-Commerce",
    client: "Luxe Fashion",
    category: "WordPress",
    tags: ["WooCommerce", "PHP", "UI/UX"],
    description: "Premium fashion store with AR try-on integration and 300% conversion rate uplift.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    slug: "luxe-ecommerce",
    accent: "#06b6d4",
    badgeVariant: "cyan" as const,
    year: "2024",
  },
  {
    title: "Finova Brand Identity",
    client: "Finova Capital",
    category: "Branding",
    tags: ["Brand Strategy", "Figma", "Identity"],
    description: "End-to-end brand identity for a fintech startup — from positioning to full visual system.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    slug: "finova-branding",
    accent: "#10b981",
    badgeVariant: "green" as const,
    year: "2023",
  },
  {
    title: "EduFlow Platform",
    client: "EduFlow",
    category: "Full-Stack",
    tags: ["React", "Node.js", "PostgreSQL"],
    description: "Online learning platform with live classrooms, AI tutoring, and adaptive learning paths.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    slug: "eduflow-platform",
    accent: "#f97316",
    badgeVariant: "orange" as const,
    year: "2023",
  },
  {
    title: "NutriTrack App",
    client: "NutriTrack",
    category: "UI/UX Design",
    tags: ["Figma", "Mobile", "Design System"],
    description: "Nutrition tracking mobile app with a beautiful design system used by 20k daily active users.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    slug: "nutritrack-app",
    accent: "#8b5cf6",
    badgeVariant: "purple" as const,
    year: "2023",
  },
];

export function HorizontalPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // How far to slide: (n-1) cards × card width
  const CARD_WIDTH  = 420; // px
  const GAP         = 24;
  const totalSlide  = (projects.length - 1) * (CARD_WIDTH + GAP);

  const x = useTransform(scrollYProgress, [0, 1], [0, -totalSlide]);

  return (
    <section ref={containerRef} style={{ height: `${projects.length * 60}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-12 lg:px-16 mb-10 flex items-end justify-between">
          <div>
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase block mb-3">
              Our Work
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Selected <GradientText>Projects</GradientText>
            </h2>
          </div>
          <Link href="/portfolio"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group flex-shrink-0 mb-2">
            View all work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll track */}
        <div className="overflow-visible pl-6 sm:pl-12 lg:pl-16">
          <m.div
            className="flex gap-6"
            style={{ x, willChange: "transform" }}
          >
            {projects.map((project, i) => (
              <m.div
                key={project.slug}
                className="flex-shrink-0"
                style={{ width: CARD_WIDTH }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                  <TiltCard
                    className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-colors duration-300 h-[460px] flex flex-col"
                    maxTilt={10}
                    glareOpacity={0.1}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/20 to-transparent" />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                           style={{ background: project.accent + "20" }}>
                        <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/30">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant={project.badgeVariant}>{project.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="text-gray-400 text-xs font-mono">{project.year}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      <p className="text-gray-600 text-xs mb-1.5">{project.client}</p>
                      <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[11px] text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </m.div>
            ))}

            {/* End card — View all CTA */}
            <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 280 }}>
              <Link href="/portfolio"
                className="group flex flex-col items-center gap-4 text-center p-8">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center border border-purple-500/40 group-hover:border-purple-500/80 transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg mb-1">View All Projects</div>
                  <div className="text-gray-600 text-sm">20+ case studies</div>
                </div>
              </Link>
            </div>
          </m.div>
        </div>

        {/* Scroll hint */}
        <div className="flex items-center gap-4 px-6 sm:px-12 lg:px-16 mt-8">
          <m.div
            className="h-0.5 rounded-full overflow-hidden bg-white/10"
            style={{ width: 200 }}
          >
            <m.div
              className="h-full rounded-full"
              style={{
                scaleX: scrollYProgress,
                transformOrigin: "left",
                background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
              }}
            />
          </m.div>
          <span className="text-gray-600 text-xs">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
