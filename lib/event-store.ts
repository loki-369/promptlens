"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { DimensionScore } from "./types";
import { useHydrated } from "./use-hydrated";

export type EventStatus = "lobby" | "active" | "completed";

export interface EventParticipant {
  id: string;
  name: string;
  avatarSeed: string;
  isHost: boolean;
  joinedAt: string;
}

export interface EventSubmission {
  id: string;
  roomId: string;
  challengeId: string;
  participantId: string;
  participantName: string;
  prompt: string;
  score: number;
  dimensions: DimensionScore[];
  xpEarned: number;
  hintsUsed: number;
  submittedAt: string;
}

export interface EventRoom {
  id: string;
  code: string; // 6 char uppercase alphanumeric code
  name: string;
  hostId: string;
  hostName: string;
  status: EventStatus;
  challengeIds: string[];
  currentChallengeIndex: number;
  timeLimitSeconds: number; // 0 = unlimited
  roundStartedAt?: string;
  createdAt: string;
  participants: EventParticipant[];
  submissions: EventSubmission[];
}

const STORAGE_KEY_PREFIX = "promptlens.event.room.";
const EVENT_BROADCAST_NAME = "promptlens_events_channel";
const EVENT_LOCAL_DISPATCH = "promptlens:event-room-updated";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

let broadcastChannel: BroadcastChannel | null = null;
if (isBrowser() && typeof BroadcastChannel !== "undefined") {
  try {
    broadcastChannel = new BroadcastChannel(EVENT_BROADCAST_NAME);
  } catch {
    // fallback to storage events
  }
}

function getRoomStorageKey(code: string): string {
  return `${STORAGE_KEY_PREFIX}${code.toUpperCase().trim()}`;
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function readEventRoom(code: string): EventRoom | null {
  if (!isBrowser() || !code) return null;
  try {
    const raw = window.localStorage.getItem(getRoomStorageKey(code));
    if (!raw) return null;
    return JSON.parse(raw) as EventRoom;
  } catch {
    return null;
  }
}

export function persistEventRoom(room: EventRoom): void {
  if (!isBrowser()) return;
  const key = getRoomStorageKey(room.code);
  try {
    window.localStorage.setItem(key, JSON.stringify(room));
  } catch {
    // quota error fallback
  }

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "ROOM_UPDATED", code: room.code });
    } catch {
      // channel closed
    }
  }

  window.dispatchEvent(new CustomEvent(EVENT_LOCAL_DISPATCH, { detail: room.code }));
}

// Global cached snapshots for useSyncExternalStore
const roomCache = new Map<string, EventRoom | null>();

function getRoomSnapshot(code: string): EventRoom | null {
  const upper = code.toUpperCase().trim();
  if (!roomCache.has(upper)) {
    roomCache.set(upper, readEventRoom(upper));
  }
  return roomCache.get(upper) ?? null;
}

function subscribeRoom(code: string, callback: () => void) {
  const upper = code.toUpperCase().trim();

  const handleUpdate = (updatedCode: string) => {
    if (updatedCode === upper) {
      roomCache.set(upper, readEventRoom(upper));
      callback();
    }
  };

  const onLocalEvent = (e: Event) => {
    const detail = (e as CustomEvent<string>).detail;
    handleUpdate(detail);
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === getRoomStorageKey(upper)) {
      handleUpdate(upper);
    }
  };

  const onBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.code === upper) {
      handleUpdate(upper);
    }
  };

  window.addEventListener(EVENT_LOCAL_DISPATCH, onLocalEvent);
  window.addEventListener("storage", onStorage);
  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", onBroadcast);
  }

  return () => {
    window.removeEventListener(EVENT_LOCAL_DISPATCH, onLocalEvent);
    window.removeEventListener("storage", onStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", onBroadcast);
    }
  };
}

export function useEventRoom(code: string) {
  const hydrated = useHydrated();
  const upper = code?.toUpperCase().trim() || "";

  const getSnapshot = useCallback(() => getRoomSnapshot(upper), [upper]);
  const subscribe = useCallback((cb: () => void) => subscribeRoom(upper, cb), [upper]);

  const room = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return { room, hydrated };
}

// --- Action API Functions ---

export interface CreateRoomInput {
  name: string;
  hostName: string;
  challengeIds: string[];
  timeLimitSeconds?: number;
}

