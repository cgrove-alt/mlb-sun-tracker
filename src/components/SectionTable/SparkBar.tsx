'use client';
import React from 'react';

interface SparkBarProps {
  timeline: Array<{ offsetMinutes: number; sunExposurePct: number }>;
  /** Only show snapshots at 0, 60, 120, 180 minutes */
  maxPoints?: number;
}

export function SparkBar({ timeline, maxPoints = 4 }: SparkBarProps) {
  // Sample at 0, 1h, 2h, 3h
  const points = [0, 60, 120, 180]
    .map(offset => timeline.find(t => t.offsetMinutes === offset))
    .filter(Boolean)
    .slice(0, maxPoints) as Array<{ offsetMinutes: number; sunExposurePct: number }>;

  if (points.length === 0) return null;

  return (
    <div className="flex items-end gap-0.5 h-5" aria-label="Hourly sun exposure">
      {points.map((p, i) => {
        const height = Math.max(2, Math.round((p.sunExposurePct / 100) * 20));
        const color =
          p.sunExposurePct < 20 ? 'bg-green-400'
          : p.sunExposurePct < 70 ? 'bg-yellow-400'
          : 'bg-red-400';
        return (
          <div
            key={i}
            className={`w-2 rounded-sm ${color}`}
            style={{ height: `${height}px` }}
            title={`+${p.offsetMinutes / 60}h: ${p.sunExposurePct}% sun`}
          />
        );
      })}
    </div>
  );
}
