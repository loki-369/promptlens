"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Download, ChevronRight, Crown, Sparkles, RefreshCw, Layers, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { type EventRoom, exportEventCsv, nextEventRound, endEventCompetition } from "@/lib/event-store";
import { avatarColor, formatNumber } from "@/lib/utils";

interface EventLeaderboardProps {
  room: EventRoom;
  currentParticipantId?: string | null;
  onBackToGame?: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function EventLeaderboard({ room, currentParticipantId, onBackToGame }: EventLeaderboardProps) {
  const currentParticipant = room.participants.find((p) => p.id === currentParticipantId);
  const isHost = currentParticipant?.isHost || room.hostId === currentParticipantId;

  // Calculate aggregated stats per participant across all submissions
  const standings = useMemo(() => {
    return room.participants.map((p) => {
      const pSubmissions = room.submissions.filter((s) => s.participantId === p.id);
      const totalScore = pSubmissions.reduce((acc, s) => acc + s.score, 0);
      const totalXp = pSubmissions.reduce((acc, s) => acc + s.xpEarned, 0);
      const avgScore = pSubmissions.length > 0 ? (totalScore / pSubmissions.length).toFixed(1) : "0";
      const bestScore = pSubmissions.length > 0 ? Math.max(...pSubmissions.map((s) => s.score)) : 0;

      return {
        ...p,
        totalScore,
        totalXp,
        avgScore: Number(avgScore),
        bestScore,
        submissionsCount: pSubmissions.length,
        isYou: p.id === currentParticipantId,
      };
    }).sort((a, b) => b.totalScore - a.totalScore || b.avgScore - a.avgScore || b.totalXp - a.totalXp);
  }, [room.participants, room.submissions, currentParticipantId]);

  const top3 = standings.slice(0, 3);

  const handleExportCsv = () => {
    exportEventCsv(room);
  };

  const handleNextRound = () => {
    nextEventRound(room.code);
  };

  const handleEndEvent = () => {
    endEventCompetition(room.code);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBackToGame}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Game Round
          </button>
          <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-7 w-7 text-warning" /> {room.name} Scoreboard
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Status: <span className="font-semibold capitalize text-accent">{room.status}</span> · Code: <span className="font-mono font-bold">{room.code}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-text hover:bg-surface-2 transition-colors"
          >
            <Download className="h-4 w-4 text-accent" /> Export CSV
          </button>
        </div>
      </div>

      {/* Winner Banner if Event Finished */}
      {room.status === "completed" && top3[0] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-2xl border border-warning/50 bg-gradient-to-r from-warning/20 via-amber-500/10 to-warning/20 text-center relative overflow-hidden shadow-xl"
        >
          <div className="flex justify-center mb-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/20 border-2 border-warning text-3xl shadow-lg">
              👑
            </span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-warning mb-1">
            {top3[0].name} Wins the Competition!
          </h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Achieved a total score of <span className="font-bold text-text">{top3[0].totalScore} PTS</span> across {top3[0].submissionsCount} round{top3[0].submissionsCount > 1 ? "s" : ""}.
          </p>
        </motion.div>
      )}

      {/* Top 3 Podium Visual */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 items-end max-w-2xl mx-auto">
          {/* Silver 2nd Place */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl mb-1">🥈</span>
              <GlassCard className="w-full p-4 text-center bg-surface/80 border-slate-400/40">
                <span
                  className="h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold text-white mb-2 shadow-md"
                  style={{ background: avatarColor(top3[1].avatarSeed) }}
                >
                  {top3[1].name.charAt(0).toUpperCase()}
                </span>
                <p className="font-display font-bold text-xs sm:text-sm truncate">{top3[1].name}</p>
                <p className="font-mono font-bold text-xs text-accent mt-1">{top3[1].totalScore} pts</p>
              </GlassCard>
              <div className="w-full h-16 bg-slate-500/20 border-t border-slate-400/30 rounded-t-lg mt-2 flex items-center justify-center text-xs font-bold text-slate-400">
                2nd
              </div>
            </motion.div>
          )}

