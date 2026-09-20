import Link from "next/link";
import { Aperture, Circle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface/30 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 text-accent border border-accent/40">
              <Aperture className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">
              PROMPT<span className="text-accent">LENS</span>
            </span>
          </div>
          <span className="hidden sm:inline text-text-faint text-xs">|</span>
          <span className="text-text-muted text-xs font-mono">
            Optical Image Description Benchmark
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted font-medium">
          <Link href="/play" className="hover:text-accent transition-colors">Play Mode</Link>
          <Link href="/daily" className="hover:text-accent transition-colors">Daily Challenge</Link>
          <Link href="/events" className="hover:text-accent transition-colors">Group Events</Link>
          <Link href="/leaderboard" className="hover:text-accent transition-colors">Leaderboard</Link>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
            <Circle className="h-2 w-2 fill-current animate-pulse" />
            <span>Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
