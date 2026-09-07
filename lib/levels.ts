export interface Level {
  name: string;
  minXp: number;
  icon: string;
}

export const LEVELS: Level[] = [
  { name: "Prompt Rookie", minXp: 0, icon: "🌱" },
  { name: "Prompt Skilled", minXp: 1000, icon: "🛠️" },
  { name: "Prompt Expert", minXp: 4000, icon: "🎓" },
  { name: "Prompt Wizard", minXp: 10000, icon: "🧙" },
];

export function getLevel(xp: number): { level: Level; index: number; next: Level | null; progressPct: number } {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) idx = i;
  }
  const level = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const progressPct = next
    ? Math.min(100, Math.round(((xp - level.minXp) / (next.minXp - level.minXp)) * 100))
    : 100;
  return { level, index: idx, next, progressPct };
}

export const DIFFICULTY_UNLOCK: Record<string, number> = {
  Easy: 0,
  Medium: 0,
  Hard: 1000,
};

export const DIFFICULTY_XP_MULTIPLIER: Record<string, number> = {
  Easy: 0.85,
  Medium: 1.15,
  Hard: 1.5,
};
