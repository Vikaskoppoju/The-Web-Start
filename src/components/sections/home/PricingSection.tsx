"use client";
import { useState } from "react";
import { m } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Period = "monthly" | "project";

const plans = [
  {
    name: "Starter",
    monthlyPrice: "₹15,000",
    projectPrice: "₹49,000",
    period: "/ month",
    description: "Perfect for small businesses and startups getting their digital presence started.",
    features: [
      "5-page Website Design & Dev",
      "WordPress or Next.js",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form Integration",
      "3 Revisions",
      "1 Month Support",
    ],
    cta: "Get Started",
    href: "/contact#inquiry",
    featured: false,
    accentColor: "#4b5563",
  },
  {
    name: "Growth",
    monthlyPrice: "₹35,000",
    projectPrice: "₹1,20,000",
    period: "/ month",
    description: "For growing businesses that need a complete digital strategy and execution.",
    features: [
      "Full-Stack Web Application",
      "Custom UI/UX Design (Figma)",
      "SEO + Content Strategy",
      "Social Media Setup (3 platforms)",
      "Performance Optimization",
      "Admin Dashboard",
      "Unlimited Revisions",
      "3 Months Priority Support",
    ],
    cta: "Start Growing",
    href: "/contact#inquiry",
    featured: true,
    accentColor: "#7c3aed",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    projectPrice: "Custom",
    period: "",
    description: "Tailored solutions for large businesses with complex requirements and scale.",
    features: [
      "Everything in Growth",
      "Dedicated Project Manager",
      "Custom Integrations & APIs",
      "E-commerce (WooCommerce / Custom)",
      "Multi-language Support",
      "Advanced Analytics",
      "24/7 Priority Support",
      "SLA Guarantee",
    ],
    cta: "Contact Us",
    href: "/contact",
    featured: false,
    accentColor: "#06b6d4",
  },
];

export function PricingSection() {
  const [period, setPeriod] = useState<Period>("project");

  return (
    <section className="section-padding" id="pricing">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent"
          titleHighlight="Pricing"
          description="No hidden fees, no surprises. Choose a plan that fits your ambitions."
          className="mb-10"
        />

        {/* Period Toggle */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-full p-1 flex gap-1">
            {(["project", "monthly"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  period === p
                    ? "text-white shadow-glow-sm"
                    : "text-gray-500 hover:text-gray-300"
                )}
                style={period === p ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)" } : undefined}
              >
                {p === "project" ? "Per Project" : "Retainer"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <m.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn("flex flex-col", plan.featured && "-mt-4")}
            >
              <div className={cn(
                "flex-1 glass rounded-2xl p-8 relative overflow-hidden transition-all duration-300 border",
                plan.featured
                  ? "border-purple-500/50 shadow-glow-md"
                  : "border-white/[0.07] hover:border-white/15"
              )}>
                {plan.featured && (
                  <>
                    {/* Featured badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1 text-xs text-purple-300 font-medium">
                      <Zap className="w-3 h-3" /> Most Popular
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 rounded-2xl" />
                  </>
                )}

                <div className="relative z-10">
                  <h3 className="font-display font-bold text-white text-xl mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <m.span
                      key={period + plan.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display font-black text-4xl text-white"
                    >
                      {period === "project" ? plan.projectPrice : plan.monthlyPrice}
                    </m.span>
                    {plan.period && (
                      <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={plan.href}
                    variant={plan.featured ? "primary" : "secondary"}
                    className="w-full justify-center"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          All prices in INR. International clients billed in USD.{" "}
          <a href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">Contact us</a>{" "}
          for a custom quote.
        </p>
      </div>
    </section>
  );
}
