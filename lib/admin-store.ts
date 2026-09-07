"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Category, Challenge, ConceptTarget, Difficulty, ScoreDimensionKey } from "./types";
import { useHydrated } from "./use-hydrated";

const STORE_KEY = "promptlens.admin.challenges.v1";
const ADMIN_EVENT = "promptlens:admin-updated";

const DIMENSION_CYCLE: ScoreDimensionKey[] = [
  "subject",
  "environment",
  "composition",
  "lighting",
  "color",
  "style",
  "camera",
  "mood",
  "specificity",
];

function isBrowser() {
  return typeof window !== "undefined";
}

function readFromStorage(): Challenge[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Challenge[]) : [];
  } catch {
    return [];
  }
}

let cache: Challenge[] | null = null;
const EMPTY: Challenge[] = [];

function getSnapshot(): Challenge[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function getServerSnapshot(): Challenge[] {
  return EMPTY;
}

function persist(list: Challenge[]) {
  cache = list;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(list));
    } catch {
      // ignore quota errors
    }
  }
  window.dispatchEvent(new Event(ADMIN_EVENT));
}

function subscribe(callback: () => void) {
  const onUpdate = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) {
      cache = readFromStorage();
      callback();
    }
  };
  window.addEventListener(ADMIN_EVENT, onUpdate);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(ADMIN_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

/** Non-hook accessor for use outside components. */
export function loadCustomChallenges(): Challenge[] {
  return getSnapshot();
}

/** Turns a comma-separated list of key visual elements into a scorable concept set. */
export function deriveConceptsFromKeywords(keywords: string[]): ConceptTarget[] {
  return keywords
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((phrase, i) => {
      const dimension = DIMENSION_CYCLE[i % DIMENSION_CYCLE.length];
      const weight: ConceptTarget["weight"] = i < 2 ? 3 : i < 5 ? 2 : 1;
      return {
        id: `custom-${i}-${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
        label: phrase.charAt(0).toUpperCase() + phrase.slice(1),
        dimension,
        weight,
        synonyms: [phrase.toLowerCase()],
        strongPhrase: phrase,
      };
    });
}

export interface NewChallengeInput {
  image: string;
  imageAlt: string;
  originalPrompt: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  keywords: string[];
  creator: string;
  badPrompt?: string;
}

export function createChallenge(input: NewChallengeInput): Challenge {
  const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const list = getSnapshot();
  const nextNumber = 100 + list.length;
  return {
    id,
    number: nextNumber,
    image: input.image,
    imageAlt: input.imageAlt || "A community-submitted challenge image",
    originalPrompt: input.originalPrompt,
    difficulty: input.difficulty,
    category: input.category,
    tags: input.tags,
    creator: input.creator || "Community",
    createdAt: new Date().toISOString().slice(0, 10),
    concepts: deriveConceptsFromKeywords(input.keywords),
    hints: [
      { cost: 3, text: "Focus on the lighting and overall mood." },
      { cost: 6, text: "Think about the photography or art style being used." },
      { cost: 10, text: "Consider the composition and camera framing." },
    ],
    badPrompt: input.badPrompt,
    published: false,
  };
}

export function addCustomChallenge(input: NewChallengeInput): Challenge {
  const challenge = createChallenge(input);
  persist([...getSnapshot(), challenge]);
  return challenge;
}

export function togglePublished(id: string) {
  persist(getSnapshot().map((c) => (c.id === id ? { ...c, published: !c.published } : c)));
}

export function deleteCustomChallenge(id: string) {
  persist(getSnapshot().filter((c) => c.id !== id));
}

export function useAdminChallenges() {
  const challenges = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();

  const create = useCallback((input: NewChallengeInput) => addCustomChallenge(input), []);
  const toggle = useCallback((id: string) => togglePublished(id), []);
  const remove = useCallback((id: string) => deleteCustomChallenge(id), []);

  return { challenges, hydrated, create, toggle, remove };
}
