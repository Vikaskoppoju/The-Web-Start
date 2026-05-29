"use client";
import { m } from "framer-motion";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const projects = [
  {
    title: "HealthSync Dashboard",
    client: "HealthSync Inc.",
    category: "Full-Stack",
    tags: ["Next.js", "TypeScript", "D3.js"],
    description: "Real-time health analytics platform serving 50k+ users with interactive dashboards and predictive insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    slug: "healthsync-dashboard",
    badgeVariant: "purple" as const,
  },
  {
    title: "Luxe E-Commerce Store",
    client: "Luxe Fashion",
    category: "WordPress",
    tags: ["WooCommerce", "PHP", "UI/UX"],
    description: "Premium fashion store with custom product configurator, AR try-on integration, and 300% conversion uplift.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    slug: "luxe-ecommerce",
    badgeVariant: "cyan" as const,
  },
  {
    title: "Finova Brand Identity",
    client: "Finova Capital",
    category: "Branding",
    tags: ["Figma", "Brand Strategy", "Identity"],
    description: "End-to-end brand identity for a fintech startup — from positioning strategy to full visual system.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    slug: "finova-branding",
    badgeVariant: "green" as const,
  },
];

export function PortfolioTeaser() {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Our Work"
            title="Featured"
            titleHighlight="Projects"
            description="A glimpse of what we've built for clients who dared to think bigger."
            centered={false}
          />
          <Button href="/portfolio" variant="secondary" iconRight={<ArrowRight className="w-4 h-4" />}
            className="flex-shrink-0 self-start sm:self-end">
            View All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <m.div
              key={project.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                <m.article
                  className="relative h-full glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${i === 0 ? "h-60 sm:h-72" : "h-48"}`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-transparent to-transparent" />

                    {/* External link overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/20">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <Badge variant={project.badgeVariant}>{project.category}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-xs mb-1">{project.client}</p>
                    <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </m.article>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
