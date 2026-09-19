"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, Play, Crown, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { type EventRoom, startEventCompetition } from "@/lib/event-store";
import { avatarColor } from "@/lib/utils";

interface EventLobbyProps {
  room: EventRoom;
  currentParticipantId?: string | null;
}

export function EventLobby({ room, currentParticipantId }: EventLobbyProps) {
  const [copied, setCopied] = useState(false);

  const isHost =
    room.hostId === currentParticipantId ||
    room.participants.find((p) => p.id === currentParticipantId)?.isHost;

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStart = () => {
    startEventCompetition(room.code);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1 text-xs font-semibold text-accent mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Group Event Lobby
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2">{room.name}</h1>
        <p className="text-text-muted text-sm max-w-lg mx-auto">
          Hosted by <span className="text-text font-semibold">{room.hostName}</span> · {room.challengeIds.length} Round{room.challengeIds.length > 1 ? "s" : ""} · {room.timeLimitSeconds ? `${room.timeLimitSeconds / 60} min / round` : "Unlimited time"}
        </p>
      </div>

      {/* Room Code Callout */}
      <GlassCard className="p-6 sm:p-8 mb-8 text-center bg-surface/80 relative overflow-hidden border-accent/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Users className="h-32 w-32 text-accent" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
          Room Join Code
        </p>
        <div className="inline-flex items-center gap-4 bg-bg border border-border-strong rounded-xl px-6 py-3 shadow-inner">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-accent">
            {room.code}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/30 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-contrast transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        <p className="text-xs text-text-muted mt-3">
          Share this code with your event participants to join in real-time
        </p>
      </GlassCard>

      {/* Joined Participants Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" /> Joined Participants ({room.participants.length})
          </h2>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Waiting for host to launch
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {room.participants.map((p, idx) => {
            const isYou = p.id === currentParticipantId;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard
                  className={`p-3.5 flex items-center gap-3 transition-colors ${
                    isYou ? "border-accent bg-accent-soft/40" : "bg-surface"
                  }`}
                >
                  <span
                    className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{ background: avatarColor(p.avatarSeed) }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate flex items-center gap-1">
                      {p.name}
                      {p.isHost && <Crown className="h-3 w-3 text-warning shrink-0" />}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {isYou ? "(You)" : p.isHost ? "Event Host" : "Ready"}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border bg-surface shadow-lg">
        <div>
          <p className="text-sm font-semibold">
            {isHost ? "Ready to start the event?" : "Waiting for host..."}
          </p>
          <p className="text-xs text-text-muted">
            {isHost
              ? "Click start to transition all joined players into Round 1 simultaneously."
              : "The game will automatically launch when the host starts."}
          </p>
        </div>

        {isHost ? (
          <button
            onClick={handleStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-contrast hover:bg-accent-strong transition-all active:scale-95 shadow-md shrink-0"
          >
            <Play className="h-4 w-4 fill-current" /> Start Competition Now
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent bg-accent-soft px-4 py-2 rounded-lg border border-accent/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Connected & Waiting
          </div>
        )}
      </div>
    </div>
  );
}
