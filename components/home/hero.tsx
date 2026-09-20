"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion } from "framer-motion";
import { ArrowRight, Sliders, Aperture, Focus } from "lucide-react";
import { CHALLENGES } from "@/data/challenges";
import { Button } from "@/components/ui/button";

const heroChallenge = CHALLENGES.find((c) => c.id === "ridge-golden-hour")!;

const FRAGMENTS = [
  { text: "cinematic lighting", top: "8%", left: "-5%", delay: 0 },
  { text: "35mm prime lens", top: "68%", left: "-8%", delay: 0.6 },
  { text: "snow peaks & mist", top: "84%", left: "50%", delay: 1.2 },
  { text: "golden hour glow", top: "4%", left: "60%", delay: 1.8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Editorial Grid Line Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent-soft px-3.5 py-1 text-xs font-mono text-accent mb-6 font-semibold"
          >
            <Aperture className="h-3.5 w-3.5" />
            <span>EXHIBITION BENCHMARK · V3.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight"
          >
            Can You Describe an Image{" "}
            <span className="text-accent underline decoration-accent/40 underline-offset-8">
              Better Than AI?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-text-muted leading-relaxed"
          >
            Inspect AI-generated images, write precision prompts, and evaluate your descriptor accuracy against diffusion model benchmarks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <Link href="/play">
              <Button size="lg" className="group">
                <span>Start Challenge</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline">
                <Sliders className="h-4 w-4 text-accent" />
                Group Event Mode
              </Button>
            </Link>
          </motion.div>

          {/* Stats Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-md pt-8 border-t border-border"
          >
            <div>
              <span className="font-display text-2xl font-bold text-text font-mono">50K+</span>
              <p className="text-[11px] font-mono text-text-faint uppercase tracking-wider mt-0.5">Scored</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-text font-mono">16</span>
              <p className="text-[11px] font-mono text-text-faint uppercase tracking-wider mt-0.5">Categories</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-accent font-mono">100%</span>
              <p className="text-[11px] font-mono text-text-faint uppercase tracking-wider mt-0.5">Accuracy</p>
            </div>
          </motion.div>
        </div>

        {/* Right Interactive Viewfinder Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          {FRAGMENTS.map((f) => (
            <motion.div
              key={f.text}
              className="absolute z-20 hidden sm:block animate-float-slow"
              style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + f.delay }}
            >
              <span className="rounded-md border border-accent/40 bg-surface/95 px-3 py-1.5 text-xs font-mono text-accent shadow-md whitespace-nowrap">
                &ldquo;{f.text}&rdquo;
              </span>
            </motion.div>
          ))}

          {/* Studio Frame Container */}
          <div className="relative rounded-xl border border-border-strong bg-surface overflow-hidden viewfinder-corner shadow-2xl">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-2 text-[10px] font-mono text-text-muted">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Focus className="h-3 w-3" /> AF-LOCK
              </span>
              <span>35mm · f/1.4 · ISO 100</span>
              <span className="text-accent font-bold">EXHIBIT #27</span>
            </div>

            <div className="relative aspect-[4/5] w-full bg-black">
              <Image
                src={heroChallenge.image}
                alt={heroChallenge.imageAlt}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Prompt Guessed Banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute bottom-4 left-4 right-4 rounded-lg border border-border-strong bg-surface/95 p-3.5 shadow-lg"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-faint mb-1">
                Your Prompt Output
              </p>
              <p className="text-xs text-text leading-snug line-clamp-2 font-mono">
                &ldquo;hiker in red jacket on mountain ridge, warm sunset lighting, shallow depth of field&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Score Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="absolute -right-3 -top-5 sm:-right-6 sm:top-5 z-30 flex flex-col items-center justify-center rounded-xl border border-accent bg-surface p-4 shadow-2xl"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Score</span>
            <span className="font-display text-4xl font-extrabold text-accent leading-none font-mono">87</span>
            <span className="text-[10px] text-text-faint font-mono mt-1">/ 100</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

