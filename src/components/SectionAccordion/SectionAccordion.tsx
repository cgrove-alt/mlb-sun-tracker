'use client';

import React, { useState, useId } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface SectionAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  renderCTA?: () => React.ReactNode;
}

export default function SectionAccordion({
  items,
  allowMultiple = false,
  className = '',
  renderCTA
}: SectionAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    items.forEach(item => {
      if (item.defaultOpen) {
        initial.add(item.id);
      }
    });
    return initial;
  });

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      
      return newSet;
    });
  };

  return (
    <>
      <div className={className}>
        {items.map((item) => (
          <AccordionPanel
            key={item.id}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
      
      {renderCTA && (
        <div className="sticky bottom-0 px-4 py-3 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white to-white/95 flex gap-3">
          {renderCTA()}
        </div>
      )}
    </>
  );
}

interface AccordionPanelProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionPanel({ item, isOpen, onToggle }: AccordionPanelProps) {
  const panelId = useId();
  const triggerId = useId();

  return (
    <div className="border-b border-gray-200">
      <button
        id={triggerId}
        className="flex justify-between items-center w-full px-4 py-3.5 font-semibold text-base text-ink-800"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        type="button"
      >
        <span>{item.title}</span>
        <svg
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="px-4 pb-3 text-ink-900"
          role="region"
          aria-labelledby={triggerId}
        >
          {item.content}
        </div>
      )}
    </div>
  );
}

// CTA Button component for use in renderCTA
export function AccordionCTA({
  children,
  onClick,
  variant = 'primary'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      className={variant === 'primary'
        ? 'flex-1 rounded-xl px-3 py-3 bg-ink-800 text-white font-semibold text-center'
        : 'flex-1 rounded-xl px-3 py-3 bg-gray-50 border border-gray-200 text-ink-800 font-semibold text-center'
      }
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}