"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sliders, Aperture, Focus } from "lucide-react";
import { CHALLENGES } from "@/data/challenges";
import { Button } from "@/components/ui/button";

const heroChallenge = CHALLENGES.find((c) => c.id === "ridge-golden-hour")!;

const FRAGMENTS = [
  { text: "cinematic lighting", top: "10%", left: "-6%", delay: 0 },
  { text: "35mm prime lens", top: "65%", left: "-10%", delay: 0.6 },
  { text: "snow peaks & mist", top: "82%", left: "54%", delay: 1.2 },
  { text: "golden hour glow", top: "6%", left: "62%", delay: 1.8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background Reticle Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/40 px-4 py-1.5 text-xs font-mono text-accent mb-6 shadow-sm"
          >
            <Aperture className="h-3.5 w-3.5" />
            <span>FOCAL BENCHMARK v2.4 · 9 ACTIVE LENSES</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
          >
            Train Your Eye.{" "}
            <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">
              Master the Prompt.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-lg text-base sm:text-lg text-text-muted leading-relaxed"
          >
            Inspect AI-generated images, reverse-engineer their visual concepts, and write high-scoring prompts that match subject, scene, and camera craft.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/play">
              <Button size="lg" className="group shadow-lg shadow-accent/20">
                <span>Start Lens Challenge</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="border-border-strong bg-surface">
                <Sliders className="h-4 w-4 text-accent" />
                Group Event Mode
              </Button>
            </Link>
          </motion.div>

          {/* Stats Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex items-center gap-6 text-xs text-text-muted font-mono"
          >
            <div>
              <span className="font-display text-2xl font-extrabold text-text font-mono">50K+</span>
              <p className="text-[11px] text-text-faint mt-0.5">prompts scored</p>
            </div>
            <div className="h-8 w-px bg-border-strong" />
            <div>
              <span className="font-display text-2xl font-extrabold text-text font-mono">16</span>
              <p className="text-[11px] text-text-faint mt-0.5">categories</p>
            </div>
            <div className="h-8 w-px bg-border-strong" />
            <div>
              <span className="font-display text-2xl font-extrabold text-accent font-mono">100%</span>
              <p className="text-[11px] text-text-faint mt-0.5">semantic match</p>
            </div>
          </motion.div>
        </div>

        {/* Right Interactive Viewfinder Mock */}
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
              <span className="rounded-md border border-accent/40 bg-surface/90 backdrop-blur-md px-3 py-1.5 text-xs font-mono text-accent shadow-md whitespace-nowrap">
                &ldquo;{f.text}&rdquo;
              </span>
            </motion.div>
          ))}

          {/* Viewfinder Frame Container */}
          <div className="relative rounded-2xl border-2 border-border-strong bg-surface overflow-hidden viewfinder-corner shadow-2xl">
            {/* Viewfinder Header Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg/80 backdrop-blur-md text-[10px] font-mono text-text-muted">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Focus className="h-3 w-3" /> AF-LOCK
              </span>
              <span>35mm · f/1.4 · ISO 100</span>
              <span className="text-accent font-bold">LENS #27</span>
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

            {/* Prompt Preview Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute bottom-4 left-4 right-4 rounded-xl border border-border-strong bg-surface/90 backdrop-blur-md p-3.5 shadow-lg"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-faint mb-1">
                Guessed Prompt
              </p>
              <p className="text-xs text-text leading-snug line-clamp-2 font-mono">
                &ldquo;hiker in red jacket on mountain ridge, warm sunset lighting, shallow depth of field&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Score Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 -top-6 sm:-right-8 sm:top-6 z-30 flex flex-col items-center justify-center rounded-2xl border-2 border-accent bg-surface p-4.5 shadow-xl backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-0.5">Overall</span>
            <span className="font-display text-4xl font-extrabold text-accent leading-none font-mono">87</span>
            <span className="text-[10px] text-text-faint font-mono mt-1">/ 100 PTS</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
