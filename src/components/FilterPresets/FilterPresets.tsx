import React from 'react';
import { SectionFilterValues } from '../SectionFilters/SectionFilters';
import styles from './FilterPresets.module.css';

export interface FilterPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  filters: SectionFilterValues;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'maximum-shade',
    label: 'Maximum Shade',
    icon: '☁️',
    description: 'Best shaded seats, covered preferred',
    filters: {
      maxSunExposure: 20,
      sectionType: ['covered'],
      priceRange: []
    }
  },
  {
    id: 'budget-friendly',
    label: 'Budget Friendly',
    icon: '💰',
    description: 'Value seats with good shade',
    filters: {
      maxSunExposure: 50,
      sectionType: [],
      priceRange: ['value', 'moderate']
    }
  },
  {
    id: 'close-shaded',
    label: 'Close & Shaded',
    icon: '🎯',
    description: 'Field/lower level with minimal sun',
    filters: {
      maxSunExposure: 30,
      sectionType: ['field', 'lower'],
      priceRange: []
    }
  },
  {
    id: 'accessible',
    label: 'Accessible',
    icon: '♿',
    description: 'Accessible sections, moderate shade',
    filters: {
      maxSunExposure: 50,
      sectionType: ['field', 'lower'],
      priceRange: []
    }
  }
];

interface FilterPresetsProps {
  currentFilters: SectionFilterValues;
  onPresetSelect: (filters: SectionFilterValues, presetId: string) => void;
  activePreset?: string | null;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({
  currentFilters,
  onPresetSelect,
  activePreset
}) => {
  // Determine if current filters match a preset
  const getActivePreset = (): string | null => {
    if (activePreset) return activePreset;

    for (const preset of FILTER_PRESETS) {
      const matchesMaxSun =
        preset.filters.maxSunExposure === currentFilters.maxSunExposure;

      const matchesSectionType =
        JSON.stringify([...preset.filters.sectionType].sort()) ===
        JSON.stringify([...currentFilters.sectionType].sort());

      const matchesPriceRange =
        JSON.stringify([...preset.filters.priceRange].sort()) ===
        JSON.stringify([...currentFilters.priceRange].sort());

      if (matchesMaxSun && matchesSectionType && matchesPriceRange) {
        return preset.id;
      }
    }

    return null;
  };

  const currentActivePreset = getActivePreset();
  const isCustom = !currentActivePreset && (
    currentFilters.maxSunExposure !== undefined ||
    currentFilters.sectionType.length > 0 ||
    currentFilters.priceRange.length > 0
  );

  return (
    <div className={styles.presetsContainer}>
      <div className={styles.presetsHeader}>
        <h4 className={styles.presetsTitle}>Filter Presets</h4>
        {isCustom && (
          <span className={styles.customBadge}>Custom</span>
        )}
      </div>

      <div className={styles.presetsGrid}>
        {FILTER_PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`${styles.presetCard} ${
              currentActivePreset === preset.id ? styles.active : ''
            }`}
            onClick={() => onPresetSelect(preset.filters, preset.id)}
            aria-pressed={currentActivePreset === preset.id}
            aria-label={`Apply ${preset.label} preset: ${preset.description}`}
          >
            <span className={styles.presetIcon}>{preset.icon}</span>
            <div className={styles.presetContent}>
              <span className={styles.presetLabel}>{preset.label}</span>
              <span className={styles.presetDescription}>{preset.description}</span>
            </div>
            {currentActivePreset === preset.id && (
              <span className={styles.activeIndicator} aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPresets;
