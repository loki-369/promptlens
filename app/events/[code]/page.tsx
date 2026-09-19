"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, Trophy, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useEventRoom } from "@/lib/event-store";
import { EventLobby } from "@/components/events/event-lobby";
import { EventGame } from "@/components/events/event-game";
import { EventLeaderboard } from "@/components/events/event-leaderboard";
import { JoinRoomModal } from "@/components/events/join-room-modal";

export default function EventRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const cleanCode = code.toUpperCase().trim();

  const { room, hydrated } = useEventRoom(cleanCode);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = window.sessionStorage.getItem(`promptlens.event.${cleanCode}.participantId`);
      setParticipantId(storedId);
    }
  }, [cleanCode]);

  // If user opens a direct link without joining
  useEffect(() => {
    if (hydrated && room && !participantId) {
      setShowJoinModal(true);
    }
  }, [hydrated, room, participantId]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-accent border-t-transparent mb-4" />
        <p className="text-sm font-semibold text-text-muted">Loading Competition Room...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <GlassCard className="p-8">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-500/20 text-red-400 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Room Not Found</h1>
          <p className="text-xs text-text-muted mb-6">
            No competition room found with code <span className="font-mono font-bold text-accent">{cleanCode}</span>. Please verify the code with your event host.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-bold text-accent-contrast hover:bg-accent-strong transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Group Events
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Lobby mode
  if (room.status === "lobby") {
    return (
      <>
        <EventLobby room={room} currentParticipantId={participantId} />
        <JoinRoomModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          defaultCode={cleanCode}
        />
      </>
    );
  }

  // Active or Completed mode
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      {/* View Toggle Bar (Game vs Scoreboard) */}
      {room.status === "active" && (
        <div className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-16 z-40">
          <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("game")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === "game"
                    ? "bg-accent text-accent-contrast"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                🎮 Game Round
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === "leaderboard"
                    ? "bg-accent text-accent-contrast"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                <Trophy className="h-3.5 w-3.5 text-warning" /> Live Scoreboard
              </button>
            </div>

            <span className="text-[11px] font-mono text-text-muted">
              CODE: <span className="font-bold text-accent">{room.code}</span>
            </span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {room.status === "completed" || activeTab === "leaderboard" ? (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EventLeaderboard
              room={room}
              currentParticipantId={participantId}
              onBackToGame={() => setActiveTab("game")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EventGame
              room={room}
              currentParticipantId={participantId}
              onViewLeaderboard={() => setActiveTab("leaderboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        defaultCode={cleanCode}
      />
    </div>
  );
}
