import type { LeaderboardEntry } from "./types";

const NAMES = [
  "Alex", "Sarah", "Ishal", "Marco", "Yuki", "Priya", "Diego", "Nora",
  "Kenji", "Fatima", "Leo", "Ines", "Omar", "Zara", "Theo", "Maya",
  "Ravi", "Elin", "Jules", "Amara", "Noah", "Lina", "Felix", "Suki",
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBoard(seed: number, maxXp: number, minXp: number): LeaderboardEntry[] {
  const rand = mulberry32(seed);
  const entries: LeaderboardEntry[] = [];
  const usedNames = new Set<string>();
  const count = 30;
  for (let i = 0; i < count; i++) {
    let name = NAMES[Math.floor(rand() * NAMES.length)];
    let suffix = 0;
    while (usedNames.has(name)) {
      suffix += 1;
      name = `${NAMES[Math.floor(rand() * NAMES.length)]}${suffix}`;
    }
    usedNames.add(name);
    const t = i / count;
    const xp = Math.round(maxXp - t * (maxXp - minXp) + (rand() - 0.5) * 120);
    entries.push({
      rank: 0,
      name,
      xp: Math.max(minXp, xp),
      streak: Math.max(0, Math.round(rand() * 30)),
      avatarSeed: `${seed}-${i}`,
    });
  }
  entries.sort((a, b) => b.xp - a.xp);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

export type LeaderboardScope = "today" | "week" | "alltime";

const BOARD_CONFIG: Record<LeaderboardScope, { seed: number; maxXp: number; minXp: number }> = {
  today: { seed: 42, maxXp: 2400, minXp: 300 },
  week: { seed: 7, maxXp: 9842, minXp: 1200 },
  alltime: { seed: 99, maxXp: 48210, minXp: 4000 },
};

export function getLeaderboard(scope: LeaderboardScope, yourXp: number): { entries: LeaderboardEntry[]; yourRank: number } {
  const cfg = BOARD_CONFIG[scope];
  const board = generateBoard(cfg.seed, cfg.maxXp, cfg.minXp);

  const relevantXp = scope === "today" ? Math.min(yourXp, cfg.maxXp + 200) : yourXp;
  const withYou = [...board, { rank: 0, name: "You", xp: relevantXp, streak: 0, avatarSeed: "you", isYou: true }];
  withYou.sort((a, b) => b.xp - a.xp);
  withYou.forEach((e, i) => (e.rank = i + 1));

  const yourRank = withYou.find((e) => e.isYou)?.rank ?? withYou.length;
  return { entries: withYou, yourRank };
}
