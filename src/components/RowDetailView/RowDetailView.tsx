import React, { useState, useMemo } from 'react';
import type { RowShadowData } from '../../utils/sunCalculator';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon, ChevronDownIcon, ChevronUpIcon } from '../Icons';
import { ShadeTimeline } from './ShadeTimeline';

interface RowDetailViewProps {
  sectionId: string;
  sectionName: string;
  rows: RowShadowData[];
  onClose?: () => void;
}

type SortField = 'row' | 'coverage' | 'recommendation';
type SortDirection = 'asc' | 'desc';
type RecommendationFilter = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

export const RowDetailView: React.FC<RowDetailViewProps> = ({
  sectionId,
  sectionName,
  rows,
  onClose,
}) => {
  const [sortField, setSortField] = useState<SortField>('row');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [recommendationFilter, setRecommendationFilter] = useState<RecommendationFilter>('all');
  const [showTimeline, setShowTimeline] = useState(true);

  // Calculate average shade across all rows for timeline
  const averageShade = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + row.coverage, 0);
    return Math.round(total / rows.length);
  }, [rows]);

  // Sort and filter rows
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Apply recommendation filter
    if (recommendationFilter !== 'all') {
      result = result.filter((row) => row.recommendation === recommendationFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'row') {
        // Sort by row number (numeric)
        const aNum = parseInt(a.rowNumber.replace(/\D/g, '') || '0');
        const bNum = parseInt(b.rowNumber.replace(/\D/g, '') || '0');
        comparison = aNum - bNum;
      } else if (sortField === 'coverage') {
        comparison = a.coverage - b.coverage;
      } else if (sortField === 'recommendation') {
        const recOrder = { excellent: 0, good: 1, fair: 2, poor: 3 };
        const aVal = recOrder[a.recommendation || 'fair'];
        const bVal = recOrder[b.recommendation || 'fair'];
        comparison = aVal - bVal;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [rows, sortField, sortDirection, recommendationFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCoverageIcon = (coverage: number) => {
    if (coverage >= 90) return <CloudIcon size={20} />;
    if (coverage >= 60) return <PartlyCloudyIcon size={20} />;
    if (coverage >= 30) return <SunIcon size={20} color="#f59e0b" />;
    return <FireIcon size={20} color="#dc2626" />;
  };

  const getCoverageColorClass = (coverage: number): string => {
    if (coverage >= 90) return 'bg-gray-100 text-gray-900 border-gray-300';
    if (coverage >= 60) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (coverage >= 30) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  const getRecommendationBadge = (rec?: string) => {
    if (!rec) return null;

    const styles = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      fair: 'bg-amber-100 text-amber-800 border-amber-300',
      poor: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
      excellent: '⭐ Excellent',
      good: '👍 Good',
      fair: '👌 Fair',
      poor: '⚠️ Poor',
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
          styles[rec as keyof typeof styles] || styles.fair
        }`}
      >
        {labels[rec as keyof typeof labels] || rec}
      </span>
    );
  };

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 rounded px-1"
      aria-label={`Sort by ${label} ${sortField === field ? (sortDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
    >
      {label}
      {sortField === field && (
        <span className="text-xs" aria-hidden="true">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  // Find best and worst rows for quick summary
  const bestRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.coverage - a.coverage);
    return sorted.slice(0, 3);
  }, [rows]);

  const worstRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => a.coverage - b.coverage);
    return sorted.slice(0, 3);
  }, [rows]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-200">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Row Details - {sectionName}</h4>
          <p className="text-sm text-gray-600">
            {filteredAndSortedRows.length} of {rows.length} rows
          </p>
        </div>

        {/* Recommendation filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="rec-filter" className="text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            id="rec-filter"
            value={recommendationFilter}
            onChange={(e) => setRecommendationFilter(e.target.value as RecommendationFilter)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white"
            aria-label="Filter rows by recommendation"
          >
            <option value="all">All Rows</option>
            <option value="excellent">⭐ Excellent</option>
            <option value="good">👍 Good</option>
            <option value="fair">👌 Fair</option>
            <option value="poor">⚠️ Poor</option>
          </select>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Best Rows Card */}
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <h5 className="text-sm font-semibold text-green-900 mb-2">🏆 Best Shade Rows</h5>
          <div className="space-y-1">
            {bestRows.map((row, idx) => (
              <div key={row.rowNumber} className="flex justify-between text-sm">
                <span className="text-green-800 font-medium">
                  #{idx + 1} Row {row.rowNumber}
                </span>
                <span className="text-green-900 font-bold">{Math.round(row.coverage)}% shade</span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst Rows Card */}
        <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
          <h5 className="text-sm font-semibold text-orange-900 mb-2">☀️ Most Sun Rows</h5>
          <div className="space-y-1">
            {worstRows.map((row, idx) => (
              <div key={row.rowNumber} className="flex justify-between text-sm">
                <span className="text-orange-800 font-medium">
                  #{idx + 1} Row {row.rowNumber}
                </span>
                <span className="text-orange-900 font-bold">{Math.round(row.coverage)}% shade</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shade Timeline (collapsible) */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
          aria-expanded={showTimeline}
          aria-controls="shade-timeline"
        >
          <span className="text-sm font-semibold text-gray-900">⏱️ Shade Throughout Game</span>
          {showTimeline ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
        </button>
        {showTimeline && (
          <div id="shade-timeline" className="p-4 bg-white border-t border-gray-200">
            <ShadeTimeline overallShade={averageShade} />
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                <SortButton field="row" label="Row" />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                Seats
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                <SortButton field="coverage" label="Shade Coverage" />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                <SortButton field="recommendation" label="Rating" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRows.map((row, idx) => (
              <tr
                key={row.rowNumber}
                className={`hover:bg-gray-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  Row {row.rowNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.seats}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${getCoverageColorClass(
                        row.coverage
                      )}`}
                    >
                      {getCoverageIcon(row.coverage)}
                      <span className="font-semibold">{Math.round(row.coverage)}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getRecommendationBadge(row.recommendation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filteredAndSortedRows.map((row) => (
          <div
            key={row.rowNumber}
            className={`p-4 rounded-xl border-2 ${getCoverageColorClass(
              row.coverage
            )} transition-all hover:shadow-lg`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">Row {row.rowNumber}</div>
                <div className="text-xs text-gray-600 mt-0.5">{row.seats} seats</div>
              </div>
              {getRecommendationBadge(row.recommendation)}
            </div>
            <div className="flex items-center gap-2">
              {getCoverageIcon(row.coverage)}
              <span className="text-sm font-semibold">{Math.round(row.coverage)}% shade</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAndSortedRows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No rows match the selected filter.</p>
          <button
            onClick={() => setRecommendationFilter('all')}
            className="mt-3 text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Close button */}
      {onClose && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Close row details"
          >
            Close Row Details
          </button>
        </div>
      )}
    </div>
  );
};
