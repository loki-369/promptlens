"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps next/image with a two-stage fallback: if the Next.js image
 * optimizer can't reach the source (e.g. restrictive server-side egress),
 * fall back to an unoptimized <img> that fetches directly in the visitor's
 * browser instead. If that also fails, show a graceful placeholder rather
 * than a broken image icon.
 */
export function SmartImage({ onLoad, className, alt, ...props }: ImageProps) {
  const [stage, setStage] = useState<"optimized" | "raw" | "failed">("optimized");

  if (stage === "failed") {
    return (
      <div className={cn("flex items-center justify-center bg-surface-2 text-text-faint", className)}>
        <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }

  if (stage === "raw") {
    const src = typeof props.src === "string" ? props.src : "";
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional fallback when the Next.js image optimizer can't reach the source
      <img
        src={src}
        alt={alt}
        className={cn(className, props.fill && "absolute inset-0 h-full w-full")}
        onLoad={onLoad as React.ReactEventHandler<HTMLImageElement>}
        onError={() => setStage("failed")}
      />
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={() => setStage("raw")}
    />
  );
}
