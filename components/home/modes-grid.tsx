"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Calendar, Users, ArrowUpRight, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const MODES = [
  {
    icon: Camera,
    title: "Guess the Prompt",
    desc: "Inspect AI images, deduce the ground-truth concepts, and score on Subject, Scene & Camera Details.",
    href: "/play",
    tag: "Solo Practice",
    tagColor: "border-accent/40 bg-accent-soft text-accent",
  },
  {
    icon: Calendar,
    title: "Daily Benchmark",
    desc: "One global image challenge per day. Single attempt, shared global leaderboard.",
    href: "/daily",
    tag: "Daily Event",
    tagColor: "border-warning/40 bg-warning-soft text-warning",
  },
  {
    icon: Users,
    title: "Group Competitions",
    desc: "Host private rooms for workshops, team events, or hackathons with live sync & CSV export.",
    href: "/events",
    tag: "Multiplayer",
    tagColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  },
];

export function ModesGrid() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">
              <Aperture className="h-3.5 w-3.5" /> Modes & Formats
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Three Ways to Train Your Eye
            </h2>
          </div>
          <Link href="/modes" className="text-xs font-mono font-bold text-accent hover:text-accent-strong inline-flex items-center gap-1">
            EXPLORE ALL FORMATS <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={mode.href} className="block h-full group">
                <GlassCard className="p-7 h-full relative overflow-hidden hover:border-accent/60 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                  <div className="relative flex items-start justify-between mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border-strong text-accent shadow-sm group-hover:scale-105 transition-transform">
                      <mode.icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${mode.tagColor}`}>
                      {mode.tag}
                    </span>
                  </div>

                  <h3 className="relative font-display font-bold text-xl mb-2.5 group-hover:text-accent transition-colors">
                    {mode.title}
                  </h3>
                  <p className="relative text-xs text-text-muted leading-relaxed">
                    {mode.desc}
                  </p>

                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-text-faint group-hover:text-accent transition-colors">
                    <span>Enter Format</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
