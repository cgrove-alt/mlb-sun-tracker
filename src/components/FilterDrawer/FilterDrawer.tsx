import React, { useEffect, useRef } from 'react';
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
        className={`fixed inset-0 bg-black/40 transition-opacity duration-200 z-[1000] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
      <aside
        ref={sheetRef}
        className={`fixed left-0 right-0 bottom-0 translate-y-full transition-transform duration-300 ease-out bg-white rounded-t-2xl shadow-[0_-6px_24px_rgba(0,0,0,0.18)] max-h-[80vh] flex flex-col z-[1000] lg:top-0 lg:bottom-0 lg:left-0 lg:right-auto lg:w-[min(420px,100vw)] lg:rounded-none lg:border-r lg:border-gray-200 lg:-translate-x-full lg:max-h-none lg:shadow-[6px_0_24px_rgba(0,0,0,0.18)] ${open ? 'translate-y-0 lg:translate-x-0' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="h-6 flex items-center justify-center bg-white lg:hidden before:content-[''] before:w-11 before:h-1 before:rounded-full before:bg-gray-200" />
        <div className="px-4 pb-3 flex justify-between items-center bg-white">
          <div className="font-semibold text-ink-800">Filters</div>
          <button onClick={() => setOpen(false)} aria-label="Close filters">Close</button>
        </div>

        <div className="px-4 pb-4 overflow-auto bg-white">
          <div className="mt-3">
            <div className="font-semibold text-sm text-ink-800">Roof</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {ROOF.map(opt => (
                <button
                  key={opt}
                  className={`border rounded-full px-3 py-2 font-medium text-sm ${values.roof === opt ? 'bg-primary-700 text-white border-primary-800' : 'bg-white text-ink-800 border-gray-200'}`}
                  data-selected={values.roof === opt}
                  aria-pressed={values.roof === opt}
                  onClick={() => set({ roof: opt })}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <label className="font-semibold text-sm text-ink-800" htmlFor="q">Search stadium or team</label>
            <input
              id="q"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-ink-900 text-base min-h-[44px] mt-2"
              placeholder="Oracle Park or Giants"
              value={values.q}
              onChange={e => set({ q: (e.target as HTMLInputElement).value })}
            />
          </div>

          <div className="mt-3">
            <label className="font-semibold text-sm text-ink-800" htmlFor="sort">Sort</label>
            <select
              id="sort"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-ink-900 text-base min-h-[44px] mt-2"
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

        <div className="sticky bottom-0 px-4 py-3 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white flex gap-3">
          <button className="flex-1 rounded-xl px-3 py-3 font-semibold text-center bg-gray-50 text-ink-800 border border-gray-200" onClick={() => set({ roof:'All', q:'', sort:'name-asc' })}>Clear</button>
          <button className="flex-1 rounded-xl px-3 py-3 font-semibold text-center bg-ink-800 text-white" onClick={() => setOpen(false)}>Apply</button>
        </div>
      </aside>
    </>
  );
}