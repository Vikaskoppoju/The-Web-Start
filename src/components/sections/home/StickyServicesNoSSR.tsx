"use client";
import dynamic from "next/dynamic";

const Lazy = dynamic(
  () => import("./StickyServices").then((m) => ({ default: m.StickyServices })),
  { ssr: false }
);

export function StickyServicesNoSSR() {
  return <Lazy />;
}
