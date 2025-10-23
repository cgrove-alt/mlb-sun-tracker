'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { trackSearch, trackEvent } from '../utils/analytics';

interface SearchIndexSection {
  id: string;
  name: string;
  stadiumId: string;
  stadiumName: string;
  teamName: string;
  level: string;
  seats: number;
  keywords: string[];
  url: string;
}

interface SearchIndex {
  generated: string;
  version: string;
  totalSections: number;
  sections: SearchIndexSection[];
}

interface SeatSearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const RECENT_SEARCHES_KEY = 'shadium_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_MS = 300;

export function SeatSearchBar({
  placeholder = 'Search sections (e.g., "Section 101", "Dodger Stadium", "Field Level")',
  className = '',
  autoFocus = false,
}: SeatSearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchIndexSection[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchIndexSection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [fuse, setFuse] = useState<Fuse<SearchIndexSection> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load search index on mount
  useEffect(() => {
    async function loadSearchIndex() {
      try {
        const response = await fetch('/data/search/search-index.min.json');
        if (!response.ok) throw new Error('Failed to load search index');

        const data: SearchIndex = await response.json();
        setSearchIndex(data);

        // Initialize Fuse.js with optimized options
        const fuseInstance = new Fuse(data.sections, {
          keys: [
            { name: 'id', weight: 2.0 },
            { name: 'name', weight: 1.8 },
            { name: 'stadiumName', weight: 1.5 },
            { name: 'teamName', weight: 1.5 },
            { name: 'level', weight: 1.2 },
            { name: 'keywords', weight: 0.8 },
          ],
          threshold: 0.3,
          distance: 100,
          minMatchCharLength: 2,
          includeScore: true,
        });

        setFuse(fuseInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading search index:', error);
        setIsLoading(false);
      }
    }

    loadSearchIndex();
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save to recent searches
  const saveToRecent = useCallback((section: SearchIndexSection) => {
    setRecentSearches((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((s) => s.url !== section.url);
      const updated = [section, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }

      return updated;
    });
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    (query: string) => {
      if (!fuse) return;

      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      const searchResults = fuse.search(query, { limit: 5 });
      const resultItems = searchResults.map((result) => result.item);
      setResults(resultItems);
      setSelectedIndex(-1);

      // Track search in analytics
      trackSearch(query, resultItems.length);
    },
    [fuse]
  );

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, DEBOUNCE_MS);
  };

  // Handle result selection
  const handleSelect = (section: SearchIndexSection) => {
    saveToRecent(section);

    // Track search result click in analytics
    trackEvent(
      'search_result_click',
      'engagement',
      `${section.stadiumName} - ${section.name}`,
      undefined
    );

    setSearchTerm('');
    setIsOpen(false);
    router.push(section.url);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const displayResults = searchTerm.trim().length >= 2 ? results : recentSearches;

    if (!isOpen && e.key !== 'Escape') {
      setIsOpen(true);
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < displayResults.length) {
          handleSelect(displayResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display results (search results or recent searches)
  const displayResults = searchTerm.trim().length >= 2 ? results : recentSearches;
  const showDropdown = isOpen && displayResults.length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 pl-12 pr-4 text-base border-2 border-gray-300 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined
          }
          aria-autocomplete="list"
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto"
        >
          {/* Header */}
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
            {searchTerm.trim().length >= 2 ? 'Search Results' : 'Recent Searches'}
          </div>

          {/* Results List */}
          <ul className="py-2">
            {displayResults.map((section, index) => (
              <li
                key={section.url}
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-accent-50 border-l-4 border-accent-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                onClick={() => handleSelect(section)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Section Name */}
                    <div className="text-base font-semibold text-gray-900 truncate">
                      {section.name}
                    </div>

                    {/* Stadium & Level */}
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span className="truncate">{section.stadiumName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="capitalize">{section.level}</span>
                    </div>
                  </div>

                  {/* Seat Count */}
                  <div className="ml-4 text-right flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900">
                      {section.seats}
                    </div>
                    <div className="text-xs text-gray-500">seats</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && searchTerm.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-8 text-center"
        >
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No sections found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching by section number, stadium, or level
          </p>
        </div>
      )}
    </div>
  );
}
