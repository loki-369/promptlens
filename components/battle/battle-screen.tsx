"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, RefreshCcw, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedChallenges } from "@/data/challenges";
import { generateBattlePair, type BattlePair } from "@/lib/battle";
import { comparePrompts } from "@/lib/scoring";
import { useClientValue } from "@/lib/use-client-value";

function pickPair(): BattlePair {
  const list = getPublishedChallenges();
  const challenge = list[Math.floor(Math.random() * list.length)];
  return generateBattlePair(challenge);
}

export function BattleScreen() {
  const [pair, regeneratePair] = useClientValue(pickPair);
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [round, setRound] = useState(1);

  if (!pair) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const { resultA, resultB, winner, onlyA, onlyB } = comparePrompts(pair.challenge, pair.left.prompt, pair.right.prompt);
  const correct = choice && ((choice === "A" && winner === "A") || (choice === "B" && winner === "B"));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted mb-4">
          <Swords className="h-3.5 w-3.5 text-accent" />
          Prompt Battle · Round {round}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Which prompt is better?</h1>
        <p className="text-text-muted">Same image, two prompts. Pick the one that could actually recreate it.</p>
      </div>

      <GlassCard strong className="overflow-hidden mb-6">
        <div className="relative aspect-video">
          <Image src={pair.challenge.image} alt={pair.challenge.imageAlt} fill className="object-cover" sizes="100vw" />
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[pair.left, pair.right].map((side) => {
          const isChosen = choice === side.label;
          const isWinner = choice && winner === side.label;
          return (
            <button
              key={side.label}
              disabled={!!choice}
              onClick={() => setChoice(side.label)}
              className="text-left"
            >
              <GlassCard
                className={`p-5 h-full transition-colors ${
                  choice
                    ? isWinner
                      ? "border-success ring-1 ring-success/30"
                      : isChosen
                        ? "border-danger"
                        : "opacity-60"
                    : "hover:border-accent cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg">Prompt {side.label}</span>
                  {choice && isWinner && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-4 w-4" /> Stronger
                    </span>
                  )}
                  {choice && !isWinner && (
                    <span className="text-xs font-semibold text-text-faint">
                      {side.label === "A" ? resultA.overallScore : resultB.overallScore}/100
                    </span>
                  )}
                </div>
                <p className="text-sm font-mono text-text-muted leading-relaxed">{side.prompt}</p>
              </GlassCard>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {choice && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6 mb-6">
              <h3 className="font-display font-semibold mb-2">
                {correct ? "Correct — you spotted the stronger prompt." : "Not quite — here's why the other one wins."}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                Prompt A scored <span className="text-text font-semibold">{resultA.overallScore}</span>/100, Prompt B scored{" "}
                <span className="text-text font-semibold">{resultB.overallScore}</span>/100.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-faint text-xs uppercase tracking-wide mb-2">Only in A</p>
                  <ul className="space-y-1 text-text-muted">
                    {onlyA.slice(0, 5).map((m) => (
                      <li key={m.concept.id}>• {m.concept.label}</li>
                    ))}
                    {onlyA.length === 0 && <li className="text-text-faint">—</li>}
                  </ul>
                </div>
                <div>
                  <p className="text-text-faint text-xs uppercase tracking-wide mb-2">Only in B</p>
                  <ul className="space-y-1 text-text-muted">
                    {onlyB.slice(0, 5).map((m) => (
                      <li key={m.concept.id}>• {m.concept.label}</li>
                    ))}
                    {onlyB.length === 0 && <li className="text-text-faint">—</li>}
                  </ul>
                </div>
              </div>
            </GlassCard>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => {
                  setChoice(null);
                  setRound((r) => r + 1);
                  regeneratePair();
                }}
              >
                <RefreshCcw className="h-4 w-4" />
                Next Battle
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
