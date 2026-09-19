"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, CalendarDays, Users, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const MODES = [
  {
    icon: Target,
    title: "Guess the Prompt",
    desc: "The core loop — see an image, write the prompt, get scored on Subject, Scene & Style, and Details.",
    href: "/play",
  },
  {
    icon: CalendarDays,
    title: "Daily Challenge",
    desc: "Same image, everyone, once a day. Climb the global leaderboard.",
    href: "/daily",
  },
  {
    icon: Users,
    title: "Group Competitions",
    desc: "Create group rooms for closed events, workshops, or team battles with live scoreboards.",
    href: "/events",
  },
];

export function ModesGrid() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Game modes</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Three ways to sharpen your eye
            </h2>
          </div>
          <Link href="/modes" className="text-sm font-semibold text-accent hover:text-accent-strong inline-flex items-center gap-1">
            See all modes <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={mode.href} className="block h-full group">
                <GlassCard className="p-6 h-full relative overflow-hidden hover:border-accent transition-colors hover:-translate-y-0.5">
                  <div className="relative flex items-start justify-between">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft border border-border">
                      <mode.icon className="h-5 w-5 text-accent" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-text-faint group-hover:text-text transition-colors" />
                  </div>
                  <h3 className="relative font-display font-semibold text-xl mb-2">{mode.title}</h3>
                  <p className="relative text-sm text-text-muted leading-relaxed max-w-sm">{mode.desc}</p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
