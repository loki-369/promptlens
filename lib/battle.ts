import type { Challenge } from "./types";

function truncatedVariant(originalPrompt: string): string {
  const segments = originalPrompt.replace(/\.$/, "").split(", ");
  const keep = Math.max(2, Math.ceil(segments.length * 0.5));
  return segments.slice(0, keep).join(", ") + ".";
}

export interface BattlePair {
  challenge: Challenge;
  left: { label: "A" | "B"; prompt: string };
  right: { label: "A" | "B"; prompt: string };
}

export function generateBattlePair(challenge: Challenge, seed = Math.random()): BattlePair {
  const strong = challenge.originalPrompt;
  const weak = seed > 0.5 ? (challenge.badPrompt ?? truncatedVariant(strong)) : truncatedVariant(strong);
  const flip = Math.random() > 0.5;
  const a = { label: "A" as const, prompt: flip ? weak : strong };
  const b = { label: "B" as const, prompt: flip ? strong : weak };
  return { challenge, left: a, right: b };
}
