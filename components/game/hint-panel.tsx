"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Lock } from "lucide-react";
import type { HintDef } from "@/lib/types";

export function HintPanel({
  hints,
  revealedCount,
  onReveal,
}: {
  hints: HintDef[];
  revealedCount: number;
  onReveal: (index: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border-strong bg-surface/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-warning" />
        <span className="text-sm font-semibold">Hints</span>
        <span className="text-xs text-text-faint">— each one costs points off your max score</span>
      </div>
      <div className="space-y-2">
        {hints.map((hint, i) => {
          const revealed = i < revealedCount;
          const locked = i > revealedCount;
          return (
            <div key={i} className="rounded-lg border border-border bg-bg-elevated/60 p-3">
              <AnimatePresence mode="wait">
                {revealed ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-xs font-semibold text-warning shrink-0">−{hint.cost}pts</span>
                    <p className="text-sm text-text-muted">{hint.text}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm text-text-faint">
                      Hint {i + 1} <span className="font-semibold text-warning">(−{hint.cost} points)</span>
                    </span>
                    <button
                      onClick={() => onReveal(i)}
                      disabled={locked}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1 text-xs font-medium text-text-muted hover:text-text hover:border-warning disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {locked && <Lock className="h-3 w-3" />}
                      Reveal
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
