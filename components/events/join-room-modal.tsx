"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, ArrowRight, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { joinEventRoom, readEventRoom } from "@/lib/event-store";
import { useProfile } from "@/lib/store";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCode?: string;
}

export function JoinRoomModal({ isOpen, onClose, defaultCode = "" }: JoinRoomModalProps) {
  const router = useRouter();
  const { profile } = useProfile();

  const [code, setCode] = useState(defaultCode);
  const [name, setName] = useState(profile.name !== "You" ? profile.name : "");
  const [error, setError] = useState<string | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanCode || cleanCode.length < 4) {
      setError("Please enter a valid 6-character room code.");
      return;
    }

    if (!cleanName) {
      setError("Please enter your nickname.");
      return;
    }

    const room = readEventRoom(cleanCode);
    if (!room) {
      setError(`No competition room found with code "${cleanCode}". Make sure the host has created it.`);
      return;
    }

    const participant = joinEventRoom(cleanCode, cleanName);
    if (participant && typeof window !== "undefined") {
      window.sessionStorage.setItem(`promptlens.event.${cleanCode}.participantId`, participant.id);
    }

    onClose();
    router.push(`/events/${cleanCode}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            className="relative w-full max-w-md z-10 my-auto"
          >
            <GlassCard className="p-6 sm:p-8 overflow-hidden shadow-2xl border-accent/30">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/40">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">Join Group Competition</h2>
                    <p className="text-xs text-text-muted">Enter event code to enter room lobby</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleJoin} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LENS99"
                    className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-accent uppercase focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Your Player Nickname
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                  />
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
                    Enter Room <ArrowRight className="h-4 w-4" />
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
