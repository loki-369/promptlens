"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
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

// Global cached snapshots for useSyncExternalStore
const roomCache = new Map<string, EventRoom | null>();
const roomRawCache = new Map<string, string>();

export function persistEventRoom(room: EventRoom): void {
  if (!isBrowser()) return;
  const upperCode = room.code.toUpperCase().trim();
  const key = getRoomStorageKey(upperCode);
  const raw = JSON.stringify(room);

  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // quota error fallback
  }

  // Update in-memory cache
  roomRawCache.set(upperCode, raw);
  roomCache.set(upperCode, room);

  // Immediately notify all active React useSyncExternalStore subscribers
  notifyRoomListeners(upperCode);

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "ROOM_UPDATED", code: upperCode });
    } catch {
      // channel closed
    }
  }

  window.dispatchEvent(new CustomEvent(EVENT_LOCAL_DISPATCH, { detail: upperCode }));
}

function getRoomSnapshot(code: string): EventRoom | null {
  const upper = code.toUpperCase().trim();
  if (!roomCache.has(upper)) {
    const local = readEventRoom(upper);
    if (local) {
      roomRawCache.set(upper, JSON.stringify(local));
      roomCache.set(upper, local);
    } else {
      roomCache.set(upper, null);
    }
  }
  return roomCache.get(upper) ?? null;
}

const listenersMap = new Map<string, Set<() => void>>();

function notifyRoomListeners(upperCode: string) {
  const listeners = listenersMap.get(upperCode);
  if (listeners) {
    listeners.forEach((cb) => cb());
  }
}

function subscribeRoom(code: string, callback: () => void) {
  const upper = code.toUpperCase().trim();
  if (!upper) return () => {};

  if (!listenersMap.has(upper)) {
    listenersMap.set(upper, new Set());
  }
  listenersMap.get(upper)!.add(callback);

  const handleUpdate = (updatedCode: string) => {
    if (updatedCode === upper) {
      const fresh = readEventRoom(upper);
      if (fresh) {
        const raw = JSON.stringify(fresh);
        roomRawCache.set(upper, raw);
        roomCache.set(upper, fresh);
        notifyRoomListeners(upper);
      }
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
    const listeners = listenersMap.get(upper);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        listenersMap.delete(upper);
      }
    }

    window.removeEventListener(EVENT_LOCAL_DISPATCH, onLocalEvent);
    window.removeEventListener("storage", onStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", onBroadcast);
    }
  };
}

// Fetch room state from cloud server API and update snapshot
export async function fetchServerRoom(code: string): Promise<EventRoom | null> {
  if (!isBrowser() || !code) return null;
  const upper = code.toUpperCase().trim();
  try {
    const res = await fetch(`/api/events/${upper}`);
    if (!res.ok) return null;
    const room = (await res.json()) as EventRoom;
    const raw = JSON.stringify(room);

    if (roomRawCache.get(upper) !== raw) {
      persistEventRoom(room);
    }
    return room;
  } catch {
    return null;
  }
}

export function useEventRoom(code: string) {
  const hydrated = useHydrated();
  const upper = code?.toUpperCase().trim() || "";

  const getSnapshot = useCallback(() => getRoomSnapshot(upper), [upper]);
  const subscribe = useCallback((cb: () => void) => subscribeRoom(upper, cb), [upper]);

  const room = useSyncExternalStore(subscribe, getSnapshot, () => null);

  // Fast 1s polling interval for instant cross-device synchronization without manual page refreshes
  useEffect(() => {
    if (!isBrowser() || !upper) return;

    fetchServerRoom(upper);

    const interval = setInterval(() => {
      fetchServerRoom(upper);
    }, 1000);

    return () => clearInterval(interval);
  }, [upper]);

  return { room, hydrated };
}


// --- Action API Functions ---

export interface CreateRoomInput {
  name: string;
  hostName: string;
  challengeIds: string[];
  timeLimitSeconds?: number;
}

