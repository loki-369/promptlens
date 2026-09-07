"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES, DIFFICULTIES } from "@/lib/categories";
import { difficultyClasses } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Dices } from "lucide-react";

export function CategoriesSection() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Pick your arena</p>
          <h2 className="font-display text-3xl font-bold tracking-tight mb-4">16 categories, 3 difficulty tiers</h2>
          <p className="text-text-muted leading-relaxed mb-6">
            From cozy cabin photography to neon-lit cyberpunk concept art — choose what you want to train,
            or let fate decide.
          </p>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-surface-2 transition-colors"
          >
            <Dices className="h-4 w-4 text-accent" />
            Surprise Me
          </Link>

          <div className="mt-8 space-y-2.5">
            {DIFFICULTIES.map((d) => (
              <div key={d.level} className="flex items-center gap-3 text-sm">
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold w-28 text-center ${difficultyClasses(d.level)}`}>
                  {d.level}
                </span>
                <span className="text-text-faint text-xs">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.025 }}
              >
                <Link href={`/play?category=${encodeURIComponent(cat)}`}>
                  <GlassCard className="px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-text transition-colors text-text-muted cursor-pointer">
                    {cat}
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
