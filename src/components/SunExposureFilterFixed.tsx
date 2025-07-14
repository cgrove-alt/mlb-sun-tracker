import React, { useState } from 'react';

export interface SunFilterCriteria {
  minExposure?: number;
  maxExposure?: number;
  levels?: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>;
  covered?: boolean;
  priceRange?: Array<'value' | 'moderate' | 'premium' | 'luxury'>;
}

interface SunExposureFilterProps {
  onFilterChange: (criteria: SunFilterCriteria) => void;
  disabled?: boolean;
}

export const SunExposureFilterFixed: React.FC<SunExposureFilterProps> = ({
  onFilterChange,
  disabled = false
}) => {
  const [sunPreference, setSunPreference] = useState<'any' | 'avoid' | 'prefer'>('any');

  const handleSunPreferenceChange = (preference: 'any' | 'avoid' | 'prefer') => {
    setSunPreference(preference);
    
    let criteria: SunFilterCriteria = {};
    
    if (preference === 'avoid') {
      criteria.maxExposure = 20;
    } else if (preference === 'prefer') {
      criteria.minExposure = 60;
    }
    
    onFilterChange(criteria);
  };

  const clearFilters = () => {
    setSunPreference('any');
    onFilterChange({});
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h3 style={{margin: 0, color: '#333', fontSize: '1.2em'}}>
          🎯 Section Filter
        </h3>
        <button 
          onClick={clearFilters}
          disabled={disabled}
          style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.85em',
            color: '#6c757d',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>

      <div style={{marginBottom: '24px'}}>
        <h4 style={{margin: '0 0 12px 0', color: '#495057', fontSize: '1em', fontWeight: 600}}>
          ☀️ Sun Preference
        </h4>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="any"
              checked={sunPreference === 'any'}
              onChange={() => handleSunPreferenceChange('any')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
            />
            <span style={{fontSize: '0.9em', color: '#333'}}>Any (no preference)</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="avoid"
              checked={sunPreference === 'avoid'}
              onChange={() => handleSunPreferenceChange('avoid')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
            />
            <span style={{fontSize: '0.9em', color: '#333'}}>Avoid sun (≤20% exposure)</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="prefer"
              checked={sunPreference === 'prefer'}
              onChange={() => handleSunPreferenceChange('prefer')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
            />
            <span style={{fontSize: '0.9em', color: '#333'}}>Prefer sun (≥60% exposure)</span>
          </label>
        </div>
      </div>

      <div style={{
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '0.85em',
        color: '#6c757d'
      }}>
        💡 More filter options coming soon! Currently showing basic sun preferences.
      </div>
    </div>
  );
};