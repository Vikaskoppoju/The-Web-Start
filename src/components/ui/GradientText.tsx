import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "purple-cyan" | "brand" | "cyan-only";
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

const gradients = {
  "purple-cyan": "gradient-text",
  "brand": "gradient-text-brand",
  "cyan-only": "",
};

export function GradientText({ children, className, variant = "purple-cyan", as: Tag = "span" }: GradientTextProps) {
  return (
    <Tag className={cn(gradients[variant], className)}>
      {children}
    </Tag>
  );
}
