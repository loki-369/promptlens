import Link from "next/link";
import { CalendarDays, Trophy } from "lucide-react";

export function DailyBanner() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-soft px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-accent/30">
            <CalendarDays className="h-4 w-4 text-accent" />
          </span>
          <div>
            <p className="text-sm font-semibold">Daily Challenge — {today}</p>
            <p className="text-xs text-text-muted">Everyone gets this exact image today. One shot to climb today&apos;s board.</p>
          </div>
        </div>
        <Link href="/leaderboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-strong">
          <Trophy className="h-3.5 w-3.5" />
          Today&apos;s Leaderboard
        </Link>
      </div>
    </div>
  );
}
