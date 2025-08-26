'use client';

import React from 'react';
import styles from './FilterBar.module.css';

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
    <aside className={styles.aside} aria-label="Filters">
      <div className={styles.group}>
        <div className={styles.label}>Roof</div>
        <div className={styles.chips} role="group" aria-label="Roof type filter">
          {roofOpts.map((opt) => (
            <button
              key={opt}
              className={styles.chip}
              data-selected={values.roof === opt}
              onClick={() => set({ roof: opt })}
              aria-pressed={values.roof === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group + ' ' + styles.controls}>
        <div>
          <label className={styles.label} htmlFor="q">
            Search stadium or team
          </label>
          <input
            id="q"
            className={styles.input}
            placeholder="Oracle Park or Giants"
            value={values.q || ''}
            onChange={(e) => set({ q: e.target.value })}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className={styles.select}
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

      <button className={styles.apply} onClick={() => onChange(values)}>
        Apply Filters
      </button>
    </aside>
  );
}