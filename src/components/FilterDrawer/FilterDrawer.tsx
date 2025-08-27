import React, { useEffect, useRef } from 'react';
import s from './FilterDrawer.module.css';
import { useFilters } from '@/src/filters/FiltersContext';

const ROOF = ['All','Open Air','Retractable','Covered'] as const;

export default function FilterDrawer() {
  const { open, setOpen, values, set } = useFilters();
  const sheetRef = useRef<HTMLDivElement>(null);

  // ESC to close & focus trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // Simple focus trap
  useEffect(() => {
    if (!open || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0], last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    sheetRef.current.addEventListener('keydown', trap);
    (first || sheetRef.current).focus();
    return () => sheetRef.current?.removeEventListener('keydown', trap);
  }, [open]);

  return (
    <>
      <div
        className={`${s.scrim} ${open ? s.scrimOpen : ''}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
      <aside
        ref={sheetRef}
        className={`${s.sheet} ${open ? s.sheetOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        style={{ background: '#ffffff' }}
      >
        <div className={s.handle} style={{ background: '#ffffff' }} />
        <div className={s.header} style={{ background: '#ffffff' }}>
          <div className={s.title}>Filters</div>
          <button onClick={() => setOpen(false)} aria-label="Close filters">Close</button>
        </div>

        <div className={s.content} style={{ background: '#ffffff' }}>
          <div className={s.group}>
            <div className={s.label}>Roof</div>
            <div className={s.chips}>
              {ROOF.map(opt => (
                <button
                  key={opt}
                  className={s.chip}
                  data-selected={values.roof === opt}
                  aria-pressed={values.roof === opt}
                  onClick={() => set({ roof: opt })}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className={s.group}>
            <label className={s.label} htmlFor="q">Search stadium or team</label>
            <input
              id="q"
              className={s.input}
              placeholder="Oracle Park or Giants"
              value={values.q}
              onChange={e => set({ q: (e.target as HTMLInputElement).value })}
            />
          </div>

          <div className={s.group}>
            <label className={s.label} htmlFor="sort">Sort</label>
            <select
              id="sort"
              className={s.select}
              value={values.sort}
              onChange={e => set({ sort: (e.target as HTMLSelectElement).value as any })}
            >
              <option value="name-asc">Name (A→Z)</option>
              <option value="name-desc">Name (Z→A)</option>
              <option value="capacity-desc">Capacity (High→Low)</option>
              <option value="capacity-asc">Capacity (Low→High)</option>
            </select>
          </div>
        </div>

        <div className={s.controls} style={{ background: '#ffffff' }}>
          <button className={`${s.btn} ${s.secondary}`} onClick={() => set({ roof:'All', q:'', sort:'name-asc' })}>Clear</button>
          <button className={`${s.btn} ${s.primary}`} onClick={() => setOpen(false)}>Apply</button>
        </div>
      </aside>
    </>
  );
}