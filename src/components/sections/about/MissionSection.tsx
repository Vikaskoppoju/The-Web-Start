"use client";
import { m } from "framer-motion";
import { GradientText } from "@/components/ui/GradientText";

export function MissionSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <m.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Our Mission</span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Making Digital
              <br /><GradientText>Excellence</GradientText> Accessible
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              We started The Web Start because we saw too many businesses stuck with mediocre digital products.
              Our mission is to give every client — from startups to enterprises — access to the same quality
              of work that was once reserved for Fortune 500 companies.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Based in India, working globally. We&apos;re a remote-first studio that moves fast, communicates
              clearly, and delivers work you&apos;ll be proud to show off.
            </p>
          </m.div>

          <m.div
            className="glass rounded-3xl p-8 border border-purple-500/20 space-y-6"
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            {[
              { year: "2020", event: "The Web Start founded in Bangalore" },
              { year: "2021", event: "First 10 international clients onboarded" },
              { year: "2022", event: "Expanded to design, SEO & marketing services" },
              { year: "2023", event: "50+ projects delivered, team grew to 8" },
              { year: "2024", event: "Launched retainer & growth programmes" },
              { year: "2025", event: "Now serving clients across 12 countries" },
            ].map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
                  {i < 5 && <div className="w-px flex-1 bg-purple-500/20 mt-2" />}
                </div>
                <div className="pb-2">
                  <span className="text-purple-400 text-xs font-bold tracking-wider">{item.year}</span>
                  <p className="text-gray-300 text-sm mt-0.5">{item.event}</p>
                </div>
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}
