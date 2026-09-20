"use client";

import { motion } from "framer-motion";
import { Eye, PenTool, Gauge, Sparkles, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const STEPS = [
  {
    icon: Eye,
    title: "1. Inspect the Image",
    body: "An uncaptioned AI-generated image loads with zero metadata — no prompt, no tags, no hints.",
    codeTag: "RETICLE_SCAN",
  },
  {
    icon: PenTool,
    title: "2. Reverse-Engineer",
    body: "Identify subject features, environment lighting, composition lines, and photography camera settings.",
    codeTag: "SEMANTIC_DECODE",
  },
  {
    icon: Gauge,
    title: "3. Score vs. Ground Truth",
    body: "Our evaluation engine scores your prompt across 3 dimensions: Subject, Scene & Style, and Craft Details.",
    codeTag: "EVAL_BENCHMARK",
  },
  {
    icon: Sparkles,
    title: "4. Master Prompt Craft",
    body: "Examine what you nailed, what you missed, and receive a stronger prompt rewrite with tutor insights.",
    codeTag: "MASTERY_REWRITE",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 border-t border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">
            <Aperture className="h-3.5 w-3.5" /> Methodology & Evaluation
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            How PromptLens Benchmark Works
          </h2>
          <p className="mt-4 text-text-muted text-base leading-relaxed">
            Anyone can give a vague description of a photo. Can you write a prompt precise enough for a generative model to reproduce it? That gap is what PromptLens measures and trains.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="p-7 h-full relative overflow-hidden group hover:border-accent/60 transition-all duration-300 shadow-md">
                <div className="absolute -right-4 -top-4 text-7xl font-mono font-extrabold text-text/[0.04] select-none">
                  0{i + 1}
                </div>
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 border border-border-strong text-accent shadow-sm group-hover:scale-105 transition-transform">
                      <step.icon className="h-5 w-5 stroke-[2]" />
                    </div>
                    <span className="text-[9px] font-mono text-text-faint px-2 py-0.5 rounded border border-border bg-bg/50">
                      {step.codeTag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg mb-2.5 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
