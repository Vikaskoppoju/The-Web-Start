"use client";
import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;      // max degrees
  glareOpacity?: number; // 0–1
  scale?: number;        // hover scale
}

export function TiltCard({
  children,
  className,
  maxTilt = 12,
  glareOpacity = 0.15,
  scale = 1.04,
}: TiltCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const tiltX  = (-dy / (rect.height / 2)) * maxTilt;
    const tiltY  = ( dx / (rect.width  / 2)) * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
    card.style.transition = "transform 0.05s ease-out";

    // Glare position
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 65%)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    glare.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare overlay */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-10 rounded-[inherit] transition-all duration-150"
      />
      {children}
    </div>
  );
}
