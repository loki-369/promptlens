"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ScoreBar } from "@/components/ui/score-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { CheckCircle2, XCircle, Aperture } from "lucide-react";

const DIMENSIONS = [
  { label: "Subject Accuracy", score: 92, weightPct: 50 },
  { label: "Scene & Environment", score: 88, weightPct: 30 },
  { label: "Camera & Craft Details", score: 81, weightPct: 20 },
];

export function ScoringShowcase() {
  return (
    <section className="relative py-24 border-t border-border/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">
            <Aperture className="h-3.5 w-3.5" /> Evaluator Engine
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            Precision Scoring, Zero Fluff
          </h2>
          <p className="text-text-muted text-base leading-relaxed mb-8 max-w-lg">
            Write your prompt. Our evaluator checks it against ground-truth concepts and gives instant feedback on Subject, Scene & Style, and Camera Details. Precision is rewarded — short, accurate prompts outperform long, vague ones.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Semantic Concept Hits</p>
                <p className="text-xs text-text-muted mt-1 leading-normal font-mono">
                  &ldquo;warm sunset light&rdquo; matches &ldquo;golden hour&rdquo; — meaning counts over exact phrasing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm">No Padding Rewards</p>
                <p className="text-xs text-text-muted mt-1 leading-normal font-mono">
                  Irrelevant text and word padding receive zero credit, encouraging tight prompt discipline.
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
          <GlassCard strong className="p-6 sm:p-8 border-accent/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="text-center">
                <ScoreRing score={87} size={150} strokeWidth={10} label="" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mt-2">
                  COMPOSITE SCORE
                </span>
              </div>
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
