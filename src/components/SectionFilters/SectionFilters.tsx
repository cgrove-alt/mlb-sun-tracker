import React from 'react';
import { SunIcon, CloudIcon, PartlyCloudyIcon, FireIcon, MoneyIcon } from '../Icons';

export interface SectionFilterValues {
  shadeLevel: string[];
  sectionType: string[];
  priceRange: string[];
}

interface SectionFiltersProps {
  filters: SectionFilterValues;
  onChange: (filters: SectionFilterValues) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const SectionFilters: React.FC<SectionFiltersProps> = ({
  filters,
  onChange,
  isExpanded = true,
  onToggleExpand
}) => {
  const toggleFilter = (category: keyof SectionFilterValues, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange({
      ...filters,
      [category]: newValues
    });
  };

  const clearCategory = (category: keyof SectionFilterValues) => {
    onChange({
      ...filters,
      [category]: []
    });
  };

  const clearAllFilters = () => {
    onChange({
      shadeLevel: [],
      sectionType: [],
      priceRange: []
    });
  };

  const hasActiveFilters = 
    filters.shadeLevel.length > 0 ||
    filters.sectionType.length > 0 ||
    filters.priceRange.length > 0;

  const shadeLevels = [
    { value: 'fully-shaded', label: 'Fully Shaded', icon: <CloudIcon size={16} />, description: '100% shade' },
    { value: 'mostly-shaded', label: 'Mostly Shaded', icon: <CloudIcon size={16} />, description: '75-99% shade' },
    { value: 'partial-shade', label: 'Partial Shade', icon: <PartlyCloudyIcon size={16} />, description: '25-74% shade' },
    { value: 'mostly-sunny', label: 'Mostly Sunny', icon: <SunIcon size={16} color="#f59e0b" />, description: '1-24% shade' },
    { value: 'full-sun', label: 'Full Sun', icon: <FireIcon size={16} color="#dc2626" />, description: '0% shade' }
  ];

  const sectionTypes = [
    { value: 'covered', label: 'Covered', description: 'Has roof/overhang' },
    { value: 'field', label: 'Field Level' },
    { value: 'lower', label: 'Lower Bowl' },
    { value: 'club', label: 'Club Level' },
    { value: 'upper', label: 'Upper Deck' }
  ];

  const priceRanges = [
    { value: 'value', label: 'Value', icon: <MoneyIcon size={16} /> },
    { value: 'moderate', label: 'Moderate', icon: <MoneyIcon size={16} /> },
    { value: 'premium', label: 'Premium', icon: <MoneyIcon size={16} /> },
    { value: 'luxury', label: 'Luxury', icon: <MoneyIcon size={16} /> }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden md:rounded-none md:border-l-0 md:border-r-0 md:mb-3">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 md:px-3 md:py-2.5">
        <h4 className="m-0 text-sm font-semibold text-gray-800 flex items-center gap-2">
          Quick Filters
          {hasActiveFilters && (
            <span className="text-xs text-primary-600 font-normal">
              ({filters.shadeLevel.length + filters.sectionType.length + filters.priceRange.length} active)
            </span>
          )}
        </h4>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              className="px-3 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-800"
              onClick={clearAllFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
          {onToggleExpand && (
            <button
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded cursor-pointer text-lg text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-800"
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 md:p-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-1">
          {/* Shade Level Filters */}
          <div className="mb-4 last:mb-0 md:mb-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="m-0 text-[13px] font-semibold text-gray-700">Shade Level</h5>
              {filters.shadeLevel.length > 0 && (
                <button
                  className="px-2 py-0.5 text-[11px] text-gray-500 bg-transparent border border-gray-300 rounded-sm cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => clearCategory('shadeLevel')}
                  aria-label="Clear shade level filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-1.5">
              {shadeLevels.map(level => (
                <button
                  key={level.value}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-[13px] border rounded-full cursor-pointer transition-all whitespace-nowrap md:px-2.5 md:py-1 md:text-xs ${
                    filters.shadeLevel.includes(level.value)
                      ? 'text-white bg-primary-600 border-primary-600 hover:bg-primary-700 hover:border-primary-700'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  onClick={() => toggleFilter('shadeLevel', level.value)}
                  aria-pressed={filters.shadeLevel.includes(level.value)}
                  title={level.description}
                >
                  <span className="flex-shrink-0">{level.icon}</span>
                  <span>{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Type Filters */}
          <div className="mb-4 last:mb-0 md:mb-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="m-0 text-[13px] font-semibold text-gray-700">Section Type</h5>
              {filters.sectionType.length > 0 && (
                <button
                  className="px-2 py-0.5 text-[11px] text-gray-500 bg-transparent border border-gray-300 rounded-sm cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => clearCategory('sectionType')}
                  aria-label="Clear section type filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-1.5">
              {sectionTypes.map(type => (
                <button
                  key={type.value}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-[13px] border rounded-full cursor-pointer transition-all whitespace-nowrap md:px-2.5 md:py-1 md:text-xs ${
                    filters.sectionType.includes(type.value)
                      ? 'text-white bg-primary-600 border-primary-600 hover:bg-primary-700 hover:border-primary-700'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  onClick={() => toggleFilter('sectionType', type.value)}
                  aria-pressed={filters.sectionType.includes(type.value)}
                  title={type.description}
                >
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className="mb-4 last:mb-0 md:mb-3 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h5 className="m-0 text-[13px] font-semibold text-gray-700">Price Range</h5>
              {filters.priceRange.length > 0 && (
                <button
                  className="px-2 py-0.5 text-[11px] text-gray-500 bg-transparent border border-gray-300 rounded-sm cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => clearCategory('priceRange')}
                  aria-label="Clear price range filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-1.5">
              {priceRanges.map(range => (
                <button
                  key={range.value}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-[13px] border rounded-full cursor-pointer transition-all whitespace-nowrap md:px-2.5 md:py-1 md:text-xs ${
                    filters.priceRange.includes(range.value)
                      ? 'text-white bg-primary-600 border-primary-600 hover:bg-primary-700 hover:border-primary-700'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  onClick={() => toggleFilter('priceRange', range.value)}
                  aria-pressed={filters.priceRange.includes(range.value)}
                >
                  <span className="flex-shrink-0">{range.icon}</span>
                  <span>{range.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && isExpanded && (
        <div className="flex flex-wrap gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200 md:px-3 md:py-2.5 md:gap-1.5">
          {filters.shadeLevel.map(value => {
            const level = shadeLevels.find(l => l.value === value);
            return level ? (
              <span key={value} className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-700 bg-primary-100 border border-primary-600 rounded-xl md:text-[11px] md:px-1.5 md:py-0.5">
                {level.label}
                <button
                  className="inline-flex items-center justify-center w-4 h-4 ml-0.5 bg-transparent border-0 text-primary-700 text-base cursor-pointer transition-opacity hover:opacity-70"
                  onClick={() => toggleFilter('shadeLevel', value)}
                  aria-label={`Remove ${level.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {filters.sectionType.map(value => {
            const type = sectionTypes.find(t => t.value === value);
            return type ? (
              <span key={value} className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-700 bg-primary-100 border border-primary-600 rounded-xl md:text-[11px] md:px-1.5 md:py-0.5">
                {type.label}
                <button
                  className="inline-flex items-center justify-center w-4 h-4 ml-0.5 bg-transparent border-0 text-primary-700 text-base cursor-pointer transition-opacity hover:opacity-70"
                  onClick={() => toggleFilter('sectionType', value)}
                  aria-label={`Remove ${type.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {filters.priceRange.map(value => {
            const range = priceRanges.find(r => r.value === value);
            return range ? (
              <span key={value} className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-700 bg-primary-100 border border-primary-600 rounded-xl md:text-[11px] md:px-1.5 md:py-0.5">
                {range.label}
                <button
                  className="inline-flex items-center justify-center w-4 h-4 ml-0.5 bg-transparent border-0 text-primary-700 text-base cursor-pointer transition-opacity hover:opacity-70"
                  onClick={() => toggleFilter('priceRange', value)}
                  aria-label={`Remove ${range.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default SectionFilters;