"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Camera, Flame, Aperture } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useProfile } from "@/lib/store";
import { getLevel } from "@/lib/levels";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
  { href: "/play", label: "Play" },
  { href: "/daily", label: "Daily Challenge" },
  { href: "/events", label: "Group Events" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-contrast shadow-md transition-transform group-hover:scale-105 active:scale-95">
            <Aperture className="h-5 w-5 stroke-[2.2]" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-extrabold tracking-tight leading-none">
              PROMPT<span className="text-accent font-bold">LENS</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-text-faint mt-0.5">
              Optical Studio
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/80 bg-surface/80 p-1 shadow-inner">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                  active
                    ? "text-accent-contrast bg-accent shadow-sm"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile Metrics & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 shadow-sm">
              <span aria-hidden>{level.icon}</span>
              <span className="text-text-muted font-normal hidden lg:inline">{level.name}</span>
              <span className="text-accent font-bold tabular-nums">{hydrated ? formatNumber(profile.xp) : "0"} XP</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-warning/30 bg-warning-soft/40 px-2.5 py-1.5 font-bold text-warning shadow-sm">
              <Flame className="h-3.5 w-3.5 fill-warning/20" />
              <span className="tabular-nums">{hydrated ? profile.streak : 0}</span>
            </div>
          </div>

          <ThemeToggle className="hidden sm:inline-flex" />

          <Link href="/play" className="hidden sm:inline-flex">
            <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-contrast hover:bg-accent-strong shadow-md transition-all active:scale-[0.96]">
              <Camera className="h-3.5 w-3.5" /> Start Lens
            </span>
          </Link>

          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-bg-elevated/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3.5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-2 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 px-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-accent font-bold">{formatNumber(profile.xp)} XP</span>
                  <span className="text-text-faint">·</span>
                  <span className="text-warning font-bold">🔥 {profile.streak} streak</span>
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
