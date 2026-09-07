"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChallengeHeader } from "@/components/game/challenge-header";
import { ImagePanel } from "@/components/game/image-panel";
import { PromptEditor } from "@/components/game/prompt-editor";
import { EvaluationReveal } from "@/components/game/evaluation-reveal";
import { ConceptLists } from "@/components/game/concept-lists";
import { OriginalPromptCard } from "@/components/game/original-prompt-card";
import { ComparePrompts } from "@/components/game/compare-prompts";
import { AiTutor } from "@/components/game/ai-tutor";
import { ShareCard } from "@/components/game/share-card";
import { NextActions } from "@/components/game/next-actions";
import { evaluatePrompt } from "@/lib/scoring";
import { useDraftPrompt, useProfile } from "@/lib/store";
import { getPublishedChallenges, getNextChallenge } from "@/data/challenges";
import type { Challenge, EvaluationResult } from "@/lib/types";

export function GameScreen({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const { draft, setDraft, loaded } = useDraftPrompt(challenge.id);
  const { submit } = useProfile();
  const [phase, setPhase] = useState<"playing" | "results">("playing");
  const [hintsRevealedCount, setHintsRevealedCount] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  const list = useMemo(() => getPublishedChallenges(), []);
  const index = Math.max(1, list.findIndex((c) => c.id === challenge.id) + 1);

  const handleSubmit = () => {
    const hintPenalty = challenge.hints.slice(0, hintsRevealedCount).reduce((s, h) => s + h.cost, 0);
    const evalResult = evaluatePrompt(challenge, draft, hintPenalty);
    setResult(evalResult);
    setSubmittedPrompt(draft);
    setPhase("results");
    submit({
      challenge,
      score: evalResult.overallScore,
      dimensions: evalResult.dimensions,
      xpEarned: evalResult.xpEarned,
      hintsUsed: hintsRevealedCount,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTryAgain = () => {
    setPhase("playing");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const next = getNextChallenge(challenge.id);
    router.push(`/play/${next.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <ChallengeHeader challenge={challenge} index={index} total={list.length} />

      <AnimatePresence mode="wait">
        {phase === "playing" ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-2 gap-6 items-start"
          >
            <div className="order-1">
              <ImagePanel image={challenge.image} imageAlt={challenge.imageAlt} />
            </div>
            <div className="order-2">
              <PromptEditor
                value={draft}
                onChange={setDraft}
                hints={challenge.hints}
                revealedCount={hintsRevealedCount}
                onRevealHint={(i) => setHintsRevealedCount((c) => Math.max(c, i + 1))}
                onSubmit={handleSubmit}
                saved={loaded}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            {result && (
              <>
                <EvaluationReveal result={result} />
                <ConceptLists result={result} />
                <OriginalPromptCard prompt={challenge.originalPrompt} />
                <ComparePrompts userPrompt={submittedPrompt} originalPrompt={challenge.originalPrompt} result={result} />
                <AiTutor result={result} userPrompt={submittedPrompt} onTryAgain={handleTryAgain} />
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
                  <ShareCard challenge={challenge} result={result} />
                  <NextActions onTryAgain={handleTryAgain} onNext={handleNext} />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
