"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dices, Target, CalendarDays } from "lucide-react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/categories";
import { getPublishedChallenges } from "@/data/challenges";
import { ChallengeCard } from "@/components/play/challenge-card";
import { useProfile } from "@/lib/store";
import { useAdminChallenges } from "@/lib/admin-store";
import { cn, difficultyClasses } from "@/lib/utils";
import Link from "next/link";

const MODE_LINKS = [
  { href: "/play", label: "Guess the Prompt", icon: Target },
  { href: "/daily", label: "Daily Challenge", icon: CalendarDays },
];

export function ChallengePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfile();

  const [category, setCategory] = useState<string | null>(searchParams.get("category"));
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const { challenges: customChallenges } = useAdminChallenges();

  const challenges = useMemo(
    () => [...getPublishedChallenges(), ...customChallenges.filter((c) => c.published)],
    [customChallenges]
  );

  const filtered = challenges.filter((c) => {
    if (category && c.category !== category) return false;
    if (difficulty && c.difficulty !== difficulty) return false;
    return true;
  });

  const bestScoreFor = (id: string) => {
    const attempts = profile.history.filter((h) => h.challengeId === id);
    if (attempts.length === 0) return undefined;
    return Math.max(...attempts.map((a) => a.score));
  };

  const surpriseMe = () => {
    const pool = filtered.length > 0 ? filtered : challenges;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/play/${pick.id}`);
  };

  const usedCategories = Array.from(new Set(challenges.map((c) => c.category)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap gap-2 mb-8">
        {MODE_LINKS.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              m.href === "/play"
                ? "border-accent bg-accent-soft text-accent"
                : "border-border-strong text-text-muted hover:text-text hover:bg-surface-2"
            )}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Choose your challenge</h1>
          <p className="text-text-muted">Pick a category and difficulty, or let fate decide.</p>
        </div>
        <button
          onClick={surpriseMe}
          className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-surface-2 transition-colors shrink-0"
        >
          <Dices className="h-4 w-4 text-accent" />
          Surprise Me
        </button>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-faint mb-2.5">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDifficulty(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              !difficulty ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-faint hover:text-text"
            )}
          >
            All
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.level}
              onClick={() => setDifficulty(difficulty === d.level ? null : d.level)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                difficulty === d.level ? difficultyClasses(d.level) : "border-border-strong text-text-faint hover:text-text"
              )}
            >
              {d.level}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-faint mb-2.5">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              !category ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-faint hover:text-text"
            )}
          >
            All categories
          </button>
          {CATEGORIES.map((cat) => {
            const disabled = !usedCategories.includes(cat);
            return (
              <button
                key={cat}
                disabled={disabled}
                onClick={() => setCategory(category === cat ? null : cat)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  disabled
                    ? "border-border text-text-faint/40 cursor-not-allowed"
                    : category === cat
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border-strong text-text-faint hover:text-text"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-text-muted py-16">No challenges match those filters yet — try another combination.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <ChallengeCard key={c.id} challenge={c} bestScore={bestScoreFor(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
