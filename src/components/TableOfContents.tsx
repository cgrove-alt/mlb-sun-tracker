'use client';

import React, { useState, useEffect, useRef } from 'react';
import './TableOfContents.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  containerRef?: React.RefObject<HTMLElement>;
  selector?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  containerRef, 
  selector = 'h2, h3' 
}) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef?.current || document;
    const elements = container.querySelectorAll(selector);
    
    const items: TocItem[] = Array.from(elements).map((elem) => {
      const heading = elem as HTMLHeadingElement;
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-') || `heading-${Math.random()}`;
      }
      
      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
    
    setHeadings(items);
  }, [containerRef, selector]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef?.current || document;
      const elements = container.querySelectorAll(selector);
      
      let currentActiveId = '';
      
      for (const elem of Array.from(elements)) {
        const rect = elem.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveId = elem.id;
        } else {
          break;
        }
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, selector, headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };

  if (headings.length === 0) {
    return null;
  }

  const tocContent = (
    <nav className="toc-nav" aria-label="Table of contents">
      <ul className="toc-list">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a 
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className="toc-link"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (isMobile) {
    return (
      <div className="toc-mobile">
        <button 
          className="toc-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle table of contents"
        >
          <span className="toc-toggle-text">Contents</span>
          <svg 
            className={`toc-toggle-icon ${isOpen ? 'open' : ''}`}
            width="20" 
            height="20" 
            viewBox="0 0 20 20"
          >
            <path 
              fill="currentColor" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="toc-dropdown">
            {tocContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="toc-sidebar">
      <h2 className="toc-title">On This Page</h2>
      {tocContent}
    </aside>
  );
};