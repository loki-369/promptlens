"use client";

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";
import { GlassCard } from "@/components/ui/glass-card";
import type { EvaluationResult } from "@/lib/types";

function scoreVerdict(score: number) {
  if (score >= 90) return "Benchmark-level prompting 🏆";
  if (score >= 75) return "You nailed most of it 🎯";
  if (score >= 50) return "Solid start, room to grow 🌱";
  return "Let's break down what happened 🔍";
}

export function EvaluationReveal({ result }: { result: EvaluationResult }) {
  return (
    <GlassCard strong className="p-6 sm:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <ScoreRing score={result.overallScore} />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-3 font-display font-semibold text-lg"
        >
          {scoreVerdict(result.overallScore)}
        </motion.p>
        {result.hintPenalty > 0 && (
          <p className="text-xs text-amber-300 mt-1">Includes a −{result.hintPenalty} point hint penalty</p>
        )}
        <p className="text-sm text-accent font-semibold mt-1">+{result.xpEarned} XP</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        {result.dimensions.map((d, i) => (
          <ScoreBar key={d.key} label={d.label} score={d.score} weightPct={d.weightPct} delay={0.2 + i * 0.05} />
        ))}
      </div>
    </GlassCard>
  );
}
