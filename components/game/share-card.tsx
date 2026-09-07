"use client";

import { useState } from "react";
import { Share2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Challenge, EvaluationResult } from "@/lib/types";

export function ShareCard({ challenge, result }: { challenge: Challenge; result: EvaluationResult }) {
  const [copied, setCopied] = useState(false);

  const dim = (key: string) => result.dimensions.find((d) => d.key === key)?.score ?? 0;

  const shareText = `PROMPTLENS\nI scored ${result.overallScore}/100 on Challenge #${String(challenge.number).padStart(3, "0")}\n🎯 Subject: ${dim("subject")}  🎨 Scene & Style: ${dim("scene")}  🛠️ Details: ${dim("details")}\nCan you beat me?`;

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text: shareText, title: "PromptLens" });
        return;
      } catch {
        // user cancelled or unsupported — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border-strong border-t-4 border-t-accent">
      <div className="relative bg-surface p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="font-display font-bold tracking-wide text-sm">PROMPTLENS</span>
        </div>
        <p className="text-xs text-text-faint mb-1">I scored</p>
        <p className="font-display text-5xl font-bold text-accent leading-none mb-1">
          {result.overallScore}<span className="text-2xl text-text-faint">/100</span>
        </p>
        <p className="text-xs text-text-faint mb-5">
          on Challenge #{String(challenge.number).padStart(3, "0")} · {challenge.category}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-xs">
          <span className="rounded-lg bg-surface-2 border border-border px-3 py-2">🎯 Subject {dim("subject")}</span>
          <span className="rounded-lg bg-surface-2 border border-border px-3 py-2">🎨 Scene {dim("scene")}</span>
          <span className="rounded-lg bg-surface-2 border border-border px-3 py-2">🛠️ Details {dim("details")}</span>
        </div>
        <p className="text-sm font-semibold mb-4">Can you beat me?</p>
        <Button onClick={share} className="w-full">
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied to clipboard" : "Share Score"}
        </Button>
      </div>
    </div>
  );
}
