"use client";

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";
import type { EvaluationResult } from "@/lib/types";

function scoreVerdict(score: number) {
  if (score >= 90) return "Master-level precision prompt 🏆";
  if (score >= 75) return "Solid visual concept match 🎯";
  if (score >= 50) return "Good start, room for craft 🌱";
  return "Let's inspect what was missed 🔍";
}

export function EvaluationReveal({ result }: { result: EvaluationResult }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-md">
      <div className="flex flex-col items-center text-center mb-8">
        <ScoreRing score={result.overallScore} />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 font-display font-bold text-xl"
        >
          {scoreVerdict(result.overallScore)}
        </motion.p>
        {result.hintPenalty > 0 && (
          <p className="text-xs font-mono text-amber-400 mt-1">Includes −{result.hintPenalty} pt hint penalty</p>
        )}
        <p className="text-xs font-mono text-accent font-bold tracking-wider mt-1.5 uppercase">+{result.xpEarned} XP EARNED</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 pt-6 border-t border-border">
        {result.dimensions.map((d, i) => (
          <ScoreBar key={d.key} label={d.label} score={d.score} weightPct={d.weightPct} delay={0.2 + i * 0.05} />
        ))}
      </div>
    </div>
  );
}

