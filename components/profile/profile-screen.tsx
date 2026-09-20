"use client";

import { useMemo } from "react";
import { Trophy, Target, TrendingUp, Flame, Award, BarChart3, Aperture } from "lucide-react";
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
    <GlassCard className="p-5 border-accent/20">
      <div className="flex items-center gap-2 mb-2 text-text-faint">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-mono text-2xl font-extrabold ${accent ?? "text-text"}`}>{value}</p>
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
    return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-text-muted font-mono">Loading profile telemetry…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* User Bio Header */}
      <GlassCard className="p-6 sm:p-8 mb-10 border-accent/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center text-3xl shrink-0 shadow-lg text-accent-contrast">
            {level.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-extrabold">{profile.name}</h1>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border border-accent/40 bg-accent-soft text-accent">
                {level.name}
              </span>
            </div>
            {next && (
              <div className="mt-3 max-w-sm">
                <div className="h-2 rounded-full bg-bg border border-border overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-text-faint mt-1.5">
                  {formatNumber(profile.xp)} / {formatNumber(next.minXp)} XP ({progressPct}% to {next.name})
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Target} label="Total Challenges" value={String(stats.totalChallenges)} />
        <StatCard icon={BarChart3} label="Average Score" value={`${stats.avgScore}`} />
        <StatCard icon={Trophy} label="Best Score" value={`${stats.bestScore}`} accent="text-emerald-400" />
        <StatCard icon={Flame} label="Current Streak" value={String(profile.streak)} accent="text-amber-400" />
        <StatCard icon={Award} label="Highest Difficulty" value={stats.highestDifficulty ?? "—"} />
        <StatCard icon={TrendingUp} label="Total XP" value={formatNumber(profile.xp)} accent="text-accent" />
        <StatCard icon={Trophy} label="Global Rank" value={`#${yourRank}`} />
        <StatCard icon={Award} label="Achievements" value={`${profile.achievements.length} / ${5}`} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        <GlassCard className="p-6 lg:col-span-3 border-border-strong">
          <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" /> Score History Progress
          </h2>
          <LineChart data={scoreHistory} />
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2 border-border-strong">
          <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Aperture className="h-4 w-4 text-accent" /> Prompt Strengths
          </h2>
          {dimensionAverages.length === 0 ? (
            <p className="text-xs font-mono text-text-faint py-8 text-center">Complete challenges to compute visual concept strengths.</p>
          ) : (
            <div className="space-y-3.5">
              {dimensionAverages.map((d) => (
                <ScoreBar key={d.key} label={d.label} score={d.score} />
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6 border-border-strong">
        <h2 className="font-display font-bold text-base mb-4">Level Progressions</h2>
        <div className="flex flex-wrap gap-3">
          {LEVELS.map((l) => {
            const unlocked = profile.xp >= l.minXp;
            return (
              <div
                key={l.name}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-mono font-semibold transition-all ${
                  unlocked ? "border-accent bg-accent-soft/40 text-text" : "border-border text-text-faint opacity-40"
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
