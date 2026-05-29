"use client";
import { m } from "framer-motion";
import { Heart, Lightbulb, Users, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const values = [
  { icon: Heart, title: "Client Obsession", desc: "Every decision starts with: what's best for the client? We treat your project like it's our own.", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Lightbulb, title: "Creative Problem-Solving", desc: "We don't follow templates. We think from first principles and design solutions that truly fit.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Users, title: "Radical Transparency", desc: "No jargon, no hiding. Clear timelines, honest estimates, and proactive communication.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Trophy, title: "Excellence Always", desc: "We set high standards and meet them. Good enough is never good enough for us.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export function ValuesSection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-glow-primary pointer-events-none" />
      <div className="container-custom relative">
        <SectionHeader eyebrow="Our Values" title="What Drives" titleHighlight="Us" className="mb-14" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <m.div key={v.title}
              className="glass rounded-2xl p-7 text-center hover:border-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${v.bg} mb-4`}>
                <v.icon className={`w-6 h-6 ${v.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
