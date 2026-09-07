"use client";

import { motion } from "framer-motion";

function colorFor(score: number) {
  if (score >= 85) return "var(--success)";
  if (score >= 60) return "var(--accent)";
  return "var(--danger)";
}

export function ScoreBar({
  label,
  score,
  weightPct,
  delay = 0,
}: {
  label: string;
  score: number;
  weightPct?: number;
  delay?: number;
}) {
  const color = colorFor(score);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-text-muted">
          {label}
          {weightPct !== undefined && <span className="text-text-faint text-xs"> · {weightPct}%</span>}
        </span>
        <span className="text-sm font-semibold tabular-nums" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}
