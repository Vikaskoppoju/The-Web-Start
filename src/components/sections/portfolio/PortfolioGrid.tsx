"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const categories = ["All", "WordPress", "Full-Stack", "Branding", "SEO"];

const projects = [
  {
    title: "Portfolio Website",
    client: "Client — Branding & Web",
    category: "WordPress",
    tags: ["WordPress", "Domain", "Hosting", "SEO", "Branding"],
    desc: "A professional portfolio built with WordPress, optimized for SEO and branding, with a custom domain and reliable hosting setup.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80",
    slug: "portfolio-website",
    badgeVariant: "cyan" as const,
  },
  {
    title: "Portfolio Website",
    client: "Client — Full Digital Presence",
    category: "WordPress",
    tags: ["WordPress", "Domain", "Hosting", "SEO", "Branding", "Social Media"],
    desc: "A professional portfolio built with WordPress, featuring SEO optimization, strong branding, custom domain, reliable hosting, and integrated social media presence.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80",
    slug: "portfolio-website-social",
    badgeVariant: "purple" as const,
  },
  {
    title: "College Website",
    client: "Educational Institution",
    category: "Full-Stack",
    tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
    desc: "A responsive college website with clean UI, smooth navigation, and informative content sections built with HTML, CSS, JavaScript, jQuery, and Bootstrap.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    slug: "college-website",
    badgeVariant: "green" as const,
  },
  {
    title: "Student ID Card Collector",
    client: "Educational Institution",
    category: "Full-Stack",
    tags: ["Web App", "Database", "Forms", "ID Cards"],
    desc: "A web application to collect and manage student details for ID card generation, with a clean form interface and data management dashboard.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    slug: "student-id-card",
    badgeVariant: "orange" as const,
  },
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
                      <Image src={project.image} alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
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
