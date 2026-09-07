"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion } from "framer-motion";
import { Eye, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedChallenges } from "@/data/challenges";
import { DRIFT_OPTIONS, mergeStyles, pickDrift } from "@/lib/spot-diff";
import { useClientValue } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";

function setup() {
  const list = getPublishedChallenges();
  const challenge = list[Math.floor(Math.random() * list.length)];
  const drift = pickDrift(2 + Math.round(Math.random()));
  return { challenge, drift };
}

export function SpotScreen() {
  const [state, regenerate] = useClientValue(setup);
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  if (!state) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const toggle = (id: string) => {
    if (revealed) return;
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const reroll = () => {
    regenerate();
    setSelected([]);
    setRevealed(false);
  };

  const correctSet = new Set(state.drift);
  const correctPicks = selected.filter((s) => correctSet.has(s)).length;
  const wrongPicks = selected.filter((s) => !correctSet.has(s)).length;
  const score = revealed ? Math.max(0, Math.round(((correctPicks - wrongPicks * 0.5) / state.drift.length) * 100)) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted mb-4">
          <Eye className="h-3.5 w-3.5 text-accent" />
          Spot the Difference
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Same prompt, different render.</h1>
        <p className="text-text-muted max-w-lg mx-auto">
          The image on the right was &ldquo;regenerated&rdquo; from a similar prompt. Check every way it actually differs from the target.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <GlassCard strong className="overflow-hidden">
          <div className="relative aspect-square">
            <Image src={state.challenge.image} alt={state.challenge.imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <p className="p-3 text-center text-xs uppercase tracking-wide text-text-faint">Target image</p>
        </GlassCard>
        <GlassCard strong className="overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={state.challenge.image}
              alt={`${state.challenge.imageAlt} (regenerated variant)`}
              fill
              className="object-cover transition-all duration-500"
              style={mergeStyles(state.drift)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="p-3 text-center text-xs uppercase tracking-wide text-text-faint">Generated from your prompt</p>
        </GlassCard>
      </div>

      <GlassCard className="p-5 mb-6">
        <p className="text-sm font-semibold mb-3">What&apos;s different?</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {DRIFT_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const isCorrect = correctSet.has(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                disabled={revealed}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm text-left transition-colors",
                  !revealed && isSelected && "border-accent bg-accent-soft text-text",
                  !revealed && !isSelected && "border-border-strong text-text-muted hover:text-text",
                  revealed && isCorrect && "border-success bg-success-soft text-text",
                  revealed && !isCorrect && isSelected && "border-danger bg-danger-soft text-text",
                  revealed && !isCorrect && !isSelected && "border-border text-text-faint"
                )}
              >
                {opt.label}
                {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                {revealed && !isCorrect && isSelected && <XCircle className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex flex-col items-center gap-4">
        {!revealed ? (
          <Button size="lg" onClick={() => setRevealed(true)} disabled={selected.length === 0}>
            Reveal Differences
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="font-display text-2xl font-bold text-accent mb-1">{score}/100</p>
            <p className="text-sm text-text-muted mb-4">
              {correctPicks} of {state.drift.length} real differences found
              {wrongPicks > 0 ? `, ${wrongPicks} false positive${wrongPicks > 1 ? "s" : ""}` : ""}.
            </p>
            <Button variant="outline" onClick={reroll}>
              <RefreshCcw className="h-4 w-4" />
              New Comparison
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
