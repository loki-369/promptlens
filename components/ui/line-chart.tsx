"use client";

import { useId } from "react";

export function LineChart({
  data,
  height = 180,
}: {
  data: number[];
  height?: number;
}) {
  const gradientId = useId();
  const width = 100; // percentage-based viewBox, scales with container
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-sm text-text-faint">
        Play a few challenges to see your score history.
      </div>
    );
  }
  const max = 100;
  const min = 0;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((v, i) => {
    const x = data.length > 1 ? i * stepX : width / 2;
    const y = height - ((v - min) / (max - min)) * height;
    return [x, y] as const;
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((g) => (
        <line
          key={g}
          x1={0}
          x2={width}
          y1={height - (g / 100) * height}
          y2={height - (g / 100) * height}
          stroke="var(--border)"
          strokeWidth={0.3}
        />
      ))}
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={1.3} fill="var(--accent)" stroke="var(--bg)" strokeWidth={0.4} />
      ))}
    </svg>
  );
}
