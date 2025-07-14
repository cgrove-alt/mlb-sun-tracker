import React from 'react';

export interface SunFilterCriteria {
  minExposure?: number;
  maxExposure?: number;
}

interface SimpleFilterProps {
  onFilterChange: (criteria: SunFilterCriteria) => void;
  disabled?: boolean;
}

export const SimpleFilter: React.FC<SimpleFilterProps> = ({
  onFilterChange,
  disabled = false
}) => {
  return (
    <div style={{border: '3px solid purple', background: 'lightpurple', padding: '20px'}}>
      <h3>🎯 Simple Filter Test</h3>
      <p>This is a minimal filter component to test if the issue is with the complex component.</p>
      <button onClick={() => onFilterChange({minExposure: 0, maxExposure: 20})}>
        Avoid Sun
      </button>
      <button onClick={() => onFilterChange({minExposure: 60, maxExposure: 100})}>
        Prefer Sun
      </button>
      <button onClick={() => onFilterChange({})}>
        Show All
      </button>
    </div>
  );
};