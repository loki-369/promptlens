"use client";

import { motion } from "framer-motion";
import { Eye, PenLine, Gauge, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const STEPS = [
  {
    icon: Eye,
    title: "See the image",
    body: "A striking AI-generated image loads with zero metadata — no prompt, no tags, no hints.",
  },
  {
    icon: PenLine,
    title: "Write the prompt",
    body: "Describe what's in it, the scene and style, and the small details — like you're telling an AI what to draw.",
  },
  {
    icon: Gauge,
    title: "Get scored instantly",
    body: "We check your words against the image across 3 simple categories: Subject, Scene & Style, and Details.",
  },
  {
    icon: Sparkles,
    title: "Learn & improve",
    body: "See the real prompt, what you nailed, what you missed, and a stronger rewrite.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">The loop</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Your imagination vs. the image
          </h2>
          <p className="mt-4 text-text-muted text-lg leading-relaxed">
            Anyone can describe a picture. Can you describe it well enough for an AI to recreate it?
            That gap — between vague and precise — is exactly what PromptLens trains.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="p-6 h-full relative overflow-hidden group hover:border-accent transition-colors">
                <div className="absolute -right-6 -top-6 text-7xl font-display font-bold text-text/[0.04] select-none">
                  {i + 1}
                </div>
                <div className="relative">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft border border-border">
                    <step.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
