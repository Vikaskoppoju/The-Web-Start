import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "cyan" | "green" | "orange" | "gray";
  className?: string;
}

const variants = {
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  cyan:   "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  green:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  gray:   "bg-white/5 text-gray-400 border-white/10",
};

export function Badge({ children, variant = "purple", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
