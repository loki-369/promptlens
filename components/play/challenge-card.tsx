"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowRight, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Challenge } from "@/lib/types";

export function ChallengeCard({ challenge, bestScore }: { challenge: Challenge; bestScore?: number }) {
  return (
    <Link href={`/play/${challenge.id}`} className="group block h-full">
      <GlassCard className="overflow-hidden h-full flex flex-col hover:border-accent/60 transition-all duration-300 hover:-translate-y-1 shadow-md viewfinder-corner">
        <div className="relative aspect-[4/3] bg-black">
          <Image
            src={challenge.image}
            alt={challenge.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Header Metadata Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <DifficultyBadge difficulty={challenge.difficulty} />
          </div>

          {bestScore !== undefined && (
            <div className="absolute top-3 right-3 rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/40 shadow-sm">
              BEST {bestScore}
            </div>
          )}

          {/* Bottom Viewfinder Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
            <span className="flex items-center gap-1">
              <Aperture className="h-3 w-3 text-accent" />
              <span>#{String(challenge.number).padStart(3, "0")}</span>
            </span>
            <span className="text-[11px] font-semibold text-accent border border-accent/40 bg-accent-soft/60 backdrop-blur-md px-2 py-0.5 rounded-full">
              {challenge.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between bg-surface/80">
          <div className="flex flex-wrap gap-2 text-xs font-mono text-text-faint">
            {challenge.tags.slice(0, 2).map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-accent group-hover:translate-x-1 transition-transform">
            <span>START</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
