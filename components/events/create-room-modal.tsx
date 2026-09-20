"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Trophy, Clock, Layers } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CHALLENGES } from "@/data/challenges";
import { createEventRoomAsync } from "@/lib/event-store";
import { useProfile } from "@/lib/store";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMER_OPTIONS = [
  { label: "2 Minutes", seconds: 120 },
  { label: "3 Minutes", seconds: 180 },
  { label: "5 Minutes", seconds: 300 },
  { label: "10 Minutes", seconds: 600 },
  { label: "Unlimited", seconds: 0 },
];

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const { profile } = useProfile();

  const [eventName, setEventName] = useState("Prompt Masters League");
  const [hostName, setHostName] = useState(profile.name !== "You" ? profile.name : "Host Player");
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [selectedChallengeIds, setSelectedChallengeIds] = useState<string[]>(
    CHALLENGES.slice(0, 3).map((c) => c.id)
  );

  const toggleChallenge = (id: string) => {
    setSelectedChallengeIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    setSelectedChallengeIds(CHALLENGES.map((c) => c.id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !hostName.trim() || selectedChallengeIds.length === 0) return;

    const { room, hostParticipantId } = await createEventRoomAsync({
      name: eventName,
      hostName,
      challengeIds: selectedChallengeIds,
      timeLimitSeconds: timerSeconds,
    });

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`promptlens.event.${room.code}.participantId`, hostParticipantId);
    }

    onClose();
    router.push(`/events/${room.code}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl z-10 my-auto"
          >
            <GlassCard className="p-6 sm:p-8 overflow-hidden shadow-2xl border-accent/30">
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/40">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">Host Group Competition</h2>
                    <p className="text-xs text-text-muted">Create a private event room with custom rounds & rules</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-6 flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Design Team Battle Round 1"
                    className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      Host Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      placeholder="Your Nickname"
                      className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-accent" /> Round Time Limit
                    </label>
                    <select
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(Number(e.target.value))}
                      className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                    >
                      {TIMER_OPTIONS.map((opt) => (
                        <option key={opt.seconds} value={opt.seconds}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-accent" /> Select Rounds ({selectedChallengeIds.length} chosen)
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs text-accent hover:underline"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar rounded-lg border border-border-strong bg-surface/50 p-2">
                    {CHALLENGES.map((ch) => {
                      const selected = selectedChallengeIds.includes(ch.id);
                      return (
                        <div
                          key={ch.id}
                          onClick={() => toggleChallenge(ch.id)}
                          className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer text-xs transition-colors border ${
                            selected
                              ? "bg-accent-soft border-accent/50 text-text"
                              : "bg-surface border-border hover:bg-surface-2 text-text-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-accent">#{ch.number}</span>
                            <span className="font-medium truncate max-w-[240px]">{ch.imageAlt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded border border-border bg-bg text-text-faint">
                              {ch.difficulty}
                            </span>
                            <span className="text-accent font-bold">{selected ? "✓" : "+"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast hover:bg-accent-strong transition-colors"
                  >
                    <Sparkles className="h-4 w-4" /> Create Room & Launch
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
