"use client";

import { Sparkles, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { EvaluationResult } from "@/lib/types";

export function AiTutor({
  result,
  userPrompt,
  onTryAgain,
}: {
  result: EvaluationResult;
  userPrompt: string;
  onTryAgain: () => void;
}) {
  return (
    <GlassCard className="p-6">
      <h3 className="flex items-center gap-2 font-display font-semibold mb-3">
        <Sparkles className="h-5 w-5 text-accent" />
        What would make your prompt better?
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-5">{result.tutorFeedback}</p>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div className="rounded-lg border border-border bg-bg-elevated p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-text-faint mb-1.5">Your prompt</p>
          <p className="text-sm font-mono text-text-muted leading-relaxed">{userPrompt || "(empty)"}</p>
        </div>
        <span className="hidden sm:block text-text-faint text-xs justify-self-center">vs.</span>
        <div className="rounded-lg border border-accent/30 bg-accent-soft p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-accent mb-1.5">Improved prompt</p>
          <p className="text-sm font-mono text-text leading-relaxed">{result.improvedPrompt}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="outline" onClick={onTryAgain}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </GlassCard>
  );
}
