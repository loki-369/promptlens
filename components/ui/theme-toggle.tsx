"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();
  const isDark = !hydrated || theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-text-muted transition-colors hover:text-text hover:bg-surface-2",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
