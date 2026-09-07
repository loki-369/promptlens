"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles, Flame } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useProfile } from "@/lib/store";
import { getLevel } from "@/lib/levels";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
  { href: "/play", label: "Play" },
  { href: "/daily", label: "Daily Challenge" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { profile, hydrated } = useProfile();
  const { level } = getLevel(profile.xp);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Sparkles className="h-4 w-4 text-accent-contrast" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Prompt<span className="text-accent">Lens</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-text bg-surface-2" : "text-text-muted hover:text-text hover:bg-surface-2"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold">
              <span aria-hidden>{level.icon}</span>
              <span className="text-text-muted font-normal hidden lg:inline">{level.name}</span>
              <span className="text-accent tabular-nums">{hydrated ? formatNumber(profile.xp) : "0"} XP</span>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-warning">
              <Flame className="h-3.5 w-3.5" />
              <span className="tabular-nums">{hydrated ? profile.streak : 0}</span>
            </div>
          </div>
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link href="/play" className="hidden sm:inline-flex">
            <span className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast hover:bg-accent-strong transition-colors active:scale-[0.98]">
              Play Now
            </span>
          </Link>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-bg-elevated"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-2 px-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-accent font-semibold">{formatNumber(profile.xp)} XP</span>
                  <span className="text-text-faint">·</span>
                  <span className="text-warning font-semibold">🔥 {profile.streak} streak</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
