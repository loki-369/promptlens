// Core domain types for PromptLens

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Category =
  | "Photography"
  | "Architecture"
  | "Nature"
  | "People"
  | "Fashion"
  | "Food"
  | "Sci-Fi"
  | "Fantasy"
  | "Cyberpunk"
  | "Anime"
  | "Product Photography"
  | "Cinematic"
  | "Surrealism"
  | "Illustration"
  | "3D Art"
  | "Concept Art";

export type ScoreDimensionKey =
  | "subject"
  | "environment"
  | "composition"
  | "style"
  | "lighting"
  | "color"
  | "camera"
  | "mood"
  | "specificity";

/** The 3 simplified scorecard groups shown to players (fine-grained
 *  ScoreDimensionKeys above still drive matching under the hood, but
 *  results roll up into just these for a much easier-to-read scorecard). */
export type ScoreGroupKey = "subject" | "scene" | "details";

/** A single describable visual concept the evaluator looks for in a prompt. */
export interface ConceptTarget {
  /** Stable id, used for match tracking */
  id: string;
  /** Human readable label shown in "You nailed it" / "You missed" lists */
  label: string;
  /** Scoring dimension this concept counts toward */
  dimension: ScoreDimensionKey;
  /** Canonical + synonym phrases; any hit counts as a semantic match */
  synonyms: string[];
  /** 1 = nice to have, 2 = important, 3 = essential/defining concept */
  weight: 1 | 2 | 3;
  /** Shown as a "your prompt was too vague" example when only a weak/generic
   *  version of this concept is detected instead of the real one */
  vagueFallbacks?: string[];
  /** A stronger example phrase used in "instead of X, try Y" coaching */
  strongPhrase: string;
}

export interface HintDef {
  cost: number; // points deducted from the max achievable score
  text: string;
}

export interface Challenge {
  id: string;
  number: number;
  image: string;
  imageAlt: string;
  originalPrompt: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  creator: string;
  createdAt: string;
  concepts: ConceptTarget[];
  hints: HintDef[];
  /** Used by Fix the Prompt mode */
  badPrompt?: string;
  published: boolean;
}

export interface DimensionScore {
  key: ScoreGroupKey;
  label: string;
  score: number; // 0-100
  weightPct: number; // display weight e.g. 50
}

export interface MatchedConcept {
  concept: ConceptTarget;
  matchedPhrase: string;
}

export interface EvaluationResult {
  overallScore: number;
  dimensions: DimensionScore[];
  matched: MatchedConcept[];
  missed: ConceptTarget[];
  vagueNotes: { conceptLabel: string; userPhrase: string; strongPhrase: string }[];
  improvedPrompt: string;
  tutorFeedback: string;
  hintPenalty: number;
  xpEarned: number;
}

export interface HistoryEntry {
  challengeId: string;
  challengeNumber: number;
  score: number;
  bestScore: number;
  attempts: number;
  playedAt: string;
  difficulty: Difficulty;
  category: Category;
  dimensions: DimensionScore[];
}

export interface UserProfile {
  name: string;
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  history: HistoryEntry[];
  achievements: string[];
  hintsUsedTotal: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  avatarSeed: string;
  isYou?: boolean;
}
