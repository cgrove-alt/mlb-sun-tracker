'use client';
import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import type { ShadeSectionRow, FilterState } from './types';
import { FilterBar } from './FilterBar';
import { SectionRow } from './SectionRow';

interface SectionTableProps {
  sections: ShadeSectionRow[];
  offsetMinutes?: number;
}

const col = createColumnHelper<ShadeSectionRow>();

export function SectionTable({ sections, offsetMinutes = 0 }: SectionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'shadeScore', desc: true }]);
  const [filter, setFilter] = useState<FilterState>({ levels: [], coveredOnly: false, minShadeScore: 0 });
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    return sections.filter(s => {
      if (filter.levels.length > 0 && !filter.levels.includes(s.level)) return false;
      if (filter.coveredOnly && !s.covered) return false;
      if (filter.minShadeScore > 0 && s.shadeScore < filter.minShadeScore) return false;
      return true;
    });
  }, [sections, filter]);

  const columns = [
    col.accessor('name', { header: 'Section', enableSorting: true }),
    col.accessor('level', { header: 'Level', enableSorting: true }),
    col.accessor('shadeScore', { header: 'Shade Score', enableSorting: true }),
    col.accessor('atFirstPitch', { header: '% Sun at 1st Pitch', enableSorting: true }),
    col.display({ id: 'sparkline', header: 'Hourly' }),
    col.accessor('covered', { header: 'Covered', enableSorting: false }),
    col.accessor('overallStatus', { header: 'Status', enableSorting: true }),
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const sortedRows = table.getRowModel().rows;
  const displayedRows = showAll ? sortedRows : sortedRows.slice(0, 20);

  return (
    <div className="space-y-3">
      <FilterBar filter={filter} onChange={setFilter} />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm" role="grid" aria-label="Stadium sections shade data">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="hidden md:table-row">
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                    aria-sort={
                      header.column.getIsSorted() === 'asc' ? 'ascending'
                      : header.column.getIsSorted() === 'desc' ? 'descending'
                      : 'none'
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {displayedRows.map(row => (
              <SectionRow
                key={row.id}
                section={row.original}
                offsetMinutes={offsetMinutes}
              />
            ))}
          </tbody>
        </table>
      </div>

      {sortedRows.length > 20 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Show all {sortedRows.length} sections
        </button>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sections match your filters.{' '}
          <button
            className="text-blue-600 underline"
            onClick={() => setFilter({ levels: [], coveredOnly: false, minShadeScore: 0 })}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
