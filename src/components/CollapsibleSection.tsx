'use client';

import React, { useState, useRef, useEffect } from 'react';
import './CollapsibleSection.css';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  level?: 'h2' | 'h3';
  id?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  level = 'h2',
  id
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const HeadingTag = level;

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
      
      const timer = setTimeout(() => {
        setHeight(undefined);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setHeight(contentRef.current.scrollHeight);
      
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const headingId = id || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  return (
    <div className={`collapsible-section ${className} ${isOpen ? 'open' : ''}`}>
      <HeadingTag id={headingId} className="collapsible-header">
        <button
          className="collapsible-trigger"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={`${headingId}-content`}
        >
          <span className="collapsible-title">{title}</span>
          <svg
            className="collapsible-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </HeadingTag>
      <div
        id={`${headingId}-content`}
        className="collapsible-content"
        style={{ height }}
        ref={contentRef}
      >
        <div className="collapsible-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

interface CollapsibleGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
}

export const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({
  children,
  allowMultiple = true
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const handleItemToggle = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    } else {
      setOpenItems(new Set([index]));
    }
  };

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === CollapsibleSection) {
      return React.cloneElement(child as React.ReactElement<any>, {
        defaultOpen: openItems.has(index),
        onToggle: () => handleItemToggle(index)
      });
    }
    return child;
  });

  return (
    <div className="collapsible-group">
      {enhancedChildren}
    </div>
  );
};