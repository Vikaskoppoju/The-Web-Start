"use client";
import { m } from "framer-motion";
import { Zap, Shield, Clock, HeartHandshake, BarChart3, Layers } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    desc: "We move fast without cutting corners. Agile processes and clear milestones keep every project on track.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "Every deliverable goes through rigorous QA. We don't ship until it's production-ready.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "On-Time, Every Time",
    desc: "We respect your time. Deadlines are commitments, not suggestions — and we meet them.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: HeartHandshake,
    title: "Client-First Approach",
    desc: "Transparent communication, honest timelines, and zero hidden costs. Your success is our success.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "Results-Driven",
    desc: "We measure everything. Every decision is backed by data and aligned to your business goals.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Layers,
    title: "Full-Service Studio",
    desc: "Design, development, marketing — one team, zero friction. Your one-stop digital partner.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export function WhyUsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-glow-cyan pointer-events-none" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <SectionHeader
              eyebrow="Why Choose Us"
              title="The Agency That"
              titleHighlight="Delivers"
              description="We combine technical excellence with creative thinking to build digital products that stand out — and stand the test of time."
              centered={false}
              className="mb-10"
            />

            {/* Big stat */}
            <div className="glass rounded-2xl p-6 border border-purple-500/20 inline-block">
              <div className="text-5xl font-display font-black gradient-text mb-1">98%</div>
              <div className="text-white font-semibold text-sm">Client Retention Rate</div>
              <div className="text-gray-500 text-xs mt-1">Clients come back and refer others</div>
            </div>
          </div>

          {/* Right — Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <m.div
                key={feat.title}
                className="glass rounded-xl p-5 hover:border-white/15 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${feat.bg} group-hover:scale-110 transition-transform duration-200`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{feat.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feat.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
