"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function OriginalPromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  return (
    <div>
      <h3 className="font-display font-semibold mb-3">The Original Prompt</h3>
      <GlassCard strong className="p-5 relative font-mono">
        <div className="absolute top-4 left-4 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <button
          onClick={copy}
          className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-2.5 py-1.5 text-xs font-sans font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy Prompt"}
        </button>
        <p className="mt-8 text-sm leading-relaxed text-text">{prompt}</p>
      </GlassCard>
    </div>
  );
}
