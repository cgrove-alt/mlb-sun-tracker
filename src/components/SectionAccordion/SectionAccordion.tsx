'use client';

import React, { useState, useId } from 'react';
import styles from './SectionAccordion.module.css';

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
        <div className={styles.ctaBar}>
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
    <div className={`${styles.item} ${isOpen ? styles.open : ''}`}>
      <button
        id={triggerId}
        className={styles.btn}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        type="button"
      >
        <span>{item.title}</span>
        <svg 
          className={styles.chev}
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
          className={styles.panel}
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
      className={variant === 'primary' ? styles.primary : styles.secondary}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}