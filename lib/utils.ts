import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-success bg-success-soft border-success/30",
  Medium: "text-accent bg-accent-soft border-accent/30",
  Hard: "text-danger bg-danger-soft border-danger/30",
};

export function difficultyClasses(difficulty: string): string {
  return DIFFICULTY_COLORS[difficulty] ?? DIFFICULTY_COLORS.Medium;
}
