"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Full-Stack", "WordPress", "UI/UX", "Branding", "SEO"];

const projects = [
  { title: "HealthSync Dashboard", client: "HealthSync Inc.", category: "Full-Stack", tags: ["Next.js", "TypeScript", "D3.js"], desc: "Real-time health analytics platform with interactive dashboards.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80", slug: "healthsync-dashboard", badgeVariant: "purple" as const },
  { title: "Luxe E-Commerce", client: "Luxe Fashion", category: "WordPress", tags: ["WooCommerce", "PHP", "Custom Theme"], desc: "Premium fashion store with AR try-on integration.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80", slug: "luxe-ecommerce", badgeVariant: "cyan" as const },
  { title: "Finova Brand Identity", client: "Finova Capital", category: "Branding", tags: ["Figma", "Identity", "Strategy"], desc: "Complete brand identity for a fintech startup.", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80", slug: "finova-branding", badgeVariant: "green" as const },
  { title: "EdPrime LMS", client: "EdPrime", category: "Full-Stack", tags: ["React", "Node.js", "PostgreSQL"], desc: "Learning management system for 10k+ students.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80", slug: "edprime-lms", badgeVariant: "purple" as const },
  { title: "Bloom Wellness", client: "Bloom Studio", category: "UI/UX", tags: ["Figma", "Prototyping", "Research"], desc: "Wellness app redesign increasing retention by 45%.", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80", slug: "bloom-wellness", badgeVariant: "orange" as const },
  { title: "TechGrow SEO", client: "TechGrow SaaS", category: "SEO", tags: ["Technical SEO", "Content", "Link Building"], desc: "400% organic traffic growth in 6 months.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80", slug: "techgrow-seo", badgeVariant: "green" as const },
];

export function PortfolioGrid() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                active === cat
                  ? "text-white shadow-glow-sm"
                  : "glass text-gray-500 hover:text-gray-300 border border-white/10"
              )}
              style={active === cat ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)" } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <m.div key={project.slug} layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                  <article className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/15 transition-all duration-300 h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img src={project.image} alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/20">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant={project.badgeVariant}>{project.category}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-xs mb-1">{project.client}</p>
                      <h3 className="font-display font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">{project.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              </m.div>
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
