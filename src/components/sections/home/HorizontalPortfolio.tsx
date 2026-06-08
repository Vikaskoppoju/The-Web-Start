"use client";
import { useRef } from "react";
import { useScroll, useTransform, m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { GradientText } from "@/components/ui/GradientText";
import { TiltCard } from "@/components/ui/TiltCard";
import { Badge } from "@/components/ui/Badge";

const projects = [
  {
    title: "Portfolio Website",
    client: "Client — Branding & Web",
    category: "WordPress",
    tags: ["WordPress", "SEO", "Branding", "Hosting"],
    description: "A professional portfolio built with WordPress, optimized for SEO and branding, with a custom domain and reliable hosting setup.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80",
    slug: "portfolio-website",
    accent: "#06b6d4",
    badgeVariant: "cyan" as const,
    year: "2024",
  },
  {
    title: "Portfolio Website",
    client: "Client — Full Digital Presence",
    category: "WordPress",
    tags: ["WordPress", "SEO", "Branding", "Social Media"],
    description: "A professional portfolio with SEO optimization, strong branding, custom domain, reliable hosting, and integrated social media presence.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80",
    slug: "portfolio-website-social",
    accent: "#7c3aed",
    badgeVariant: "purple" as const,
    year: "2024",
  },
  {
    title: "College Website",
    client: "Educational Institution",
    category: "Full-Stack",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    description: "A responsive college website with clean UI, smooth navigation, and informative content sections.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    slug: "college-website",
    accent: "#10b981",
    badgeVariant: "green" as const,
    year: "2024",
  },
  {
    title: "Student ID Card Collector",
    client: "Educational Institution",
    category: "Full-Stack",
    tags: ["Web App", "Database", "Forms"],
    description: "A web application to collect and manage student details for ID card generation, with a clean form interface and data dashboard.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    slug: "student-id-card",
    accent: "#f97316",
    badgeVariant: "orange" as const,
    year: "2025",
  },
];

function ProjectCard({ project, i }: { project: (typeof projects)[number]; i: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
    >
      <Link href={`/portfolio/${project.slug}`} className="group block h-full">
        <TiltCard
          className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-colors duration-300 h-full flex flex-col"
          maxTilt={10}
          glareOpacity={0.1}
        >
          <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
            <Image src={project.image} alt={project.title} fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width:768px) 100vw, 420px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/20 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                 style={{ background: project.accent + "20" }}>
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/30">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute top-4 left-4"><Badge variant={project.badgeVariant}>{project.category}</Badge></div>
            <div className="absolute top-4 right-4"><span className="text-gray-400 text-xs font-mono">{project.year}</span></div>
          </div>
          <div className="flex flex-col flex-1 p-5 sm:p-6">
            <p className="text-gray-600 text-xs mb-1.5">{project.client}</p>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[11px] text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">{tag}</span>
              ))}
            </div>
          </div>
        </TiltCard>
      </Link>
    </m.div>
  );
}

export function HorizontalPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const CARD_WIDTH = 420;
  const GAP = 24;
  const totalSlide = (projects.length - 1) * (CARD_WIDTH + GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalSlide]);

  const SectionHeader = (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div>
        <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase block mb-3">Our Work</span>
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
  );

  return (
    <>
      {/* ── MOBILE / TABLET — simple responsive grid ─────────────── */}
      <section className="lg:hidden section-padding">
        <div className="container-custom">
          {SectionHeader}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} i={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group">
              View all projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DESKTOP — horizontal scroll ──────────────────────────── */}
      <section ref={containerRef} style={{ height: `${projects.length * 60}vh` }}
        className="relative hidden lg:block">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="px-12 lg:px-16 mb-10 flex items-end justify-between">
            {SectionHeader}
          </div>

          <div className="overflow-visible pl-12 lg:pl-16">
            <m.div className="flex gap-6" style={{ x, willChange: "transform" }}>
              {projects.map((project, i) => (
                <m.div key={project.slug} className="flex-shrink-0" style={{ width: CARD_WIDTH }}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
                  <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                    <TiltCard className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-colors duration-300 h-[460px] flex flex-col"
                      maxTilt={10} glareOpacity={0.1}>
                      <div className="relative h-52 overflow-hidden flex-shrink-0">
                        <Image src={project.image} alt={project.title} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="420px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/20 to-transparent" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                             style={{ background: project.accent + "20" }}>
                          <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/30">
                            <ExternalLink className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4"><Badge variant={project.badgeVariant}>{project.category}</Badge></div>
                        <div className="absolute top-4 right-4"><span className="text-gray-400 text-xs font-mono">{project.year}</span></div>
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <p className="text-gray-600 text-xs mb-1.5">{project.client}</p>
                        <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">{project.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed flex-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {project.tags.map((tag) => (
                            <span key={tag} className="text-[11px] text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </m.div>
              ))}
              <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 280 }}>
                <Link href="/portfolio" className="group flex flex-col items-center gap-4 text-center p-8">
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

          <div className="flex items-center gap-4 px-12 lg:px-16 mt-8">
            <div className="h-0.5 w-48 rounded-full overflow-hidden bg-white/10">
              <m.div className="h-full rounded-full"
                style={{ scaleX: scrollYProgress, transformOrigin: "left", background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
            </div>
            <span className="text-gray-600 text-xs">Scroll to explore</span>
          </div>
        </div>
      </section>
    </>
  );
}
