"use client";
import { useInView as useFramerInView } from "framer-motion";
import { useRef } from "react";

export function useInView(options?: { once?: boolean; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useFramerInView(ref, {
    once: options?.once ?? true,
  });
  return { ref, isInView };
}
