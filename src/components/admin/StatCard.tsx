"use client";
import { m } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  accentColor?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, trend, accentColor = "#7c3aed", delay = 0 }: Props) {
  const isPositive = (trend?.value ?? 0) >= 0;
  return (
    <m.div
      className="glass rounded-2xl p-6 border border-white/[0.07] hover:border-white/15 transition-all duration-300 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Corner glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
           style={{ background: accentColor }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: accentColor + "20", color: accentColor }}>
          {icon}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="font-display font-black text-3xl text-white mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{title}</div>
      {trend && <div className="text-gray-700 text-xs mt-1">{trend.label}</div>}
    </m.div>
  );
}
