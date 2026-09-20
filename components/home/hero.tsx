"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { motion } from "framer-motion";
import { ArrowRight, Sliders, Aperture, Focus, Eye, Sparkles, SlidersHorizontal, Terminal } from "lucide-react";
import { CHALLENGES } from "@/data/challenges";
import { Button } from "@/components/ui/button";

const heroChallenge = CHALLENGES.find((c) => c.id === "ridge-golden-hour")!;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-border">
      {/* Darkroom Reticle Texture Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Exhibition Masthead Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-10 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-bold text-text uppercase tracking-widest">PROMPTLENS // OPTICAL LAB</span>
            <span className="text-text-faint">· SER. 2026-PL09</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-text-faint hidden md:flex">
            <span>FOCAL: 35mm F/1.4</span>
            <span>SHUTTER: 1/1000s</span>
            <span>ISO: 100</span>
            <span className="text-accent font-bold">BENCHMARK ACCURACY: 87.4%</span>
          </div>
        </div>

        {/* Dramatic Full-Width Editorial Title */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent-soft px-3.5 py-1 text-xs font-mono text-accent mb-5 font-semibold uppercase tracking-wider"
          >
            <Aperture className="h-3.5 w-3.5" />
            <span>Interactive Prompt Benchmark</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.04] tracking-tight uppercase"
          >
            Can You Describe an Image <br className="hidden sm:inline" />
            <span className="text-accent underline decoration-accent/40 decoration-wavy underline-offset-8">
              Better Than AI?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed"
          >
            Reverse-engineer high-resolution AI diffusion renders. Write precise visual prompts that capture subject, lighting, perspective, and optical depth.
          </motion.p>
        </div>

        {/* Analog Darkroom Workstation Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border-2 border-border-strong bg-surface overflow-hidden shadow-2xl film-frame max-w-5xl mx-auto"
        >
          {/* Workstation Status Header */}
          <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-border bg-bg-elevated text-xs font-mono text-text-muted">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Focus className="h-4 w-4" /> AF-LOCK ACTIVE
              </span>
              <span className="text-text-faint">|</span>
              <span className="text-text font-semibold">EXHIBIT #27 · MOUNTAIN RIDGE</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-accent font-extrabold uppercase tracking-widest">EVALUATION MODE</span>
              <span className="rounded bg-surface-2 border border-border px-2 py-0.5 font-bold text-text">RAW 16-BIT</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-0">
            {/* Left Image Viewfinder Window */}
            <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto min-h-[340px] bg-black overflow-hidden viewfinder-corner border-r border-border">
              <Image
                src={heroChallenge.image}
                alt={heroChallenge.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Reticle Focus Overlay Marks */}
              <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-white/80 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/20">
                LENS: 35mm F/1.4 · ISO 100
              </div>
              <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-accent font-bold bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-accent/40">
                SCORE: 87 / 100
              </div>

              {/* Tag Chips */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 font-mono text-xs">
                <span className="bg-black/80 border border-accent/50 text-accent px-2.5 py-1 rounded backdrop-blur-md">
                  &ldquo;hiker in red jacket&rdquo;
                </span>
                <span className="bg-black/80 border border-emerald-500/50 text-emerald-400 px-2.5 py-1 rounded backdrop-blur-md">
                  &ldquo;golden hour ridge&rdquo;
                </span>
                <span className="bg-black/80 border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded backdrop-blur-md">
                  &ldquo;shallow depth of field&rdquo;
                </span>
              </div>
            </div>

            {/* Right Terminal Console & Controls */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-surface-2 border-l border-border">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                  <span className="font-mono text-xs font-bold text-text flex items-center gap-2 uppercase tracking-wider">
                    <Terminal className="h-4 w-4 text-accent" /> Prompt Construction Console
                  </span>
                  <span className="text-[10px] font-mono text-text-faint">LINE 01:04</span>
                </div>

                <div className="rounded-xl border border-border-strong bg-bg p-4 font-mono text-xs leading-relaxed text-text mb-6">
                  <p className="text-text-faint mb-2">// Type your prompt descriptor:</p>
                  <p className="text-text">
                    &ldquo;hiker wearing bright red windbreaker on high mountain ridge at sunset, dramatic cloud mist, 35mm prime photo&rdquo;
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Subject Match:</span>
                    <span className="text-emerald-400 font-bold">95%</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Scene & Lighting:</span>
                    <span className="text-accent font-bold">88%</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Camera Craft & Lens:</span>
                    <span className="text-amber-400 font-bold">82%</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/play" className="flex-1">
                  <Button size="lg" className="w-full">
                    <span>Start Challenge</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/events" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    <SlidersHorizontal className="h-4 w-4 text-accent" />
                    Group Lobby
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