export function createEventRoom(input: CreateRoomInput): { room: EventRoom; hostParticipantId: string } {
  const code = generateRoomCode();
  const hostId = generateId();

  const hostParticipant: EventParticipant = {
    id: hostId,
    name: input.hostName.trim() || "Host",
    avatarSeed: hostId,
    isHost: true,
    joinedAt: new Date().toISOString(),
  };

  const room: EventRoom = {
    id: generateId(),
    code,
    name: input.name.trim() || "Prompt Engineering Competition",
    hostId,
    hostName: hostParticipant.name,
    status: "lobby",
    challengeIds: input.challengeIds,
    currentChallengeIndex: 0,
    timeLimitSeconds: input.timeLimitSeconds ?? 300,
    createdAt: new Date().toISOString(),
    participants: [hostParticipant],
    submissions: [],
  };

  persistEventRoom(room);
  return { room, hostParticipantId: hostId };
}

export function joinEventRoom(code: string, participantName: string): EventParticipant | null {
  const room = readEventRoom(code);
  if (!room) return null;

  const existing = room.participants.find(
    (p) => p.name.toLowerCase().trim() === participantName.toLowerCase().trim()
  );
  if (existing) return existing;

  const newId = generateId();
  const newParticipant: EventParticipant = {
    id: newId,
    name: participantName.trim() || `Player ${room.participants.length + 1}`,
    avatarSeed: newId,
    isHost: false,
    joinedAt: new Date().toISOString(),
  };

  room.participants.push(newParticipant);
  persistEventRoom(room);
  return newParticipant;
}

export function startEventCompetition(code: string): boolean {
  const room = readEventRoom(code);
  if (!room) return false;

  room.status = "active";
  room.currentChallengeIndex = 0;
  room.roundStartedAt = new Date().toISOString();
  persistEventRoom(room);
  return true;
}

export function nextEventRound(code: string): boolean {
  const room = readEventRoom(code);
  if (!room) return false;

  if (room.currentChallengeIndex + 1 < room.challengeIds.length) {
    room.currentChallengeIndex += 1;
    room.roundStartedAt = new Date().toISOString();
  } else {
    room.status = "completed";
  }
  persistEventRoom(room);
  return true;
}

export function endEventCompetition(code: string): boolean {
  const room = readEventRoom(code);
  if (!room) return false;

  room.status = "completed";
  persistEventRoom(room);
  return true;
}

export function submitEventScore(
  code: string,
  participantId: string,
  participantName: string,
  challengeId: string,
  prompt: string,
  score: number,
  dimensions: DimensionScore[],
  xpEarned: number,
  hintsUsed: number
): EventSubmission | null {
  const room = readEventRoom(code);
  if (!room) return null;

  // Check if participant already submitted for this challenge round
  const existingIdx = room.submissions.findIndex(
    (s) => s.participantId === participantId && s.challengeId === challengeId
  );

  const submission: EventSubmission = {
    id: existingIdx >= 0 ? room.submissions[existingIdx].id : generateId(),
    roomId: room.id,
    challengeId,
    participantId,
    participantName,
    prompt,
    score,
    dimensions,
    xpEarned,
    hintsUsed,
    submittedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    room.submissions[existingIdx] = submission;
  } else {
    room.submissions.push(submission);
  }

  persistEventRoom(room);
  return submission;
}

export function exportEventCsv(room: EventRoom): void {
  if (!isBrowser()) return;

  const headers = ["Rank", "Participant Name", "Role", "Total XP", "Submissions Count", "Average Score", "Best Score"];
  
  // Calculate stats per participant
  const stats = room.participants.map((p) => {
    const pSubmissions = room.submissions.filter((s) => s.participantId === p.id);
    const totalScore = pSubmissions.reduce((acc, s) => acc + s.score, 0);
    const bestScore = pSubmissions.length > 0 ? Math.max(...pSubmissions.map((s) => s.score)) : 0;
    const avgScore = pSubmissions.length > 0 ? (totalScore / pSubmissions.length).toFixed(1) : "0";
    const totalXp = pSubmissions.reduce((acc, s) => acc + s.xpEarned, 0);

    return {
      name: p.name,
      role: p.isHost ? "Host" : "Participant",
      totalXp,
      submissionsCount: pSubmissions.length,
      avgScore,
      bestScore,
    };
  });

  stats.sort((a, b) => b.totalXp - a.totalXp || Number(b.avgScore) - Number(a.avgScore));

  const rows = stats.map((s, idx) => [
    idx + 1,
    `"${s.name.replace(/"/g, '""')}"`,
    s.role,
    s.totalXp,
    s.submissionsCount,
    s.avgScore,
    s.bestScore,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${room.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_results.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
