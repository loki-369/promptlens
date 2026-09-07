"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { CHALLENGES } from "@/data/challenges";
import { Button } from "@/components/ui/button";

const heroChallenge = CHALLENGES.find((c) => c.id === "ridge-golden-hour")!;

const FRAGMENTS = [
  { text: "cinematic lighting", top: "8%", left: "-6%", delay: 0 },
  { text: "35mm lens", top: "68%", left: "-10%", delay: 0.6 },
  { text: "misty mountains", top: "82%", left: "58%", delay: 1.2 },
  { text: "golden hour", top: "4%", left: "62%", delay: 1.8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            9 live challenges · new ones weekly
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            Can You Describe an Image{" "}
            <span className="text-accent">Better Than AI?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mt-6 max-w-lg text-lg text-text-muted leading-relaxed"
          >
            See the image. Write the prompt. Beat the benchmark. PromptLens scores how
            precisely you can turn a picture back into the words that made it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/play">
              <Button size="lg" className="group">
                Start Challenge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="outline">
                <PlayCircle className="h-4 w-4" />
                How It Works
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="mt-10 flex items-center gap-6 text-sm text-text-faint"
          >
            <div>
              <span className="font-display text-2xl font-bold text-text">50K+</span>
              <p>prompts scored</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="font-display text-2xl font-bold text-text">16</span>
              <p>categories</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="font-display text-2xl font-bold text-text">3</span>
              <p>score categories</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {FRAGMENTS.map((f) => (
            <motion.div
              key={f.text}
              className="absolute z-20 hidden sm:block animate-float-slow"
              style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + f.delay }}
            >
              <span className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-mono text-accent shadow-sm whitespace-nowrap">
                &ldquo;{f.text}&rdquo;
              </span>
            </motion.div>
          ))}

          <div className="relative rounded-2xl border-2 border-border-strong overflow-hidden">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={heroChallenge.image}
                alt={heroChallenge.imageAlt}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute bottom-4 left-4 right-4 rounded-lg card-strong p-3.5"
            >
              <p className="text-[11px] uppercase tracking-wider text-text-faint mb-1">Your prompt</p>
              <p className="text-xs text-text-muted leading-snug line-clamp-2 font-mono">
                &ldquo;hiker in red jacket on mountain ridge, warm sunset lighting, shallow depth of field&rdquo;
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 -top-6 sm:-right-10 sm:top-6 z-30 flex flex-col items-center justify-center rounded-xl border-2 border-accent bg-surface p-5"
          >
            <span className="text-[10px] uppercase tracking-wider text-text-faint mb-1">Score</span>
            <span className="font-display text-4xl font-bold text-accent leading-none">87</span>
            <span className="text-xs text-text-faint mt-0.5">/ 100</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
