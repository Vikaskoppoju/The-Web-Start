"use client";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  delay?: number;
}

export function GlassPanel({ children, className, hover = false, glow = false, animate = false, delay = 0 }: GlassPanelProps) {
  const base = cn(
    "glass rounded-2xl transition-all duration-300",
    hover && "hover:bg-white/[0.07] hover:border-purple-500/30 cursor-pointer",
    glow && "hover:shadow-glow-sm",
    className
  );

  if (animate) {
    return (
      <m.div
        className={base}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        whileHover={hover ? { scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } } : undefined}
      >
        {children}
      </m.div>
    );
  }

  return <div className={base}>{children}</div>;
}
