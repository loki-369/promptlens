"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, Send, Save } from "lucide-react";
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
      <GlassCard strong className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="prompt-input" className="text-sm font-semibold text-text">
            Your prompt
          </label>
          <span className="flex items-center gap-1.5 text-[11px] text-text-faint">
            <Save className="h-3 w-3" />
            {saved ? "Autosaved" : "Draft"}
          </span>
        </div>
        <textarea
          id="prompt-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS + 40))}
          placeholder="Describe the image as if you're writing the prompt for an image generation AI..."
          className="w-full flex-1 min-h-[220px] resize-none rounded-lg border border-border-strong bg-bg-elevated p-4 text-sm leading-relaxed font-mono text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-shadow"
        />
        <div className="flex items-center justify-between mt-2 mb-1">
          <span className={`text-xs tabular-nums ${overLimit ? "text-danger" : "text-text-faint"}`}>
            {chars} / {MAX_CHARS} characters
          </span>
          {hintPenalty > 0 && (
            <span className="text-xs text-warning font-medium">−{hintPenalty}pt hint penalty</span>
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
            Submit Prompt
          </Button>
          <Button size="md" variant="outline" onClick={() => setShowHints((s) => !s)}>
            <HelpCircle className="h-4 w-4" />
            I&apos;m Stuck
          </Button>
        </div>
        <p className="text-[11px] text-text-faint mt-2 text-center">
          Press <kbd className="rounded border border-border-strong px-1 py-0.5 font-mono">⌘/Ctrl + Enter</kbd> to submit
        </p>
      </GlassCard>

      {showHints && <HintPanel hints={hints} revealedCount={revealedCount} onReveal={onRevealHint} />}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h3 className="font-display font-semibold text-lg mb-2">Submit this prompt?</h3>
        <p className="text-sm text-text-muted mb-5">
          Once submitted, you&apos;ll see your score and the original prompt will be revealed.
          {hintPenalty > 0 && ` You'll take a −${hintPenalty} point hint penalty.`}
        </p>
        <div className="flex gap-2.5">
          <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
            Keep editing
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setConfirmOpen(false);
              onSubmit();
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
