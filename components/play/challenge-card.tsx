"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowRight } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Challenge } from "@/lib/types";

export function ChallengeCard({ challenge, bestScore }: { challenge: Challenge; bestScore?: number }) {
  return (
    <Link href={`/play/${challenge.id}`} className="group block h-full">
      <div className="h-full rounded-xl border-2 border-border-strong bg-[#0d0e12] p-3 transition-all duration-200 hover:border-accent hover:-translate-y-1 shadow-lg flex flex-col justify-between film-frame">
        {/* Film Top Bar */}
        <div className="flex items-center justify-between font-mono text-[10px] text-text-faint pb-2 px-1 border-b border-white/10 uppercase tracking-widest">
          <span className="text-accent font-bold">KODAK 35mm · EXP #{String(challenge.number).padStart(2, "0")}</span>
          <span>{challenge.category}</span>
        </div>

        {/* Viewport Frame */}
        <div className="relative aspect-[4/3] w-full bg-black my-2 rounded-lg overflow-hidden border border-white/10 viewfinder-corner">
          <Image
            src={challenge.image}
            alt={challenge.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

          {/* Difficulty Badge */}
          <div className="absolute top-2.5 left-2.5">
            <DifficultyBadge difficulty={challenge.difficulty} />
          </div>

          {bestScore !== undefined && (
            <div className="absolute top-2.5 right-2.5 rounded border border-emerald-500/50 bg-black/80 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              BEST {bestScore}%
            </div>
          )}
        </div>

        {/* Film Bottom Bar */}
        <div className="pt-2 px-1 flex items-center justify-between text-xs font-mono border-t border-white/10">
          <span className="text-text-muted text-[11px] truncate max-w-[160px]">
            #{challenge.tags.join(" #")}
          </span>
          <div className="flex items-center gap-1 font-bold text-accent group-hover:translate-x-1 transition-transform uppercase tracking-wider text-[11px]">
            <span>EXPOSE</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

