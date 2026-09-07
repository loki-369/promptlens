import type { CSSProperties } from "react";

export interface DriftOption {
  id: string;
  label: string;
  style: CSSProperties;
}

export const DRIFT_OPTIONS: DriftOption[] = [
  { id: "warm", label: "Color palette shifted warmer", style: { filter: "sepia(0.35) saturate(1.5) hue-rotate(-10deg)" } },
  { id: "mirror", label: "Image is mirrored left-to-right", style: { transform: "scaleX(-1)" } },
  { id: "contrast", label: "Higher contrast and more saturated", style: { filter: "contrast(1.35) saturate(1.6)" } },
  { id: "zoom", label: "Framing is more tightly zoomed in", style: { transform: "scale(1.18)" } },
  { id: "desaturated", label: "Less colorful / desaturated", style: { filter: "saturate(0.35) brightness(1.05)" } },
  { id: "dark", label: "Darker overall exposure", style: { filter: "brightness(0.6) contrast(1.1)" } },
];

export function mergeStyles(ids: string[]): CSSProperties {
  const chosen = DRIFT_OPTIONS.filter((o) => ids.includes(o.id));
  const filters = chosen.map((o) => o.style.filter).filter(Boolean);
  const transforms = chosen.map((o) => o.style.transform).filter(Boolean);
  const style: CSSProperties = {};
  if (filters.length) style.filter = filters.join(" ");
  if (transforms.length) style.transform = transforms.join(" ");
  return style;
}

export function pickDrift(count = 2): string[] {
  const shuffled = [...DRIFT_OPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((o) => o.id);
}
