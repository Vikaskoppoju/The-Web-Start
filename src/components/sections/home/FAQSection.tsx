"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Timelines vary by scope. A standard marketing site takes 2–4 weeks, a custom web app 6–12 weeks, and a WordPress store 3–6 weeks. We provide a detailed timeline in your project proposal.",
  },
  {
    q: "Do you work with international clients?",
    a: "Absolutely. We work with clients across India, the UK, UAE, US, and beyond. All communication is in English and we accommodate different time zones for meetings.",
  },
  {
    q: "What is included in your SEO service?",
    a: "Our SEO service covers technical audits, keyword research and mapping, on-page optimisation, content strategy, link building outreach, and monthly reporting. We focus on sustainable organic growth.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes — redesigns are one of our specialities. We analyse your existing site's strengths and weaknesses, then deliver a modern, high-performance upgrade while preserving SEO equity.",
  },
  {
    q: "Do you offer post-launch support?",
    a: "Every project includes at least one month of post-launch support. We also offer ongoing retainer plans covering updates, monitoring, performance tuning, and new feature development.",
  },
  {
    q: "How do payments work?",
    a: "We typically follow a 50% upfront, 50% on completion model for projects. Retainer clients are billed monthly in advance. We accept bank transfers, UPI, Razorpay, and international wire transfers.",
  },
  {
    q: "Will I own the source code and all assets?",
    a: "Yes, 100%. Upon final payment, all source code, design files, databases, and assets are transferred to you. There are no licensing fees or vendor lock-in.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding" id="faq">
      <div className="container-custom">
        <SectionHeader
          eyebrow="FAQ"
          title="Common"
          titleHighlight="Questions"
          description="Everything you need to know before we get started."
          className="mb-14"
        />

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${open === i ? "border-purple-500/40" : "border-white/[0.07] hover:border-white/15"}`}>
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className={`font-medium text-sm transition-colors ${open === i ? "text-white" : "text-gray-300"}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${open === i ? "bg-purple-500/30 text-purple-300" : "bg-white/5 text-gray-500"}`}>
                    {open === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-white/[0.05] pt-3">
                        {faq.a}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
