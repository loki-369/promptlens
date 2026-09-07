"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Challenge, DimensionScore, HistoryEntry, UserProfile } from "./types";
import { useHydrated } from "./use-hydrated";

const PROFILE_KEY = "promptlens.profile.v1";
const DRAFT_KEY_PREFIX = "promptlens.draft.";
const PROFILE_EVENT = "promptlens:profile-updated";
const DRAFT_EVENT = "promptlens:draft-updated";

const DEFAULT_PROFILE: UserProfile = {
  name: "You",
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  history: [],
  achievements: [],
  hintsUsedTotal: 0,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readProfile(): UserProfile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

let profileCache: UserProfile | null = null;

function getProfileSnapshot(): UserProfile {
  if (!profileCache) profileCache = readProfile();
  return profileCache;
}

function getProfileServerSnapshot(): UserProfile {
  return DEFAULT_PROFILE;
}

function persistProfile(profile: UserProfile) {
  profileCache = profile;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

function subscribeProfile(callback: () => void) {
  const onUpdate = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === PROFILE_KEY) {
      profileCache = readProfile();
      callback();
    }
  };
  window.addEventListener(PROFILE_EVENT, onUpdate);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROFILE_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

/** Non-hook accessor, safe to call outside components (e.g. one-off reads). */
export function loadProfile(): UserProfile {
  return getProfileSnapshot();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string) {
  const d = new Date(dateStr);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.toISOString().slice(0, 10) === y.toISOString().slice(0, 10);
}

const ACHIEVEMENT_DEFS: { id: string; label: string; icon: string; check: (p: UserProfile) => boolean }[] = [
  { id: "streak-3", label: "Prompt Streak", icon: "🔥", check: (p) => p.streak >= 3 },
  { id: "score-90", label: "90+ Score", icon: "🎯", check: (p) => p.history.some((h) => h.score >= 90) },
  { id: "prompt-master", label: "Prompt Master", icon: "🧠", check: (p) => p.history.length >= 10 },
  { id: "speed-demon", label: "Speed Demon", icon: "⚡", check: (p) => p.history.length >= 1 },
  { id: "top-10", label: "Top 10", icon: "🏆", check: (p) => p.xp >= 9000 },
];

export interface RecordAttemptInput {
  challenge: Challenge;
  score: number;
  dimensions: DimensionScore[];
  xpEarned: number;
  hintsUsed: number;
}

export function recordAttempt(input: RecordAttemptInput): UserProfile {
  const profile = getProfileSnapshot();
  const { challenge, score, dimensions, xpEarned, hintsUsed } = input;

  const existing = profile.history.filter((h) => h.challengeId === challenge.id);
  const attempts = existing.length + 1;
  const bestScore = Math.max(score, ...existing.map((h) => h.bestScore), 0);

  const entry: HistoryEntry = {
    challengeId: challenge.id,
    challengeNumber: challenge.number,
    score,
    bestScore,
    attempts,
    playedAt: new Date().toISOString(),
    difficulty: challenge.difficulty,
    category: challenge.category,
    dimensions,
  };

  const today = todayStr();
  let streak = profile.streak;
  if (profile.lastPlayedDate !== today) {
    if (profile.lastPlayedDate && isYesterday(profile.lastPlayedDate)) {
      streak = profile.streak + 1;
    } else {
      streak = 1;
    }
  }

  const updated: UserProfile = {
    ...profile,
    xp: profile.xp + xpEarned,
    streak,
    lastPlayedDate: today,
    history: [...profile.history, entry].slice(-200),
    hintsUsedTotal: profile.hintsUsedTotal + hintsUsed,
  };

  const unlocked = ACHIEVEMENT_DEFS.filter((a) => a.check(updated) && !updated.achievements.includes(a.id)).map(
    (a) => a.id
  );
  updated.achievements = [...updated.achievements, ...unlocked];

  persistProfile(updated);
  return updated;
}

export function resetProfile() {
  persistProfile(DEFAULT_PROFILE);
}

export function useProfile() {
  const profile = useSyncExternalStore(subscribeProfile, getProfileSnapshot, getProfileServerSnapshot);
  const hydrated = useHydrated();

  const submit = useCallback((input: RecordAttemptInput) => recordAttempt(input), []);

  return { profile, hydrated, submit };
}

// ---- Draft prompt autosave -------------------------------------------

const draftCache = new Map<string, string>();

function readDraft(key: string): string {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeDraft(key: string, value: string) {
  draftCache.set(key, value);
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(DRAFT_EVENT, { detail: key }));
}

function clearDraftStorage(key: string) {
  draftCache.delete(key);
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(DRAFT_EVENT, { detail: key }));
}

export function useDraftPrompt(challengeId: string) {
  const key = `${DRAFT_KEY_PREFIX}${challengeId}`;

  const getSnapshot = useCallback(() => {
    if (!draftCache.has(key)) draftCache.set(key, readDraft(key));
    return draftCache.get(key)!;
  }, [key]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const onDraftUpdate = (e: Event) => {
        const detail = (e as CustomEvent<string>).detail;
        if (detail === key) callback();
      };
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          draftCache.set(key, readDraft(key));
          callback();
        }
      };
      window.addEventListener(DRAFT_EVENT, onDraftUpdate);
      window.addEventListener("storage", onStorage);
      return () => {
        window.removeEventListener(DRAFT_EVENT, onDraftUpdate);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key]
  );

  const draft = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const loaded = useHydrated();

  const setDraft = useCallback((value: string) => writeDraft(key, value), [key]);
  const clearDraft = useCallback(() => clearDraftStorage(key), [key]);

  return { draft, setDraft, clearDraft, loaded };
}

export const ACHIEVEMENTS = ACHIEVEMENT_DEFS;
