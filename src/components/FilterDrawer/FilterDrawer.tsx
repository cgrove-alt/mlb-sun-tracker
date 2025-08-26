'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './FilterDrawer.module.css';

export interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string[]>) => void;
  onClear: () => void;
  title?: string;
  groups: FilterGroup[];
  className?: string;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onClear,
  title = 'Filter Options',
  groups,
  className = ''
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>({});
  const sheetRef = useRef<HTMLDivElement>(null);

  // Initialize local filters from groups
  useEffect(() => {
    const initialFilters: Record<string, string[]> = {};
    groups.forEach(group => {
      initialFilters[group.id] = group.options
        .filter(option => option.selected)
        .map(option => option.id);
    });
    setLocalFilters(initialFilters);
  }, [groups]);

  // Handle backdrop click
  const handleScrimClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOptionToggle = (groupId: string, optionId: string) => {
    setLocalFilters(prev => {
      const groupFilters = prev[groupId] || [];
      const isSelected = groupFilters.includes(optionId);
      
      return {
        ...prev,
        [groupId]: isSelected
          ? groupFilters.filter(id => id !== optionId)
          : [...groupFilters, optionId]
      };
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Record<string, string[]> = {};
    groups.forEach(group => {
      clearedFilters[group.id] = [];
    });
    setLocalFilters(clearedFilters);
    onClear();
    onClose();
  };

  const hasActiveFilters = Object.values(localFilters).some(filters => filters.length > 0);

  return (
    <>
      {/* Backdrop/Scrim */}
      <div 
        className={`${styles.scrim} ${isOpen ? styles.scrimOpen : ''} ${className}`}
        onClick={handleScrimClick}
        role="presentation"
      />

      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className={`${styles.sheet} ${isOpen ? styles.sheetOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
      >
        {/* Handle */}
        <div className={styles.handle} />

        {/* Header */}
        <div className={styles.header}>
          <h2 id="filter-drawer-title" className={styles.title}>
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {groups.map(group => (
            <div key={group.id} className={styles.group}>
              <div className={styles.label}>{group.label}</div>
              <div className={styles.chips}>
                {group.options.map(option => {
                  const isSelected = localFilters[group.id]?.includes(option.id) || false;
                  
                  return (
                    <button
                      key={option.id}
                      className={styles.chip}
                      data-selected={isSelected}
                      onClick={() => handleOptionToggle(group.id, option.id)}
                      type="button"
                      aria-pressed={isSelected}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={handleClear}
            type="button"
            disabled={!hasActiveFilters}
          >
            Clear All
          </button>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={handleApply}
            type="button"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// Trigger button component
export interface FilterTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  activeCount?: number;
}

export function FilterTrigger({ 
  onClick, 
  children, 
  className = '',
  activeCount 
}: FilterTriggerProps) {
  return (
    <button
      className={`${styles.trigger} ${className}`}
      onClick={onClick}
      type="button"
      aria-label={`Open filters${activeCount ? ` (${activeCount} active)` : ''}`}
    >
      {children}
      {activeCount && activeCount > 0 && (
        <span className="sr-only">{activeCount} filters active</span>
      )}
    </button>
  );
}