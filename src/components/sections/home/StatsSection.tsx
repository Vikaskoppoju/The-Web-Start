"use client";
import { m } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 50,  suffix: "+",  label: "Projects Delivered",      sub: "Across 10+ industries" },
  { value: 100, suffix: "%",  label: "Client Satisfaction",     sub: "5-star average rating" },
  { value: 5,   suffix: "+",  label: "Years Experience",        sub: "In digital products" },
  { value: 30,  suffix: "+",  label: "Happy Clients",           sub: "And counting" },
];

export function StatsSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Gradient border top/bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <m.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display font-black text-4xl sm:text-5xl mb-1">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  className="gradient-text"
                />
              </div>
              <div className="text-white font-semibold text-sm sm:text-base mb-1">{stat.label}</div>
              <div className="text-gray-600 text-xs">{stat.sub}</div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