          {/* Gold 1st Place */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl mb-1 animate-bounce">🥇</span>
              <GlassCard className="w-full p-5 text-center bg-surface border-warning/60 shadow-lg shadow-warning/10">
                <span
                  className="h-12 w-12 mx-auto rounded-full flex items-center justify-center text-base font-bold text-white mb-2 ring-2 ring-warning shadow-md"
                  style={{ background: avatarColor(top3[0].avatarSeed) }}
                >
                  {top3[0].name.charAt(0).toUpperCase()}
                </span>
                <p className="font-display font-bold text-sm sm:text-base text-warning truncate">{top3[0].name}</p>
                <p className="font-mono font-bold text-sm text-accent mt-1">{top3[0].totalScore} pts</p>
              </GlassCard>
              <div className="w-full h-24 bg-warning/20 border-t-2 border-warning/50 rounded-t-lg mt-2 flex items-center justify-center text-sm font-bold text-warning">
                1st
              </div>
            </motion.div>
          )}

          {/* Bronze 3rd Place */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl mb-1">🥉</span>
              <GlassCard className="w-full p-4 text-center bg-surface/80 border-amber-700/40">
                <span
                  className="h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold text-white mb-2 shadow-md"
                  style={{ background: avatarColor(top3[2].avatarSeed) }}
                >
                  {top3[2].name.charAt(0).toUpperCase()}
                </span>
                <p className="font-display font-bold text-xs sm:text-sm truncate">{top3[2].name}</p>
                <p className="font-mono font-bold text-xs text-accent mt-1">{top3[2].totalScore} pts</p>
              </GlassCard>
              <div className="w-full h-12 bg-amber-700/20 border-t border-amber-600/30 rounded-t-lg mt-2 flex items-center justify-center text-xs font-bold text-amber-500">
                3rd
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Standings Table */}
      <GlassCard className="overflow-hidden mb-8">
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-2">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" /> Full Participant Rankings ({standings.length})
          </h2>
          <span className="text-xs text-text-muted">Updated in real-time</span>
        </div>

        <div className="divide-y divide-border">
          {standings.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex items-center gap-3 sm:gap-4 px-5 py-3.5 ${
                entry.isYou ? "bg-accent-soft/40 border-l-2 border-accent" : ""
              }`}
            >
              <span className="w-6 text-center font-display font-bold text-text-muted text-sm shrink-0">
                {idx < 3 ? MEDALS[idx] : idx + 1}
              </span>

              <span
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: avatarColor(entry.avatarSeed) }}
              >
                {entry.name.charAt(0).toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate flex items-center gap-1.5 ${entry.isYou ? "text-accent font-bold" : ""}`}>
                  {entry.name}
                  {entry.isHost && <Crown className="h-3 w-3 text-warning shrink-0" />}
                  {entry.isYou && <span className="text-[10px] text-text-faint">(you)</span>}
                </p>
                <p className="text-[10px] text-text-muted">
                  {entry.submissionsCount} round{entry.submissionsCount > 1 ? "s" : ""} completed · Avg: {entry.avgScore} pts
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-sm text-text tabular-nums">{entry.totalScore}</span>
                <span className="text-[10px] text-text-muted block">PTS</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Host Action Footer */}
      {isHost && room.status !== "completed" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-accent/40 bg-surface shadow-lg">
          <div>
            <p className="text-sm font-semibold">Host Competition Controls</p>
            <p className="text-xs text-text-muted">
              Advance all players to the next challenge or complete the event.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleEndEvent}
              className="flex-1 sm:flex-initial rounded-lg border border-border-strong px-4 py-2.5 text-xs font-semibold hover:bg-surface-2 transition-colors"
            >
              End Event Now
            </button>

            {room.currentChallengeIndex + 1 < room.challengeIds.length && (
              <button
                onClick={handleNextRound}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-xs font-bold text-accent-contrast hover:bg-accent-strong transition-colors"
              >
                <span>Advance to Round {room.currentChallengeIndex + 2}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
