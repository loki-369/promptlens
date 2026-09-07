"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { EvaluationResult } from "@/lib/types";

export function ConceptLists({ result }: { result: EvaluationResult }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <GlassCard className="p-5">
        <h3 className="flex items-center gap-2 font-display font-semibold mb-3.5">
          <CheckCircle2 className="h-5 w-5 text-success" />
          You nailed it
        </h3>
        {result.matched.length === 0 ? (
          <p className="text-sm text-text-faint">Nothing matched yet — the missed list has details to build from.</p>
        ) : (
          <ul className="space-y-2">
            {result.matched.slice(0, 8).map((m, i) => (
              <motion.li
                key={m.concept.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="flex items-start gap-2 text-sm text-text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                {m.concept.label}
              </motion.li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="flex items-center gap-2 font-display font-semibold mb-3.5">
          <XCircle className="h-5 w-5 text-danger" />
          You missed
        </h3>
        {result.missed.length === 0 ? (
          <p className="text-sm text-text-faint">Nothing missed — full coverage on this one.</p>
        ) : (
          <ul className="space-y-2">
            {result.missed.slice(0, 8).map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="flex items-start gap-2 text-sm text-text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-danger/70 shrink-0" />
                {c.label}
              </motion.li>
            ))}
          </ul>
        )}
      </GlassCard>

      {result.vagueNotes.length > 0 && (
        <GlassCard className="p-5 sm:col-span-2">
          <h3 className="flex items-center gap-2 font-display font-semibold mb-3.5">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Your prompt was too vague here
          </h3>
          <div className="space-y-4">
            {result.vagueNotes.slice(0, 3).map((v, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-bg-elevated p-3">
                  <p className="text-[11px] uppercase tracking-wide text-text-faint mb-1">Instead of</p>
                  <p className="font-mono text-text-muted">&ldquo;{v.userPhrase}&rdquo;</p>
                </div>
                <div className="rounded-lg border border-success/30 bg-success-soft p-3">
                  <p className="text-[11px] uppercase tracking-wide text-success mb-1">A stronger description</p>
                  <p className="font-mono text-text">&ldquo;{v.strongPhrase}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
