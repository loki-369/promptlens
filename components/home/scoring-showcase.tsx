"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ScoreBar } from "@/components/ui/score-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { CheckCircle2, XCircle } from "lucide-react";

const DIMENSIONS = [
  { label: "Prompt Accuracy", score: 92, weightPct: 20 },
  { label: "Visual Coverage", score: 88, weightPct: 15 },
  { label: "Composition", score: 81, weightPct: 15 },
  { label: "Style", score: 94, weightPct: 10 },
  { label: "Lighting", score: 90, weightPct: 10 },
  { label: "Specificity", score: 79, weightPct: 5 },
];

export function ScoringShowcase() {
  return (
    <section className="relative py-24 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">The evaluator</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-5">
            How good is your prompting?
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-lg">
            Write the prompt. Our evaluator analyzes it against the image&apos;s real attributes and shows
            you exactly what you captured — and what you missed. It rewards precision, not padding: a
            short, accurate prompt beats a long, vague one every time.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Semantic, not literal</p>
                <p className="text-xs text-text-muted mt-1">
                  &ldquo;warm sunset lighting&rdquo; scores like &ldquo;golden hour&rdquo; — meaning matters more than wording.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-danger mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">No credit for filler</p>
                <p className="text-xs text-text-muted mt-1">
                  Rambling, unrelated detail earns nothing — only what actually helps recreate the image counts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard strong className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreRing score={87} size={168} strokeWidth={11} label="" />
              <div className="w-full flex-1 space-y-4">
                {DIMENSIONS.map((d, i) => (
                  <ScoreBar key={d.label} label={d.label} score={d.score} delay={i * 0.08} />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
