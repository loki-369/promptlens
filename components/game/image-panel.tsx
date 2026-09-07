"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { Flag, ImageOff } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ImagePanel({ image, imageAlt }: { image: string; imageAlt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <GlassCard strong className="relative overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
        {!loaded && <Skeleton className="absolute inset-0 rounded-xl" />}
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          priority
        />
        {loaded && (
          <button
            onClick={() => setReported(true)}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-black/80 transition-colors border border-white/10"
          >
            {reported ? (
              <>
                <ImageOff className="h-3.5 w-3.5" /> Reported
              </>
            ) : (
              <>
                <Flag className="h-3.5 w-3.5" /> Report image
              </>
            )}
          </button>
        )}
      </GlassCard>
      <p className="text-center text-sm text-text-muted">
        What prompt would create this image?
      </p>
    </div>
  );
}
