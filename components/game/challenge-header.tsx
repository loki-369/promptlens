"use client";

import { Aperture, Flame } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { useProfile } from "@/lib/store";
import type { Challenge } from "@/lib/types";

export function ChallengeHeader({
  challenge,
  index,
  total,
}: {
  challenge: Challenge;
  index: number;
  total: number;
}) {
  const { profile, hydrated } = useProfile();
  const pct = Math.round((index / total) * 100);

  return (
    <div className="mb-6 p-4 rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent border border-accent/40 font-mono text-xs font-bold">
            #{String(challenge.number).padStart(3, "0")}
          </span>
          <div>
            <h1 className="font-display text-lg font-extrabold flex items-center gap-2">
              <span>{challenge.imageAlt.slice(0, 45)}...</span>
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted mt-0.5">
              <span className="text-accent font-bold">{challenge.category}</span>
              <span>·</span>
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-strong bg-bg">
            <Aperture className="h-3.5 w-3.5 text-accent" />
            <span className="text-text-muted">XP:</span>
            <span className="font-bold text-accent tabular-nums">{hydrated ? formatNumber(profile.xp) : 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warning/30 bg-warning-soft/30 text-warning font-bold">
            <Flame className="h-3.5 w-3.5" />
            <span className="tabular-nums">{hydrated ? profile.streak : 0} STREAK</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-bg border border-border overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 shadow-sm"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-text-muted shrink-0">
          LENS {index} / {total}
        </span>
      </div>
    </div>
  );
}
