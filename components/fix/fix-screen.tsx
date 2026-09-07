"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Sparkles, RefreshCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EvaluationReveal } from "@/components/game/evaluation-reveal";
import { ConceptLists } from "@/components/game/concept-lists";
import { getPublishedChallenges } from "@/data/challenges";
import { evaluatePrompt } from "@/lib/scoring";
import { useClientValue } from "@/lib/use-client-value";
import type { Challenge, EvaluationResult } from "@/lib/types";

function pickSeed(): { challenge: Challenge; baseline: EvaluationResult } {
  const list = getPublishedChallenges().filter((c) => c.badPrompt);
  const challenge = list[Math.floor(Math.random() * list.length)];
  return { challenge, baseline: evaluatePrompt(challenge, challenge.badPrompt ?? "", 0) };
}

export function FixScreen() {
  const [seed, reroll] = useClientValue(pickSeed);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [syncedChallengeId, setSyncedChallengeId] = useState<string | null>(null);

  // Reset the editable draft whenever a new challenge is picked. This runs
  // during render (React's documented "adjusting state" pattern) rather
  // than in an effect, so it never causes an extra commit.
  if (seed && seed.challenge.id !== syncedChallengeId) {
    setSyncedChallengeId(seed.challenge.id);
    setDraft(seed.challenge.badPrompt ?? "");
    setResult(null);
  }

  if (!seed) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const { challenge, baseline } = seed;

  const handleSubmit = () => {
    setResult(evaluatePrompt(challenge, draft, 0));
  };

  const delta = result ? result.overallScore - baseline.overallScore : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted mb-4">
          <Wrench className="h-3.5 w-3.5 text-accent" />
          Fix the Prompt
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">This prompt is lazy. Make it work.</h1>
        <p className="text-text-muted">Rewrite it so it could actually recreate the image below.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <GlassCard strong className="overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image src={challenge.image} alt={challenge.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="p-4">
            <p className="text-[11px] uppercase tracking-wide text-text-faint mb-1.5">Original weak prompt</p>
            <p className="text-sm font-mono text-danger">&ldquo;{challenge.badPrompt}&rdquo;</p>
            <p className="text-xs text-text-faint mt-1.5">Scored {baseline.overallScore}/100</p>
          </div>
        </GlassCard>

        <GlassCard strong className="p-5 flex flex-col">
          <label className="text-sm font-semibold mb-2">Your rewrite</label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full flex-1 min-h-[220px] resize-none rounded-lg border border-border-strong bg-bg-elevated p-4 text-sm leading-relaxed font-mono text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
          <Button className="mt-4" onClick={handleSubmit} disabled={draft.trim().length === 0}>
            <Sparkles className="h-4 w-4" />
            Score My Fix
          </Button>
        </GlassCard>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col gap-6">
            <GlassCard className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-muted">Before: {baseline.overallScore} → After: <span className="text-text font-semibold">{result.overallScore}</span></p>
                <p className={`text-2xl font-display font-bold ${delta >= 0 ? "text-success" : "text-danger"}`}>
                  {delta >= 0 ? "+" : ""}{delta} points
                </p>
              </div>
              <Button variant="outline" onClick={() => reroll()}>
                <RefreshCcw className="h-4 w-4" />
                Try Another
              </Button>
            </GlassCard>
            <EvaluationReveal result={result} />
            <ConceptLists result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
