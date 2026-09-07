"use client";

import { Fragment } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import type { EvaluationResult } from "@/lib/types";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, phrases: { phrase: string; className: string }[]) {
  const valid = phrases.filter((p) => p.phrase && p.phrase.trim().length > 1);
  if (valid.length === 0) return [<Fragment key="0">{text}</Fragment>];
  const sorted = [...valid].sort((a, b) => b.phrase.length - a.phrase.length);
  const pattern = new RegExp(`(${sorted.map((p) => escapeRegExp(p.phrase)).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const match = sorted.find((p) => p.phrase.toLowerCase() === part.toLowerCase());
    if (match) {
      return (
        <mark key={i} className={`rounded px-0.5 py-px ${match.className}`}>
          {part}
        </mark>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function ComparePrompts({
  userPrompt,
  originalPrompt,
  result,
}: {
  userPrompt: string;
  originalPrompt: string;
  result: EvaluationResult;
}) {
  const userHighlights = [
    ...result.matched.map((m) => ({ phrase: m.matchedPhrase, className: "bg-success/25 text-text" })),
    ...result.vagueNotes.map((v) => ({ phrase: v.userPhrase, className: "bg-warning/25 text-text" })),
  ];
  const originalHighlights = result.missed.map((c) => ({
    phrase: c.strongPhrase,
    className: "bg-danger/20 text-text",
  }));

  return (
    <div>
      <h3 className="font-display font-semibold mb-3">Compare Prompts</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-wide text-text-faint mb-2">Your prompt</p>
          <p className="text-sm leading-relaxed text-text-muted font-mono">
            {highlight(userPrompt || "(empty)", userHighlights)}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-wide text-text-faint mb-2">Original prompt</p>
          <p className="text-sm leading-relaxed text-text-muted font-mono">
            {highlight(originalPrompt, originalHighlights)}
          </p>
        </GlassCard>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-success/50" /> Matching concepts
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-warning/50" /> Too vague
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-danger/50" /> Missing from your prompt
        </span>
      </div>
    </div>
  );
}
