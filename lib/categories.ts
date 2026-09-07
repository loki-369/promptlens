import type { Category, Difficulty } from "./types";

export const CATEGORIES: Category[] = [
  "Photography",
  "Architecture",
  "Nature",
  "People",
  "Fashion",
  "Food",
  "Sci-Fi",
  "Fantasy",
  "Cyberpunk",
  "Anime",
  "Product Photography",
  "Cinematic",
  "Surrealism",
  "Illustration",
  "3D Art",
  "Concept Art",
];

export const DIFFICULTIES: { level: Difficulty; desc: string }[] = [
  { level: "Easy", desc: "Simple images with obvious subjects." },
  { level: "Medium", desc: "More complex scenes with subtle details." },
  { level: "Hard", desc: "Highly detailed images where small things matter a lot." },
];
