"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { ArrowRight } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Something went wrong</p>
        <h1 className="font-display font-black text-6xl sm:text-8xl text-white mb-4">
          <GradientText>Error.</GradientText>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="secondary">Try Again</Button>
          <Button href="/" iconRight={<ArrowRight className="w-4 h-4" />}>Home</Button>
        </div>
      </div>
    </main>
  );
}
