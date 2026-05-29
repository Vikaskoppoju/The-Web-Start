"use client";
import { m } from "framer-motion";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size    = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "text-white font-semibold shadow-glow-sm hover:shadow-glow-md active:scale-[0.98]",
  secondary:
    "text-purple-300 border border-purple-500/40 glass hover:border-purple-400/60 hover:bg-purple-500/10",
  ghost:
    "text-gray-400 hover:text-white hover:bg-white/5",
  outline:
    "text-white border border-white/20 hover:border-white/40 hover:bg-white/5",
  danger:
    "text-white bg-red-600 hover:bg-red-500 shadow-lg",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-2.5",
  xl: "px-10 py-5 text-lg rounded-2xl gap-3",
};

const MotionButton = m.button;
const MotionA      = m.a;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", href, external, loading, icon, iconRight, children, className, disabled, ...props }, ref) => {
    const base = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const style = variant === "primary"
      ? { background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)" }
      : undefined;

    const motionProps = {
      whileHover: disabled || loading ? undefined : { scale: 1.02 },
      whileTap:   disabled || loading ? undefined : { scale: 0.97 },
      transition: { type: "spring" as const, stiffness: 400, damping: 20 },
    };

    const content = (
      <>
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
        {children}
        {iconRight}
      </>
    );

    if (href && !disabled) {
      if (external) {
        return (
          <MotionA
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={base}
            style={style}
            {...motionProps}
          >
            {content}
          </MotionA>
        );
      }
      return (
        <Link href={href} className={base} style={style}>
          {content}
        </Link>
      );
    }

    // Destructure to avoid spreading conflicting event types (onDrag etc.) into MotionButton
    const { onDrag, onDragEnd, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onAnimationStart, onAnimationEnd, onAnimationIteration, ...safeProps } = props;
    void onDrag; void onDragEnd; void onDragStart; void onDragEnter; void onDragLeave; void onDragOver; void onDrop; void onAnimationStart; void onAnimationEnd; void onAnimationIteration;

    return (
      <MotionButton
        ref={ref}
        className={base}
        style={style}
        disabled={disabled || loading}
        {...motionProps}
        {...safeProps}
      >
        {content}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";
