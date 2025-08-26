import React, { useState } from 'react';
import { FilterDrawer, FilterTrigger } from './FilterDrawer';
import type { FilterGroup } from './FilterDrawer';

// Example usage of FilterDrawer component
export function FilterDrawerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Sample filter groups
  const filterGroups: FilterGroup[] = [
    {
      id: 'sunExposure',
      label: 'Sun Exposure',
      options: [
        { id: 'full-shade', label: 'Full Shade', selected: false },
        { id: 'partial-shade', label: 'Partial Shade', selected: false },
        { id: 'some-sun', label: 'Some Sun', selected: false },
        { id: 'full-sun', label: 'Full Sun', selected: false },
      ]
    },
    {
      id: 'sectionType',
      label: 'Section Type',
      options: [
        { id: 'field-level', label: 'Field Level', selected: false },
        { id: 'club-level', label: 'Club Level', selected: false },
        { id: 'upper-deck', label: 'Upper Deck', selected: false },
        { id: 'outfield', label: 'Outfield', selected: false },
      ]
    },
    {
      id: 'amenities',
      label: 'Amenities',
      options: [
        { id: 'covered', label: 'Covered', selected: false },
        { id: 'food-nearby', label: 'Food Nearby', selected: false },
        { id: 'premium', label: 'Premium', selected: false },
        { id: 'accessible', label: 'Accessible', selected: false },
      ]
    }
  ];

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    console.log('Applied filters:', filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    console.log('Cleared all filters');
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  return (
    <div style={{ padding: '20px' }}>
      <h2>FilterDrawer Example</h2>
      
      {/* Trigger Button */}
      <FilterTrigger
        onClick={() => setIsOpen(true)}
        activeCount={totalActiveFilters}
      >
        🔍 Filters
      </FilterTrigger>

      {/* Active Filters Display */}
      {totalActiveFilters > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3>Active Filters ({totalActiveFilters}):</h3>
          <pre>{JSON.stringify(activeFilters, null, 2)}</pre>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        title="Filter Stadium Sections"
        groups={filterGroups}
      />
    </div>
  );
}

// Example with pre-selected filters
export function FilterDrawerWithDefaults() {
  const [isOpen, setIsOpen] = useState(false);

  const filterGroupsWithDefaults: FilterGroup[] = [
    {
      id: 'sunExposure',
      label: 'Sun Exposure',
      options: [
        { id: 'full-shade', label: 'Full Shade', selected: true }, // Pre-selected
        { id: 'partial-shade', label: 'Partial Shade', selected: true }, // Pre-selected
        { id: 'some-sun', label: 'Some Sun', selected: false },
        { id: 'full-sun', label: 'Full Sun', selected: false },
      ]
    },
    {
      id: 'priceRange',
      label: 'Price Range',
      options: [
        { id: 'budget', label: '$0-$50', selected: false },
        { id: 'moderate', label: '$50-$100', selected: true }, // Pre-selected
        { id: 'premium', label: '$100-$200', selected: false },
        { id: 'luxury', label: '$200+', selected: false },
      ]
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>FilterDrawer with Pre-selected Options</h2>
      
      <FilterTrigger onClick={() => setIsOpen(true)}>
        ⚙️ Advanced Filters
      </FilterTrigger>

      <FilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={(filters) => console.log('Applied:', filters)}
        onClear={() => console.log('Cleared filters')}
        title="Advanced Filter Options"
        groups={filterGroupsWithDefaults}
      />
    </div>
  );
}