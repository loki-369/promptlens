"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatNumber } from "@/lib/utils";
import { useProfile, ACHIEVEMENTS } from "@/lib/store";
import { getLeaderboard, type LeaderboardScope } from "@/lib/leaderboard";

const TABS: { key: LeaderboardScope; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "alltime", label: "All Time" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

export function LeaderboardScreen() {
  const [scope, setScope] = useState<LeaderboardScope>("week");
  const { profile, hydrated } = useProfile();

  const { entries, yourRank } = useMemo(() => getLeaderboard(scope, profile.xp), [scope, profile.xp]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Compete</p>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Leaderboard</h1>
        <p className="text-text-muted">See who&apos;s describing images better than everyone else.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex rounded-lg border border-border-strong bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setScope(t.key)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                scope === t.key ? "bg-accent text-accent-contrast" : "text-text-muted hover:text-text"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <GlassCard className="px-4 py-2.5 flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-warning" />
          <span className="text-text-muted">Your Rank:</span>
          <span className="font-bold text-text tabular-nums">#{hydrated ? yourRank : "—"}</span>
        </GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = profile.achievements.includes(a.id);
          return (
            <span
              key={a.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                unlocked
                  ? "border-warning/40 bg-warning-soft text-warning"
                  : "border-border-strong text-text-faint opacity-50"
              )}
              title={unlocked ? "Unlocked" : "Locked"}
            >
              <span>{a.icon}</span>
              {a.label}
            </span>
          );
        })}
      </div>

      <GlassCard className="overflow-hidden">
        <div className="divide-y divide-border">
          {entries.slice(0, 25).map((e, i) => (
            <motion.div
              key={`${e.name}-${e.rank}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5",
                e.isYou && "bg-accent-soft border-l-2 border-accent"
              )}
            >
              <span className="w-8 text-center font-display font-bold text-text-muted shrink-0">
                {e.rank <= 3 ? MEDALS[e.rank - 1] : e.rank}
              </span>
              <span
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: avatarColor(e.avatarSeed) }}
              >
                {e.name.charAt(0).toUpperCase()}
              </span>
              <span className={cn("flex-1 font-medium text-sm truncate", e.isYou && "text-accent")}>
                {e.name} {e.isYou && <span className="text-xs text-text-faint">(you)</span>}
              </span>
              <span className="flex items-center gap-1 text-xs text-warning font-semibold w-14 justify-end shrink-0">
                <Flame className="h-3.5 w-3.5" />
                {e.streak}
              </span>
              <span className="font-semibold tabular-nums text-sm w-20 text-right shrink-0">{formatNumber(e.xp)} XP</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
