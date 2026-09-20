"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatNumber, avatarColor } from "@/lib/utils";
import { useProfile, ACHIEVEMENTS } from "@/lib/store";
import { getLeaderboard, type LeaderboardScope } from "@/lib/leaderboard";

const TABS: { key: LeaderboardScope; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "alltime", label: "All Time" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardScreen() {
  const [scope, setScope] = useState<LeaderboardScope>("week");
  const { profile, hydrated } = useProfile();

  const { entries, yourRank } = useMemo(() => getLeaderboard(scope, profile.xp), [scope, profile.xp]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">
          <Aperture className="h-3.5 w-3.5" /> Global Standings
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight mb-2">Prompt Benchmark Leaderboard</h1>
        <p className="text-xs font-mono text-text-muted">Ranked by semantic prompt accuracy, streak multiplier, and composite XP.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex rounded-full border border-border-strong bg-surface p-1 shadow-inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setScope(t.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-mono font-bold transition-all",
                scope === t.key ? "bg-accent text-accent-contrast shadow-sm" : "text-text-muted hover:text-text"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <GlassCard className="px-4 py-2 flex items-center gap-2 text-xs font-mono">
          <Trophy className="h-4 w-4 text-warning" />
          <span className="text-text-muted">YOUR RANK:</span>
          <span className="font-bold text-accent tabular-nums">#{hydrated ? yourRank : "—"}</span>
        </GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = profile.achievements.includes(a.id);
          return (
            <span
              key={a.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium transition-all",
                unlocked
                  ? "border-warning/40 bg-warning-soft text-warning"
                  : "border-border-strong text-text-faint opacity-40"
              )}
              title={unlocked ? "Unlocked" : "Locked"}
            >
              <span>{a.icon}</span>
              {a.label}
            </span>
          );
        })}
      </div>

      <GlassCard className="overflow-hidden border-accent/20 shadow-xl">
        <div className="divide-y divide-border">
          {entries.slice(0, 25).map((e, i) => (
            <motion.div
              key={`${e.name}-${e.rank}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 transition-colors",
                e.isYou && "bg-accent-soft/40 border-l-2 border-accent"
              )}
            >
              <span className="w-8 text-center font-mono font-bold text-text-muted text-sm shrink-0">
                {e.rank <= 3 ? MEDALS[e.rank - 1] : e.rank}
              </span>
              <span
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                style={{ background: avatarColor(e.avatarSeed) }}
              >
                {e.name.charAt(0).toUpperCase()}
              </span>
              <span className={cn("flex-1 font-bold text-sm truncate", e.isYou && "text-accent font-extrabold")}>
                {e.name} {e.isYou && <span className="text-xs font-mono font-normal text-text-faint">(you)</span>}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-warning font-bold w-16 justify-end shrink-0">
                <Flame className="h-3.5 w-3.5" />
                {e.streak}
              </span>
              <span className="font-mono font-bold tabular-nums text-sm w-24 text-right shrink-0 text-text">{formatNumber(e.xp)} XP</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
