import React, { useState, useMemo } from 'react';
import type { RowShadowData } from '../utils/sunCalculator';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon } from './Icons';

interface RowBreakdownViewProps {
  sectionId: string;
  sectionName: string;
  rows: RowShadowData[];
  onClose?: () => void;
}

type SortField = 'row' | 'coverage' | 'recommendation';
type SortDirection = 'asc' | 'desc';
type RecommendationFilter = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

export const RowBreakdownView: React.FC<RowBreakdownViewProps> = ({
  sectionId,
  sectionName,
  rows,
  onClose,
}) => {
  const [sortField, setSortField] = useState<SortField>('row');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [recommendationFilter, setRecommendationFilter] = useState<RecommendationFilter>('all');

  // Sort and filter rows
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Apply recommendation filter
    if (recommendationFilter !== 'all') {
      result = result.filter(row => row.recommendation === recommendationFilter);
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
    if (coverage >= 90) return 'bg-gray-100 text-gray-900';
    if (coverage >= 60) return 'bg-blue-100 text-blue-900';
    if (coverage >= 30) return 'bg-amber-100 text-amber-900';
    return 'bg-red-100 text-red-900';
  };

  const getRecommendationBadge = (rec?: string) => {
    if (!rec) return null;

    const styles = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      fair: 'bg-amber-100 text-amber-800 border-amber-300',
      poor: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${styles[rec as keyof typeof styles] || styles.fair}`}>
        {rec.charAt(0).toUpperCase() + rec.slice(1)}
      </span>
    );
  };

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-accent-600 transition-colors"
      aria-label={`Sort by ${label}`}
    >
      {label}
      {sortField === field && (
        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  return (
    <div className="mt-4 space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-200">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Row Details - {sectionName}</h4>
          <p className="text-sm text-gray-600">{filteredAndSortedRows.length} of {rows.length} rows</p>
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
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            aria-label="Filter rows by recommendation"
          >
            <option value="all">All Rows</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="row" label="Row" />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Seats
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="coverage" label="Shade Coverage" />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="recommendation" label="Rating" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRows.map((row) => (
              <tr
                key={row.rowNumber}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.rowNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {row.seats}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getCoverageColorClass(row.coverage)}`}>
                      {getCoverageIcon(row.coverage)}
                      <span className="font-medium">{Math.round(row.coverage)}%</span>
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
      <div className="md:hidden space-y-2">
        {filteredAndSortedRows.map((row) => (
          <div
            key={row.rowNumber}
            className={`p-4 rounded-lg border-2 ${getCoverageColorClass(row.coverage)} transition-all hover:shadow-md`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-semibold text-gray-900">Row {row.rowNumber}</div>
                <div className="text-xs text-gray-600">{row.seats} seats</div>
              </div>
              {getRecommendationBadge(row.recommendation)}
            </div>
            <div className="flex items-center gap-2">
              {getCoverageIcon(row.coverage)}
              <span className="text-sm font-medium">{Math.round(row.coverage)}% shade coverage</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAndSortedRows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No rows match the selected filter.
        </div>
      )}

      {/* Close button */}
      {onClose && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Close row details"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
