"use client";
import dynamic from "next/dynamic";

const Lazy = dynamic(
  () => import("./HorizontalPortfolio").then((m) => ({ default: m.HorizontalPortfolio })),
  { ssr: false }
);

export function HorizontalPortfolioNoSSR() {
  return <Lazy />;
}
