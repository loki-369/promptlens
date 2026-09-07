"use client";

import { Flame } from "lucide-react";
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
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-bold">
            Challenge #{String(challenge.number).padStart(3, "0")}
          </h1>
          <DifficultyBadge difficulty={challenge.difficulty} />
          <span className="text-xs text-text-faint hidden sm:inline">{challenge.category}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">
            <span className="font-semibold text-text tabular-nums">{hydrated ? formatNumber(profile.xp) : 0}</span> XP
          </span>
          <span className="inline-flex items-center gap-1 text-warning font-semibold">
            <Flame className="h-4 w-4" />
            <span className="tabular-nums">{hydrated ? profile.streak : 0}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-text-faint shrink-0">
          {index} / {total}
        </span>
      </div>
    </div>
  );
}
