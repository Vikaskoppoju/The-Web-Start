import { GradientText } from "./GradientText";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

// Server component — no JS needed for a static heading
export function SectionHeader({ eyebrow, title, titleHighlight, description, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", "animate-fade-in-up", className)}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">{eyebrow}</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
        </div>
      )}
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
        {title}{" "}
        {titleHighlight && <GradientText>{titleHighlight}</GradientText>}
      </h2>
      {description && (
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
