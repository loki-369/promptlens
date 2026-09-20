"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Calendar, Users, ArrowUpRight, Aperture } from "lucide-react";

const MODES = [
  {
    num: "01",
    icon: Camera,
    title: "Guess the Prompt",
    desc: "Inspect AI images, deduce the ground-truth concepts, and score on Subject, Scene & Camera Details.",
    href: "/play",
    tag: "Solo Practice",
  },
  {
    num: "02",
    icon: Calendar,
    title: "Daily Benchmark",
    desc: "One global image challenge per day. Single attempt, shared global leaderboard.",
    href: "/daily",
    tag: "Daily Event",
  },
  {
    num: "03",
    icon: Users,
    title: "Group Competitions",
    desc: "Host private rooms for workshops, team events, or hackathons with live sync & CSV export.",
    href: "/events",
    tag: "Multiplayer",
  },
];

export function ModesGrid() {
  return (
    <section className="relative py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent mb-2 font-bold">
              <Aperture className="h-3.5 w-3.5" /> Modes & Formats
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Three Ways to Train Your Eye
            </h2>
          </div>
          <Link href="/modes" className="text-xs font-mono font-bold text-accent hover:text-accent-strong inline-flex items-center gap-1 uppercase tracking-wider">
            Explore All Formats <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={mode.href} className="block h-full group">
                <div className="h-full relative rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-accent hover:-translate-y-1 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-accent/40 group-hover:text-accent transition-colors">
                      {mode.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border border-border bg-surface-2 text-text-muted">
                      {mode.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-6">
                    {mode.desc}
                  </p>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono font-semibold text-text-faint group-hover:text-accent transition-colors uppercase tracking-wider">
                    <span>Launch Mode</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

