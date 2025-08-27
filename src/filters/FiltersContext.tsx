import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

export type Values = {
  roof: 'All' | 'Open Air' | 'Retractable' | 'Covered';
  q: string;
  sort: 'name-asc' | 'name-desc' | 'capacity-desc' | 'capacity-asc';
  type?: 'MLB' | 'NFL' | 'MiLB' | 'NHL' | 'NBA' | 'MLS' | 'All';
};

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  values: Values;
  setValues: (v: Values) => void;
  set: (patch: Partial<Values>) => void;
};

const FiltersCtx = createContext<Ctx | null>(null);

export function FiltersProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<Values> }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>({
    roof: 'All',
    q: '',
    sort: 'name-asc',
    type: 'All',
    ...initial,
  });

  const set = (patch: Partial<Values>) => setValues(prev => ({ ...prev, ...patch }));

  // Prevent background scroll when drawer open
  useEffect(() => {
    const cls = 'noScroll';
    if (open) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [open]);

  const ctx = useMemo(() => ({ open, setOpen, values, setValues, set }), [open, values]);
  return <FiltersCtx.Provider value={ctx}>{children}</FiltersCtx.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersCtx);
  if (!ctx) throw new Error('useFilters must be used within <FiltersProvider>');
  return ctx;
}