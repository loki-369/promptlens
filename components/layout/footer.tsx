import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
            <Sparkles className="h-3 w-3 text-accent-contrast" />
          </span>
          <span className="font-display text-sm font-semibold">
            Prompt<span className="text-accent">Lens</span>
          </span>
          <span className="text-text-faint text-xs ml-2">Train your eye. Train your prompts.</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-text-muted">
          <Link href="/play" className="hover:text-text">Play</Link>
          <Link href="/leaderboard" className="hover:text-text">Leaderboard</Link>
          <Link href="/modes" className="hover:text-text">Modes</Link>
          <Link href="/admin" className="hover:text-text">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
