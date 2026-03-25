'use client';
import React from 'react';
import type { FilterState } from './types';

interface FilterBarProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

const LEVELS = ['field', 'lower', 'club', 'upper', 'suite'];
const SHADE_SCORES = [
  { label: 'Any', value: 0 },
  { label: '7+ (Good)', value: 7 },
  { label: '9+ (Great)', value: 9 },
];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white border border-blue-600'
          : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
      }`}
    >
      {label}
    </button>
  );
}

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const toggleLevel = (level: string) => {
    const levels = filter.levels.includes(level)
      ? filter.levels.filter(l => l !== level)
      : [...filter.levels, level];
    onChange({ ...filter, levels });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center py-2">
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-gray-500 font-medium">Level:</span>
        {LEVELS.map(l => (
          <Chip
            key={l}
            label={l.charAt(0).toUpperCase() + l.slice(1)}
            active={filter.levels.includes(l)}
            onClick={() => toggleLevel(l)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-gray-500 font-medium">Min shade:</span>
        {SHADE_SCORES.map(s => (
          <Chip
            key={s.value}
            label={s.label}
            active={filter.minShadeScore === s.value}
            onClick={() => onChange({ ...filter, minShadeScore: s.value })}
          />
        ))}
      </div>

      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filter.coveredOnly}
          onChange={e => onChange({ ...filter, coveredOnly: e.target.checked })}
          className="rounded"
        />
        Covered only
      </label>
    </div>
  );
}
