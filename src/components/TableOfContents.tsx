'use client';

import React, { useState, useEffect, useRef } from 'react';

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
    <nav className="text-sm" aria-label="Table of contents">
      <ul className="list-none m-0 p-0">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-5' : 'm-0'}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`
                block py-1.5 px-2 text-gray-600 no-underline border-l-2 border-l-transparent transition-all
                hover:text-gray-900 hover:bg-gray-50 hover:border-l-gray-300
                ${activeId === heading.id ? 'text-primary-700 bg-blue-50 border-l-primary-700 font-medium' : ''}
              `.trim().replace(/\s+/g, ' ')}
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
      <div className="my-4 relative">
        <button
          className="flex items-center justify-between w-full py-3 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle table of contents"
        >
          <span className="flex items-center gap-2">Contents</span>
          <svg
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.1)] max-h-[400px] overflow-y-auto animate-slide-down [&_.toc-nav]:p-3 [&_.toc-link]:py-2 [&_.toc-link]:px-3 [&_.toc-link]:rounded [&_.toc-link:hover]:bg-gray-100 [&_.toc-item.active_.toc-link]:bg-blue-50 [&_.toc-item.active_.toc-link]:text-primary-700 [&_.toc-item.active_.toc-link]:font-medium">
            {tocContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="sticky top-[100px] w-[250px] max-h-[calc(100vh-120px)] overflow-y-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm xl:w-[220px] lg:hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-600">
      <h2 className="text-base font-semibold text-gray-900 m-0 mb-4 pb-2 border-b border-gray-200">On This Page</h2>
      {tocContent}
    </aside>
  );
};