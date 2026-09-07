"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Challenge } from "@/lib/types";

export function ChallengeCard({ challenge, bestScore }: { challenge: Challenge; bestScore?: number }) {
  return (
    <Link href={`/play/${challenge.id}`} className="group block">
      <GlassCard className="overflow-hidden h-full flex flex-col hover:border-accent transition-colors hover:-translate-y-1">
        <div className="relative aspect-[4/3]">
          <Image
            src={challenge.image}
            alt={challenge.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
          <div className="absolute top-3 left-3">
            <DifficultyBadge difficulty={challenge.difficulty} />
          </div>
          {bestScore !== undefined && (
            <div className="absolute top-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-success border border-success/30">
              Best {bestScore}
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-xs font-medium text-white/80">#{String(challenge.number).padStart(3, "0")} · {challenge.category}</span>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {challenge.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[11px] text-text-faint">#{t}</span>
            ))}
          </div>
          <ArrowRight className="h-4 w-4 text-text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </div>
      </GlassCard>
    </Link>
  );
}
