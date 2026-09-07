"use client";

import { useMemo } from "react";
import { Trophy, Target, TrendingUp, Flame, Award, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ScoreBar } from "@/components/ui/score-bar";
import { LineChart } from "@/components/ui/line-chart";
import { formatNumber } from "@/lib/utils";
import { useProfile } from "@/lib/store";
import { getLevel, LEVELS } from "@/lib/levels";
import { getLeaderboard } from "@/lib/leaderboard";
import { GROUP_LABELS } from "@/lib/scoring";
import type { ScoreGroupKey } from "@/lib/types";
import { DIFFICULTIES } from "@/lib/categories";

const DIFFICULTY_RANK: Record<string, number> = Object.fromEntries(DIFFICULTIES.map((d, i) => [d.level, i]));

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-2 text-text-faint">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className={`font-display text-2xl font-bold ${accent ?? "text-text"}`}>{value}</p>
    </GlassCard>
  );
}

export function ProfileScreen() {
  const { profile, hydrated } = useProfile();
  const { level, next, progressPct } = getLevel(profile.xp);

  const stats = useMemo(() => {
    const h = profile.history;
    const totalChallenges = h.length;
    const avgScore = totalChallenges ? Math.round(h.reduce((s, e) => s + e.score, 0) / totalChallenges) : 0;
    const bestScore = totalChallenges ? Math.max(...h.map((e) => e.score)) : 0;
    const highestDifficulty = h.reduce<string | null>((max, e) => {
      if (!max) return e.difficulty;
      return DIFFICULTY_RANK[e.difficulty] > DIFFICULTY_RANK[max] ? e.difficulty : max;
    }, null);
    return { totalChallenges, avgScore, bestScore, highestDifficulty };
  }, [profile.history]);

  const { yourRank } = useMemo(() => getLeaderboard("alltime", profile.xp), [profile.xp]);

  const dimensionAverages = useMemo(() => {
    const keys: ScoreGroupKey[] = ["subject", "scene", "details"];
    const sums: Record<string, { total: number; count: number }> = {};
    keys.forEach((k) => (sums[k] = { total: 0, count: 0 }));
    profile.history.forEach((entry) => {
      entry.dimensions.forEach((d) => {
        sums[d.key].total += d.score;
        sums[d.key].count += 1;
      });
    });
    return keys
      .map((k) => ({ key: k, label: GROUP_LABELS[k], score: sums[k].count ? Math.round(sums[k].total / sums[k].count) : 0, count: sums[k].count }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.score - a.score);
  }, [profile.history]);

  const scoreHistory = profile.history.slice(-20).map((e) => e.score);

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-text-muted">Loading your profile…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
        <div className="h-16 w-16 rounded-xl bg-accent flex items-center justify-center text-3xl shrink-0">
          {level.icon}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{profile.name}</h1>
          <p className="text-text-muted text-sm">{level.name}</p>
          {next && (
            <div className="mt-2 max-w-xs">
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-text-faint mt-1">
                {formatNumber(profile.xp)} / {formatNumber(next.minXp)} XP to {next.name}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Target} label="Total Challenges" value={String(stats.totalChallenges)} />
        <StatCard icon={BarChart3} label="Average Score" value={`${stats.avgScore}`} />
        <StatCard icon={Trophy} label="Best Score" value={`${stats.bestScore}`} accent="text-success" />
        <StatCard icon={Flame} label="Current Streak" value={String(profile.streak)} accent="text-warning" />
        <StatCard icon={Award} label="Highest Difficulty" value={stats.highestDifficulty ?? "—"} />
        <StatCard icon={TrendingUp} label="Total XP" value={formatNumber(profile.xp)} accent="text-accent" />
        <StatCard icon={Trophy} label="Global Rank" value={`#${yourRank}`} />
        <StatCard icon={Award} label="Achievements" value={`${profile.achievements.length} / ${5}`} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        <GlassCard className="p-6 lg:col-span-3">
          <h2 className="font-display font-semibold mb-4">Score history</h2>
          <LineChart data={scoreHistory} />
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="font-display font-semibold mb-4">Prompt strengths</h2>
          {dimensionAverages.length === 0 ? (
            <p className="text-sm text-text-faint">Play a few challenges to see your strengths.</p>
          ) : (
            <div className="space-y-3.5">
              {dimensionAverages.map((d) => (
                <ScoreBar key={d.key} label={d.label} score={d.score} />
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="font-display font-semibold mb-4">Levels</h2>
        <div className="flex flex-wrap gap-3">
          {LEVELS.map((l) => {
            const unlocked = profile.xp >= l.minXp;
            return (
              <div
                key={l.name}
                className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
                  unlocked ? "border-accent bg-accent-soft text-text" : "border-border text-text-faint opacity-60"
                }`}
              >
                <span>{l.icon}</span>
                {l.name}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
