'use client';

import React, { useCallback, useRef, useMemo } from 'react';
import styles from './TimeSlider.module.css';

interface TimeSliderProps {
  value: number;       // Hour decimal, e.g. 13.5 = 1:30 PM
  min?: number;
  max?: number;
  onChange: (hour: number) => void;
  stadiumTimezone?: string;
  disabled?: boolean;
}

function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  value,
  min = 10,
  max = 20,
  onChange,
  disabled = false,
}) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newVal);
    }, 200);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Home') {
      e.preventDefault();
      onChange(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(max);
    }
  }, [onChange, min, max]);

  const timeText = useMemo(() => formatHour(value), [value]);

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="time-slider">
        Game Time: <span className={styles.timeValue}>{timeText}</span>
      </label>
      <input
        id="time-slider"
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={styles.slider}
        role="slider"
        aria-label="Game time selector"
        aria-valuetext={timeText}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className={styles.ticks}>
        <span>{formatHour(min)}</span>
        <span>{formatHour((min + max) / 2)}</span>
        <span>{formatHour(max)}</span>
      </div>
    </div>
  );
};

export default TimeSlider;
