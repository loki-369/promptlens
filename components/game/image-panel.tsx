"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { Flag, ImageOff, Focus, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ImagePanel({ image, imageAlt }: { image: string; imageAlt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <GlassCard strong className="relative overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5] viewfinder-corner border-accent/30 shadow-2xl">
        {!loaded && <Skeleton className="absolute inset-0 rounded-xl" />}

        {/* Viewfinder Reticle Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-md border-b border-white/10 text-[10px] font-mono text-white/80">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Focus className="h-3 w-3" /> VIEWFINDER
          </span>
          <span className="text-white/60">RAW UNPREPROCESSED</span>
          <span className="text-accent font-bold">35mm f/1.4</span>
        </div>

        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-95" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          priority
        />

        {loaded && (
          <button
            onClick={() => setReported(true)}
            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono font-medium text-white/80 hover:text-white hover:bg-black transition-colors border border-white/20 shadow-md"
          >
            {reported ? (
              <>
                <ImageOff className="h-3.5 w-3.5 text-red-400" /> Reported
              </>
            ) : (
              <>
                <Flag className="h-3.5 w-3.5 text-text-muted" /> Report image
              </>
            )}
          </button>
        )}
      </GlassCard>

      <div className="p-3 rounded-xl border border-border bg-surface/60 text-center">
        <p className="text-xs font-mono text-text-muted flex items-center justify-center gap-1.5">
          <Aperture className="h-3.5 w-3.5 text-accent" />
          <span>Write the precise prompt that recreates this visual scene</span>
        </p>
      </div>
    </div>
  );
}
