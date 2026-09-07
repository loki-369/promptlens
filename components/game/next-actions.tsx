"use client";

import { RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NextActions({
  onTryAgain,
  onNext,
}: {
  onTryAgain: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="font-display text-lg font-semibold">Can you beat your score?</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" variant="outline" onClick={onTryAgain}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button size="lg" onClick={onNext}>
          Next Challenge
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
