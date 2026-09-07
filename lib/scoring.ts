import type {
  Challenge,
  ConceptTarget,
  DimensionScore,
  EvaluationResult,
  MatchedConcept,
  ScoreDimensionKey,
  ScoreGroupKey,
} from "./types";
import { DIFFICULTY_XP_MULTIPLIER } from "./levels";

/**
 * PromptLens local scoring engine.
 *
 * This simulates what a vision-language "prompt evaluator" model would do:
 * look at the image's ground-truth visual attributes (encoded per challenge
 * as weighted `ConceptTarget`s with synonym sets) and semantically compare
 * them against the user's free-text prompt.
 *
 * It is deliberately NOT a bag-of-words length reward: a concept only earns
 * credit once, regardless of how many words are spent on it, and prompts
 * that pad themselves with irrelevant text get no extra score. Swap
 * `evaluateConcept` for a real LLM/embedding call to upgrade this to a true
 * AI evaluator without touching any UI code — `evaluatePrompt` is the single
 * seam the rest of the app depends on.
 */

// Fine-grained weights/labels still used internally to describe individual
// concepts (e.g. in admin tooling), but everything a player sees rolls up
// into the 3 simplified groups below.
export const DIMENSION_WEIGHTS: Record<ScoreDimensionKey, number> = {
  subject: 20,
  environment: 15,
  composition: 15,
  style: 10,
  lighting: 10,
  color: 10,
  camera: 10,
  mood: 5,
  specificity: 5,
};

export const DIMENSION_LABELS: Record<ScoreDimensionKey, string> = {
  subject: "Subject Accuracy",
  environment: "Environment",
  composition: "Composition",
  style: "Style",
  lighting: "Lighting",
  color: "Color",
  camera: "Camera / Photography",
  mood: "Mood",
  specificity: "Specific Details",
};

/** Which simplified scorecard group each fine-grained dimension rolls into. */
export const GROUP_OF: Record<ScoreDimensionKey, ScoreGroupKey> = {
  subject: "subject",
  environment: "scene",
  style: "scene",
  lighting: "scene",
  color: "scene",
  mood: "scene",
  composition: "details",
  camera: "details",
  specificity: "details",
};

export const GROUP_WEIGHTS: Record<ScoreGroupKey, number> = {
  subject: 50,
  scene: 30,
  details: 20,
};

export const GROUP_LABELS: Record<ScoreGroupKey, string> = {
  subject: "Subject",
  scene: "Scene & Style",
  details: "Details & Craft",
};

