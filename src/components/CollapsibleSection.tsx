'use client';

import React, { useState, useRef, useEffect } from 'react';

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

  const titleSizeClass = level === 'h2' ? 'text-xl md:text-lg' : 'text-lg md:text-base';

  return (
    <div className={`mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white first:rounded-t-lg last:rounded-b-lg [&+&]:rounded-t-none [&+&]:mt-0 ${className}`}>
      <HeadingTag id={headingId} className="m-0 text-inherit">
        <button
          className={`flex items-center justify-between w-full py-4 px-5 md:py-3.5 md:px-4 bg-transparent border-0 text-inherit text-inherit font-inherit text-left cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${isOpen ? 'bg-gray-100' : ''}`}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={`${headingId}-content`}
        >
          <span className={`flex-1 ${titleSizeClass} font-semibold text-gray-900`}>{title}</span>
          <svg
            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
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
        className="overflow-hidden transition-[height] duration-300 motion-reduce:transition-none"
        style={{ height }}
        ref={contentRef}
      >
        <div className="px-5 pb-5 md:px-4 md:pb-4">
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
    <div className="flex flex-col gap-3">
      {enhancedChildren}
    </div>
  );
};