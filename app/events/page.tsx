"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, Plus, LogIn, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CreateRoomModal } from "@/components/events/create-room-modal";
import { JoinRoomModal } from "@/components/events/join-room-modal";

export default function EventsHubPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Hero Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1 text-xs font-semibold text-accent mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Group Events & Closed Competitions
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Compete Together in Real-Time
        </h1>
        <p className="text-text-muted text-base max-w-2xl mx-auto leading-relaxed">
          Host prompt engineering competitions for workshops, team events, or hackathons. Create a group room, invite friends or colleagues, and track live scores on an event leaderboard.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Create Room Card */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <GlassCard className="p-8 h-full flex flex-col justify-between border-accent/30 hover:border-accent transition-colors bg-gradient-to-b from-surface via-surface to-accent-soft/20">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-contrast mb-6 shadow-md">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Host a Competition</h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Set up a private competition room with custom challenge playlists, timer limits, and generate a 6-character room code for your audience.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-accent-contrast hover:bg-accent-strong transition-all shadow-md active:scale-98"
            >
              <Plus className="h-4 w-4" /> Create New Room
            </button>
          </GlassCard>
        </motion.div>

        {/* Join Room Card */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <GlassCard className="p-8 h-full flex flex-col justify-between border-border-strong hover:border-accent transition-colors">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-accent border border-border-strong mb-6">
                <LogIn className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Join an Event</h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Have an event code from a host? Enter the room code to join the lobby and compete with other participants in real time.
              </p>
            </div>

            <button
              onClick={() => setShowJoin(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-border-strong py-3.5 text-sm font-bold hover:bg-surface-2 transition-all active:scale-98"
            >
              <span>Enter Room Code</span>
              <ArrowRight className="h-4 w-4 text-accent" />
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Feature Highlights */}
      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <GlassCard className="p-5">
          <span className="text-2xl mb-2 block">⏱️</span>
          <h3 className="font-display font-semibold text-sm mb-1">Timed Round Competition</h3>
          <p className="text-xs text-text-muted">Enforce round timers to keep event rounds fast, fun, and competitive.</p>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-2xl mb-2 block">📊</span>
          <h3 className="font-display font-semibold text-sm mb-1">Live Synchronized Scoreboard</h3>
          <p className="text-xs text-text-muted">Real-time leaderboard updates across all participant screens as scores get locked.</p>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-2xl mb-2 block">📥</span>
          <h3 className="font-display font-semibold text-sm mb-1">Exportable Event CSV</h3>
          <p className="text-xs text-text-muted">Download full participant standings and round scores for event management reporting.</p>
        </GlassCard>
      </div>

      {/* Modals */}
      <CreateRoomModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <JoinRoomModal isOpen={showJoin} onClose={() => setShowJoin(false)} />
    </div>
  );
}
