'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface ChipOption {
  id: string;
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ChipScrollerProps {
  options: ChipOption[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  className?: string;
  chipClassName?: string;
  selectedChipClassName?: string;
  disabledChipClassName?: string;
  multiple?: boolean;
  selectedIds?: string[];
  onMultiSelect?: (ids: string[]) => void;
  ariaLabel?: string;
}

export default function ChipScroller({
  options,
  onSelect,
  selectedId,
  className = '',
  chipClassName = '',
  selectedChipClassName = '',
  disabledChipClassName = '',
  multiple = false,
  selectedIds = [],
  onMultiSelect,
  ariaLabel = 'Filter options'
}: ChipScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  // Check if content overflows and scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (scrollerRef.current) {
        const { scrollWidth, clientWidth } = scrollerRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [options]);

  // Scroll selected item into view on mount or selection change
  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const selectedIndex = multiple
      ? options.findIndex(opt => selectedIds.includes(opt.id))
      : options.findIndex(opt => opt.id === selectedId);

    if (selectedIndex > -1) {
      const items = scrollerRef.current.querySelectorAll('[data-chip-item]');
      const selectedItem = items[selectedIndex] as HTMLElement;
      
      if (selectedItem) {
        // Smooth scroll to center the selected item
        const scrollerWidth = scrollerRef.current.clientWidth;
        const itemLeft = selectedItem.offsetLeft;
        const itemWidth = selectedItem.clientWidth;
        const scrollPosition = itemLeft - (scrollerWidth / 2) + (itemWidth / 2);
        
        scrollerRef.current.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedId, selectedIds, multiple, options]);

  const handleChipClick = (option: ChipOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newSelectedIds = selectedIds.includes(option.id)
        ? selectedIds.filter(id => id !== option.id)
        : [...selectedIds, option.id];
      
      onMultiSelect?.(newSelectedIds);
    } else {
      onSelect?.(option.id);
    }
  };

  const getChipClassName = (option: ChipOption) => {
    const classes = ['scroll-snap-start', chipClassName];

    const isSelected = multiple
      ? selectedIds.includes(option.id)
      : option.id === selectedId || option.selected;

    if (isSelected) {
      classes.push(selectedChipClassName);
    }

    if (option.disabled) {
      classes.push(disabledChipClassName);
    }

    return classes.filter(Boolean).join(' ');
  };

  return (
    <div
      ref={scrollerRef}
      className={`flex gap-2 overflow-x-auto px-4 scrollbar-none snap-x snap-proximity [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,transparent,black_24px),linear-gradient(to_left,transparent,black_24px)] [mask-composite:exclude] ${className}`}
      role="group"
      aria-label={ariaLabel}
      data-can-scroll={canScroll}
    >
      {options.map((option) => {
        const isSelected = multiple
          ? selectedIds.includes(option.id)
          : option.id === selectedId || option.selected;

        return (
          <button
            key={option.id}
            className={getChipClassName(option)}
            onClick={() => handleChipClick(option)}
            disabled={option.disabled}
            aria-pressed={isSelected}
            aria-disabled={option.disabled}
            type="button"
            data-chip-item
          >
            {option.icon && <span className="chip-icon">{option.icon}</span>}
            <span className="chip-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Simple Chip component for use outside of scroller
export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Chip({
  children,
  selected = false,
  onClick,
  disabled = false,
  className = '',
  icon
}: ChipProps) {
  return (
    <button
      className={`scroll-snap-start ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-disabled={disabled}
      type="button"
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{children}</span>
    </button>
  );
}