export async function createEventRoomAsync(input: CreateRoomInput): Promise<{ room: EventRoom; hostParticipantId: string }> {
  const code = generateRoomCode();
  const hostId = generateId();
  const hostParticipant: EventParticipant = {
    id: hostId,
    name: input.hostName.trim() || "Host",
    avatarSeed: hostId,
    isHost: true,
    joinedAt: new Date().toISOString(),
  };

  const localRoom: EventRoom = {
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

  persistEventRoom(localRoom);

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, code, hostId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.room) {
        persistEventRoom(data.room);
        return data;
      }
    }
  } catch {
    // API network fallback
  }

  return { room: localRoom, hostParticipantId: hostId };
}

export function createEventRoom(input: CreateRoomInput): { room: EventRoom; hostParticipantId: string } {
  // Sync wrapper that also triggers async API registration
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

  if (isBrowser()) {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, code, hostId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.room) persistEventRoom(data.room);
      })
      .catch(() => {});
  }

  return { room, hostParticipantId: hostId };
}


export async function joinEventRoomAsync(code: string, participantName: string): Promise<EventParticipant | null> {
  const upper = code.toUpperCase().trim();
  try {
    const res = await fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", name: participantName }),
    });
    if (res.ok) {
      const data = await res.json();
      persistEventRoom(data.room);
      return data.participant;
    }
  } catch {
    // API network fallback
  }

  return joinEventRoom(code, participantName);
}

export function joinEventRoom(code: string, participantName: string): EventParticipant | null {
  const upper = code.toUpperCase().trim();
  const room = readEventRoom(upper);
  
  let participant: EventParticipant | null = null;

  if (room) {
    const existing = room.participants.find(
      (p) => p.name.toLowerCase().trim() === participantName.toLowerCase().trim()
    );
    if (existing) {
      participant = existing;
    } else {
      const newId = generateId();
      participant = {
        id: newId,
        name: participantName.trim() || `Player ${room.participants.length + 1}`,
        avatarSeed: newId,
        isHost: false,
        joinedAt: new Date().toISOString(),
      };
      room.participants.push(participant);
      persistEventRoom(room);
    }
  }

  if (isBrowser()) {
    fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", name: participantName }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.room) persistEventRoom(data.room);
      })
      .catch(() => {});
  }

  return participant;
}

export function startEventCompetition(code: string): boolean {
  const upper = code.toUpperCase().trim();
  const room = readEventRoom(upper);
  if (room) {
    room.status = "active";
    room.currentChallengeIndex = 0;
    room.roundStartedAt = new Date().toISOString();
    persistEventRoom(room);
  }

  if (isBrowser()) {
    fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.code) persistEventRoom(data);
      })
      .catch(() => {});
  }

  return true;
}

export function nextEventRound(code: string): boolean {
  const upper = code.toUpperCase().trim();
  const room = readEventRoom(upper);
  if (room) {
    if (room.currentChallengeIndex + 1 < room.challengeIds.length) {
      room.currentChallengeIndex += 1;
      room.roundStartedAt = new Date().toISOString();
    } else {
      room.status = "completed";
    }
    persistEventRoom(room);
  }

  if (isBrowser()) {
    fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "next" }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.code) persistEventRoom(data);
      })
      .catch(() => {});
  }

  return true;
}

export function endEventCompetition(code: string): boolean {
  const upper = code.toUpperCase().trim();
  const room = readEventRoom(upper);
  if (room) {
    room.status = "completed";
    persistEventRoom(room);
  }

  if (isBrowser()) {
    fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "end" }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.code) persistEventRoom(data);
      })
      .catch(() => {});
  }

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
  const upper = code.toUpperCase().trim();
  const room = readEventRoom(upper);
  
  let submission: EventSubmission | null = null;

  if (room) {
    const existingIdx = room.submissions.findIndex(
      (s) => s.participantId === participantId && s.challengeId === challengeId
    );

    submission = {
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
  }

  if (isBrowser()) {
    fetch(`/api/events/${upper}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        participantId,
        participantName,
        challengeId,
        prompt,
        score,
        dimensions,
        xpEarned,
        hintsUsed,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.room) persistEventRoom(data.room);
      })
      .catch(() => {});
  }

  return submission;
}

export function exportEventCsv(room: EventRoom): void {
  if (!isBrowser()) return;

  const headers = ["Rank", "Participant Name", "Role", "Total XP", "Submissions Count", "Average Score", "Best Score"];
  
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
