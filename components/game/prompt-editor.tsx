"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, Send, Save, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { HintPanel } from "@/components/game/hint-panel";
import { Modal } from "@/components/ui/modal";
import type { HintDef } from "@/lib/types";

const MAX_CHARS = 600;

export function PromptEditor({
  value,
  onChange,
  hints,
  revealedCount,
  onRevealHint,
  onSubmit,
  saved,
}: {
  value: string;
  onChange: (v: string) => void;
  hints: HintDef[];
  revealedCount: number;
  onRevealHint: (index: number) => void;
  onSubmit: () => void;
  saved: boolean;
}) {
  const [showHints, setShowHints] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (value.trim().length > 0) setConfirmOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [value]);

  const chars = value.length;
  const overLimit = chars > MAX_CHARS;
  const hintPenalty = hints.slice(0, revealedCount).reduce((s, h) => s + h.cost, 0);

  return (
    <div className="flex flex-col gap-4">
      <GlassCard strong className="p-5 flex flex-col flex-1 border-accent/20">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <label htmlFor="prompt-input" className="text-xs font-mono font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-accent" /> Prompt Construction Terminal
          </label>
          <span className="flex items-center gap-1 text-[10px] font-mono text-text-faint">
            <Save className="h-3 w-3 text-accent" />
            {saved ? "SYNCED" : "DRAFT"}
          </span>
        </div>

        <textarea
          id="prompt-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS + 40))}
          placeholder="Type your prompt here... Name the main subject, setting lighting, camera angle, and fine visual details."
          className="w-full flex-1 min-h-[200px] resize-none rounded-xl border border-border-strong bg-bg p-4 text-xs sm:text-sm leading-relaxed font-mono text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
        />

        <div className="flex items-center justify-between mt-2.5 mb-1 text-xs font-mono">
          <span className={`tabular-nums ${overLimit ? "text-red-400 font-bold" : "text-text-faint"}`}>
            {chars} / {MAX_CHARS} CHARS
          </span>
          {hintPenalty > 0 && (
            <span className="text-warning font-bold">−{hintPenalty} PTS HINT DEDUCTION</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-3">
          <Button
            size="md"
            className="flex-1 min-w-[140px]"
            disabled={value.trim().length === 0 || overLimit}
            onClick={() => setConfirmOpen(true)}
          >
            <Send className="h-4 w-4" />
            EVALUATE PROMPT
          </Button>
          <Button size="md" variant="outline" onClick={() => setShowHints((s) => !s)}>
            <HelpCircle className="h-4 w-4 text-accent" />
            HINTS ({revealedCount}/{hints.length})
          </Button>
        </div>

        <p className="text-[10px] font-mono text-text-faint mt-2.5 text-center">
          PRESS <kbd className="rounded border border-border-strong px-1.5 py-0.5 font-mono text-text">Ctrl + Enter</kbd> TO SUBMIT
        </p>
      </GlassCard>

      {showHints && <HintPanel hints={hints} revealedCount={revealedCount} onReveal={onRevealHint} />}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h3 className="font-display font-bold text-lg mb-2">Submit Prompt for Score?</h3>
        <p className="text-xs text-text-muted mb-5 leading-relaxed">
          Your prompt will be evaluated against ground-truth visual concepts.
          {hintPenalty > 0 && ` A −${hintPenalty} point penalty applies for used hints.`}
        </p>
        <div className="flex gap-2.5">
          <Button variant="outline" className="flex-1 text-xs font-mono" onClick={() => setConfirmOpen(false)}>
            EDIT PROMPT
          </Button>
          <Button
            className="flex-1 text-xs font-mono"
            onClick={() => {
              setConfirmOpen(false);
              onSubmit();
            }}
          >
            LOCK SCORE
          </Button>
        </div>
      </Modal>
    </div>
  );
}
