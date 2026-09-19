"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Send, Trophy, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Eye, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SmartImage } from "@/components/ui/smart-image";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";
import { CHALLENGES, getChallengeById } from "@/data/challenges";
import { type EventRoom, submitEventScore, nextEventRound } from "@/lib/event-store";
import { evaluatePrompt } from "@/lib/scoring";
import type { EvaluationResult } from "@/lib/types";

interface EventGameProps {
  room: EventRoom;
  currentParticipantId?: string | null;
  onViewLeaderboard?: () => void;
}

export function EventGame({ room, currentParticipantId, onViewLeaderboard }: EventGameProps) {
  const currentChallengeId = room.challengeIds[room.currentChallengeIndex] || CHALLENGES[0].id;
  const challenge = getChallengeById(currentChallengeId) || CHALLENGES[0];

  const currentParticipant = room.participants.find((p) => p.id === currentParticipantId);
  const participantName = currentParticipant ? currentParticipant.name : "Player";
  const isHost = currentParticipant?.isHost || room.hostId === currentParticipantId;

  // Find existing submission for this challenge
  const existingSubmission = room.submissions.find(
    (s) => s.participantId === currentParticipantId && s.challengeId === challenge.id
  );

  const [prompt, setPrompt] = useState(existingSubmission?.prompt || "");
  const [hintsUsedCount, setHintsUsedCount] = useState(existingSubmission?.hintsUsed || 0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!room.timeLimitSeconds || !room.roundStartedAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const startMs = new Date(room.roundStartedAt!).getTime();
      const nowMs = Date.now();
      const elapsedSec = Math.floor((nowMs - startMs) / 1000);
      const remaining = Math.max(0, room.timeLimitSeconds - elapsedSec);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [room.timeLimitSeconds, room.roundStartedAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !currentParticipantId) return;

    const hintPenalty = challenge.hints
      .slice(0, hintsUsedCount)
      .reduce((acc, h) => acc + h.cost, 0);

    const evalResult = evaluatePrompt(challenge, prompt, hintPenalty);
    setResult(evalResult);

    submitEventScore(
      room.code,
      currentParticipantId,
      participantName,
      challenge.id,
      prompt,
      evalResult.overallScore,
      evalResult.dimensions,
      evalResult.xpEarned,
      hintsUsedCount
    );
  };

  const handleNextRound = () => {
    setResult(null);
    setPrompt("");
    setHintsUsedCount(0);
    nextEventRound(room.code);
  };

  // Round submission progress
  const roundSubmissions = room.submissions.filter((s) => s.challengeId === challenge.id);
  const hasSubmitted = !!existingSubmission || !!result;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent font-bold text-sm">
            R{room.currentChallengeIndex + 1}
          </span>
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
              {room.name}
              <span className="text-xs font-normal text-text-muted">
                (Round {room.currentChallengeIndex + 1} of {room.challengeIds.length})
              </span>
            </h1>
            <p className="text-xs text-text-muted truncate max-w-md">
              Target Category: <span className="text-accent font-semibold">{challenge.category}</span> · Difficulty: <span className="font-semibold">{challenge.difficulty}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
              timeLeft < 30 ? "border-red-500/50 bg-red-500/10 text-red-400 animate-pulse" : "border-border-strong bg-bg text-accent"
            }`}>
              <Clock className="h-3.5 w-3.5" />
              <span>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}

          <button
            onClick={onViewLeaderboard}
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-2 transition-colors"
          >
            <Trophy className="h-3.5 w-3.5 text-warning" />
            <span>Live Scoreboard ({roundSubmissions.length}/{room.participants.length})</span>
          </button>
        </div>
      </div>

      {/* Main Gameplay Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Target */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-3 overflow-hidden border-accent/20">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
              <SmartImage
                src={challenge.image}
                alt={challenge.imageAlt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </GlassCard>

          {/* Hint Accordion */}
          {challenge.hints.length > 0 && (
            <GlassCard className="p-4 bg-surface/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold flex items-center gap-1 text-text-muted">
                  <HelpCircle className="h-3.5 w-3.5 text-accent" /> Available Hints ({hintsUsedCount}/{challenge.hints.length})
                </span>
                {hintsUsedCount < challenge.hints.length && !hasSubmitted && (
                  <button
                    type="button"
                    onClick={() => setHintsUsedCount((c) => Math.min(challenge.hints.length, c + 1))}
                    className="text-xs text-accent hover:underline font-semibold"
                  >
                    Unlock Next Hint (-{challenge.hints[hintsUsedCount]?.cost || 3} pts)
                  </button>
                )}
              </div>

              {hintsUsedCount > 0 && (
                <div className="space-y-2 mt-2">
                  {challenge.hints.slice(0, hintsUsedCount).map((hint, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-surface border border-accent/30 text-xs text-text flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{hint.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right Column: Prompt Input or Submission Results */}
        <div className="lg:col-span-6 space-y-6">
          {!hasSubmitted ? (
            <GlassCard className="p-6">
              <h2 className="font-display font-bold text-lg mb-2">Describe this Image</h2>
              <p className="text-xs text-text-muted mb-4">
                Write a detailed prompt that would generate this exact image. Focus on Subject, Scene & Lighting, and Camera details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    rows={6}
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A cinematic photograph of an abandoned subway station at night..."
                    className="w-full rounded-lg border border-border-strong bg-surface p-4 text-sm focus:border-accent focus:outline-none resize-none"
                  />
                  <div className="flex justify-between items-center text-[11px] text-text-muted mt-1 px-1">
                    <span>Word Count: {prompt.trim() ? prompt.trim().split(/\s+/).length : 0}</span>
                    <span>Be precise & detailed</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-contrast hover:bg-accent-strong disabled:opacity-50 transition-all active:scale-98 shadow-md"
                >
                  <Send className="h-4 w-4" /> Submit Prompt for Score
                </button>
              </form>
            </GlassCard>
          ) : (
            <GlassCard className="p-6 space-y-6 border-accent/40 bg-surface/90">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h3 className="font-display font-bold text-base">Score Locked</h3>
                    <p className="text-xs text-text-muted">Round {room.currentChallengeIndex + 1} submission recorded!</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-2xl text-accent">
                    {result ? result.overallScore : existingSubmission?.score ?? 0}
                  </span>
                  <span className="text-xs text-text-muted font-bold block">/ 100 PTS</span>
                </div>
              </div>

              {/* Dimension Score Bars */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Score Breakdown</h4>
                {(result?.dimensions || existingSubmission?.dimensions || []).map((dim) => (
                  <ScoreBar key={dim.key} label={dim.label} score={dim.score} />
                ))}
              </div>

              {/* Tutor Feedback */}
              {result?.tutorFeedback && (
                <div className="p-3.5 rounded-lg border border-border bg-bg/80 text-xs leading-relaxed text-text-muted">
                  <p className="font-semibold text-text mb-1 flex items-center gap-1 text-accent">
                    <Sparkles className="h-3.5 w-3.5" /> Evaluator Feedback
                  </p>
                  {result.tutorFeedback}
                </div>
              )}

              {/* Actions & Next Round */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={onViewLeaderboard}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-surface border border-border-strong py-2.5 text-xs font-semibold hover:bg-surface-2 transition-colors"
                >
                  <Trophy className="h-4 w-4 text-warning" /> View Live Event Leaderboard
                </button>

                {isHost && (
                  <button
                    onClick={handleNextRound}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-contrast hover:bg-accent-strong transition-all shadow-md"
                  >
                    <span>
                      {room.currentChallengeIndex + 1 < room.challengeIds.length
                        ? `Advance to Round ${room.currentChallengeIndex + 2}`
                        : "Finish Event & View Final Results"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
