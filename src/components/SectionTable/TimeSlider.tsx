'use client';
import React, { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface TimeSliderProps {
  durationMinutes: number;
  firstPitchLabel: string;  // e.g. "1:05 PM"
  onChange?: (offsetMinutes: number) => void;
}

export function TimeSlider({ durationMinutes, firstPitchLabel, onChange }: TimeSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentOffset = parseInt(searchParams.get('offset') ?? '0', 10);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Snap to nearest 15 min
    const raw = parseInt(e.target.value, 10);
    const snapped = Math.round(raw / 15) * 15;
    const params = new URLSearchParams(searchParams.toString());
    params.set('offset', String(snapped));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    onChange?.(snapped);
  }, [router, pathname, searchParams, onChange]);

  const hours = Math.floor(currentOffset / 60);
  const mins = currentOffset % 60;
  const timeLabel = mins === 0 ? `+${hours}h` : `+${hours}h ${mins}m`;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>First pitch: {firstPitchLabel}</span>
        <span>{currentOffset === 0 ? 'At first pitch' : timeLabel} into game</span>
      </div>
      <input
        type="range"
        min={0}
        max={durationMinutes}
        step={15}
        value={currentOffset}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        aria-label="Game time slider"
        aria-valuemin={0}
        aria-valuemax={durationMinutes}
        aria-valuenow={currentOffset}
        aria-valuetext={currentOffset === 0 ? 'First pitch' : timeLabel}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>1st pitch</span>
        <span>+{Math.floor(durationMinutes / 60)}h</span>
      </div>
    </div>
  );
}
