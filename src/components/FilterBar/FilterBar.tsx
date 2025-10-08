'use client';

import React from 'react';

export interface FilterValues {
  roof: string;
  q: string;
  sort: string;
}

export interface FilterBarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

export default function FilterBar({ values, onChange }: FilterBarProps) {
  const set = (patch: Partial<FilterValues>) => onChange({ ...values, ...patch });
  const roofOpts = ['All', 'Open Air', 'Retractable', 'Covered'];

  return (
    <aside className="sticky top-6 bg-white border border-gray-200 rounded-xl p-4" aria-label="Filters">
      <div className="mt-3">
        <div className="font-semibold text-sm text-ink-800">Roof</div>
        <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Roof type filter">
          {roofOpts.map((opt) => (
            <button
              key={opt}
              className={`border rounded-full px-3 py-1.5 text-[13px] font-medium cursor-pointer transition-all ${
                values.roof === opt
                  ? 'bg-primary-700 text-white border-primary-800'
                  : 'bg-white text-ink-800 border-gray-200 hover:bg-gray-50'
              }`}
              data-selected={values.roof === opt}
              onClick={() => set({ roof: opt })}
              aria-pressed={values.roof === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 mt-3">
        <div>
          <label className="font-semibold text-sm text-ink-800" htmlFor="q">
            Search stadium or team
          </label>
          <input
            id="q"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-ink-900 bg-white text-sm focus:outline focus:outline-2 focus:outline-primary-700 focus:outline-offset-1"
            placeholder="Oracle Park or Giants"
            value={values.q || ''}
            onChange={(e) => set({ q: e.target.value })}
          />
        </div>
        <div>
          <label className="font-semibold text-sm text-ink-800" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-ink-900 bg-white text-sm focus:outline focus:outline-2 focus:outline-primary-700 focus:outline-offset-1"
            value={values.sort || 'name-asc'}
            onChange={(e) => set({ sort: e.target.value })}
          >
            <option value="name-asc">Name (A→Z)</option>
            <option value="name-desc">Name (Z→A)</option>
            <option value="capacity-desc">Capacity (High→Low)</option>
            <option value="capacity-asc">Capacity (Low→High)</option>
          </select>
        </div>
      </div>

      <button className="mt-3 w-full rounded-lg px-3 py-2.5 text-white bg-ink-800 font-semibold border-0 cursor-pointer transition-colors hover:bg-ink-700 focus:outline focus:outline-2 focus:outline-primary-700 focus:outline-offset-2" onClick={() => onChange(values)}>
        Apply Filters
      </button>
    </aside>
  );
}