const GROUP_ORDER: ScoreGroupKey[] = ["subject", "scene", "details"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(word: string): string {
  let w = word;
  if (w.endsWith("ies") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (w.endsWith("es") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) w = w.slice(0, -1);
  return w;
}

function tokenSet(s: string): Set<string> {
  return new Set(normalize(s).split(" ").filter(Boolean).map(stem));
}

type ConceptStatus = "matched" | "vague" | "missed";

interface ConceptEval {
  concept: ConceptTarget;
  status: ConceptStatus;
  matchedPhrase?: string;
  credit: number; // 0..1
}

function evaluateConcept(
  concept: ConceptTarget,
  promptNorm: string,
  promptTokens: Set<string>
): ConceptEval {
  // 1. Direct phrase match (strongest signal — the exact synonym appears).
  for (const syn of concept.synonyms) {
    const synNorm = normalize(syn);
    if (synNorm && promptNorm.includes(synNorm)) {
      return { concept, status: "matched", matchedPhrase: syn, credit: 1 };
    }
  }

  // 2. Fuzzy / partial token overlap, graduated rather than all-or-nothing —
  //    this is what lets "a person waiting for a train" score reasonably
  //    against a concept written as "commuter" without hitting that exact
  //    word. We score how *close* the phrasing got instead of just
  //    pass/fail on a single threshold.
  let bestFrac = 0;
  let bestSyn: string | null = null;
  let bestSynLen = 0;
  for (const syn of concept.synonyms) {
    const synTokens = Array.from(tokenSet(syn));
    if (synTokens.length === 0) continue;
    const hits = synTokens.filter((t) => promptTokens.has(t)).length;
    const frac = hits / synTokens.length;
    if (frac > bestFrac || (frac === bestFrac && synTokens.length > bestSynLen)) {
      bestFrac = frac;
      bestSyn = syn;
      bestSynLen = synTokens.length;
    }
  }
  if (bestSyn && bestFrac > 0) {
    if (bestSynLen === 1 && bestFrac === 1) {
      return { concept, status: "matched", matchedPhrase: bestSyn, credit: 0.9 };
    }
    if (bestSynLen >= 2) {
      if (bestFrac >= 0.66) return { concept, status: "matched", matchedPhrase: bestSyn, credit: 0.85 };
      // Got roughly half the idea across — still a real, creditable match,
      // just not shown as a clean "nailed it" so there's room to tighten it.
      if (bestFrac >= 0.4) return { concept, status: "matched", matchedPhrase: bestSyn, credit: 0.65 };
      // Only a stray keyword landed — some signal, but flagged as loose
      // rather than either a full miss or a false "you nailed it".
      return { concept, status: "vague", matchedPhrase: bestSyn, credit: 0.4 };
    }
  }

  // 3. Vague / generic language that gestures at the idea but adds no
  //    recreatable detail ("beautiful mountains" instead of specifics).
  if (concept.vagueFallbacks) {
    for (const vf of concept.vagueFallbacks) {
      const vfNorm = normalize(vf);
      if (vfNorm && promptNorm.includes(vfNorm)) {
        return { concept, status: "vague", matchedPhrase: vf, credit: 0.35 };
      }
    }
  }

  return { concept, status: "missed", credit: 0 };
}

function listJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildTutorFeedback(dimensions: DimensionScore[], score: number): string {
  const byScoreDesc = [...dimensions].sort((a, b) => b.score - a.score);
  const byScoreAsc = [...dimensions].sort((a, b) => a.score - b.score);
  const strong = byScoreDesc.filter((d) => d.score >= 80).slice(0, 2);
  const weak = byScoreAsc.filter((d) => d.score < 75).slice(0, 2);

  const strongText = strong.length
    ? `Your prompt correctly identified ${listJoin(strong.map((d) => d.label.toLowerCase()))}.`
    : `Your prompt captured a few surface details, but missed most of the elements that define this image.`;

  const weakText = weak.length
    ? ` It's missing meaningful detail on ${listJoin(
        weak.map((d) => d.label.toLowerCase())
      )} — the kind of information that most affects whether an image model could actually recreate this scene.`
    : ` It covers nearly every dimension the evaluator looks for — tighten a couple of specific details and this would be a near-perfect prompt.`;

  const closer =
    score >= 90
      ? " This is benchmark-level prompting."
      : score >= 70
        ? " You're close — a couple of concrete, specific phrases will close the gap."
        : " Try naming exactly what you see instead of describing it in general terms.";

  return strongText + weakText + closer;
}

function buildImprovedPrompt(userPrompt: string, missed: ConceptTarget[]): string {
  const trimmed = userPrompt.trim();
  if (!trimmed) {
    return missed
      .slice(0, 5)
      .map((m) => m.strongPhrase)
      .join(", ");
  }
  const additions = missed
    .filter((m) => m.weight >= 2)
    .slice(0, 3)
    .map((m) => m.strongPhrase);
  if (additions.length === 0) return trimmed;
  const withoutTrailingPeriod = trimmed.replace(/\.+$/, "");
  return `${withoutTrailingPeriod}, ${additions.join(", ")}.`;
}

/**
 * Evaluate a user's guessed prompt against a challenge's target image.
 * `hintPenaltyPoints` is the sum of hint costs already spent this attempt.
 */
export function evaluatePrompt(
  challenge: Challenge,
  userPrompt: string,
  hintPenaltyPoints: number = 0
): EvaluationResult {
  const promptNorm = normalize(userPrompt);
  const promptTokens = tokenSet(userPrompt);
  const wordCount = promptNorm.length ? promptNorm.split(" ").length : 0;

  const evals = challenge.concepts.map((c) => evaluateConcept(c, promptNorm, promptTokens));

  const dimensions: DimensionScore[] = GROUP_ORDER.map((key) => {
    const items = evals.filter((e) => GROUP_OF[e.concept.dimension] === key);
    if (items.length === 0) {
      return { key, label: GROUP_LABELS[key], score: 70, weightPct: GROUP_WEIGHTS[key] };
    }
    const totalWeight = items.reduce((s, i) => s + i.concept.weight, 0);
    const earned = items.reduce((s, i) => s + i.concept.weight * i.credit, 0);
    const score = Math.round((earned / totalWeight) * 100);
    return { key, label: GROUP_LABELS[key], score, weightPct: GROUP_WEIGHTS[key] };
  });

  let overall = dimensions.reduce((s, d) => s + (d.score * d.weightPct) / 100, 0);

  // Small efficiency bonus for prompts that pack in a lot of matched signal
  // per word — this is what lets a short, precise prompt beat a long,
  // unfocused one, without ever rewarding length on its own.
  const matchedCount = evals.filter((e) => e.status === "matched").length;
  if (wordCount > 0) {
    const density = matchedCount / Math.max(6, wordCount);
    overall += Math.min(3, density * 10);
  }
  if (wordCount < 3) {
    overall = Math.min(overall, 15);
  }

  overall = Math.max(0, Math.min(100, Math.round(overall)));
  const overallScore = Math.max(0, overall - hintPenaltyPoints);

  const matched: MatchedConcept[] = evals
    .filter((e) => e.status === "matched")
    .map((e) => ({ concept: e.concept, matchedPhrase: e.matchedPhrase! }))
    .sort((a, b) => b.concept.weight - a.concept.weight);

  const missed = evals
    .filter((e) => e.status === "missed")
    .map((e) => e.concept)
    .sort((a, b) => b.weight - a.weight);

  const vagueNotes = evals
    .filter((e) => e.status === "vague")
    .map((e) => ({
      conceptLabel: e.concept.label,
      userPhrase: e.matchedPhrase!,
      strongPhrase: e.concept.strongPhrase,
    }));

  const improvedPrompt = buildImprovedPrompt(
    userPrompt,
    evals.filter((e) => e.status !== "matched").map((e) => e.concept)
  );
  const tutorFeedback = buildTutorFeedback(dimensions, overallScore);

  const xpBase = 20 + overallScore * 1.2;
  const xpEarned = Math.round(xpBase * (DIFFICULTY_XP_MULTIPLIER[challenge.difficulty] ?? 1));

  return {
    overallScore,
    dimensions,
    matched,
    missed,
    vagueNotes,
    improvedPrompt,
    tutorFeedback,
    hintPenalty: hintPenaltyPoints,
    xpEarned,
  };
}

/** Used by Prompt Battle mode: score two candidate prompts and explain the winner. */
export function comparePrompts(challenge: Challenge, promptA: string, promptB: string) {
  const resultA = evaluatePrompt(challenge, promptA, 0);
  const resultB = evaluatePrompt(challenge, promptB, 0);
  const winner = resultA.overallScore === resultB.overallScore ? "tie" : resultA.overallScore > resultB.overallScore ? "A" : "B";
  const aIds = new Set(resultA.matched.map((m) => m.concept.id));
  const bIds = new Set(resultB.matched.map((m) => m.concept.id));
  const onlyA = resultA.matched.filter((m) => !bIds.has(m.concept.id));
  const onlyB = resultB.matched.filter((m) => !aIds.has(m.concept.id));
  return { resultA, resultB, winner, onlyA, onlyB };
}
