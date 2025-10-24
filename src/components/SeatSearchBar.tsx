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

interface SeatSearchEntry {
  id: string;
  sectionId: string;
  sectionName: string;
  row: string;
  seatNumber: string;
  covered: boolean;
  viewQuality?: string;
  seatType: string;
  wheelchairAccessible: boolean;
  isAisle: boolean;
  elevation?: number;
  keywords: string[];
  url: string;
}

interface StadiumSeatIndex {
  stadiumId: string;
  stadiumName: string;
  teamName: string;
  generated: string;
  version: string;
  totalSections: number;
  totalSeats: number;
  seats: SeatSearchEntry[];
}

type SearchResult = SearchIndexSection | SeatSearchEntry;

interface SeatSearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  stadiumId?: string; // Optional stadium ID for seat-level search
}

const RECENT_SEARCHES_KEY = 'shadium_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_MS = 300;

// Helper function to check if result is a seat
function isSeatResult(result: SearchResult): result is SeatSearchEntry {
  return 'seatNumber' in result;
}

export function SeatSearchBar({
  placeholder = 'Search sections or seats (e.g., "Section 101", "Row G", "Seat 12")',
  className = '',
  autoFocus = false,
  stadiumId,
}: SeatSearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionResults, setSectionResults] = useState<SearchIndexSection[]>([]);
  const [seatResults, setSeatResults] = useState<SeatSearchEntry[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [seatIndex, setSeatIndex] = useState<StadiumSeatIndex | null>(null);
  const [sectionFuse, setSectionFuse] = useState<Fuse<SearchIndexSection> | null>(null);
  const [seatFuse, setSeatFuse] = useState<Fuse<SeatSearchEntry> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load search indices on mount
  useEffect(() => {
    async function loadSearchIndices() {
      try {
        // Always load section index
        const sectionResponse = await fetch('/data/search/search-index.min.json');
        if (!sectionResponse.ok) throw new Error('Failed to load section index');

        const sectionData: SearchIndex = await sectionResponse.json();
        setSearchIndex(sectionData);

        // Initialize section Fuse.js
        const sectionFuseInstance = new Fuse(sectionData.sections, {
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

        setSectionFuse(sectionFuseInstance);

        // Load seat index if stadiumId is provided
        if (stadiumId) {
          try {
            const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
            const seatResponse = await fetch(`/data/search/${seatDataStadiumId}-seats.min.json`);

            if (seatResponse.ok) {
              const seatData: StadiumSeatIndex = await seatResponse.json();
              setSeatIndex(seatData);

              // Initialize seat Fuse.js
              const seatFuseInstance = new Fuse(seatData.seats, {
                keys: [
                  { name: 'sectionId', weight: 2.0 },
                  { name: 'sectionName', weight: 1.8 },
                  { name: 'row', weight: 2.5 },
                  { name: 'seatNumber', weight: 2.5 },
                  { name: 'keywords', weight: 1.0 },
                ],
                threshold: 0.3,
                distance: 100,
                minMatchCharLength: 1,
                includeScore: true,
              });

              setSeatFuse(seatFuseInstance);
            }
          } catch (seatError) {
            console.warn('Seat index not available for this stadium:', seatError);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading search indices:', error);
        setIsLoading(false);
      }
    }

    loadSearchIndices();
  }, [stadiumId]);

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
  const saveToRecent = useCallback((result: SearchResult) => {
    setRecentSearches((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((s) => s.url !== result.url);
      const updated = [result, ...filtered].slice(0, MAX_RECENT_SEARCHES);

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
      if (!sectionFuse) return;

      if (query.trim().length < 1) {
        setSectionResults([]);
        setSeatResults([]);
        return;
      }

      // Search sections (limit to 2)
      const sectionSearchResults = sectionFuse.search(query, { limit: 2 });
      const sectionItems = sectionSearchResults.map((result) => result.item);
      setSectionResults(sectionItems);

      // Search seats if seat index is available (limit to 3)
      let seatItems: SeatSearchEntry[] = [];
      if (seatFuse) {
        const seatSearchResults = seatFuse.search(query, { limit: 3 });
        seatItems = seatSearchResults.map((result) => result.item);
        setSeatResults(seatItems);
      }

      setSelectedIndex(-1);

      // Track search in analytics
      trackSearch(query, sectionItems.length + seatItems.length);
    },
    [sectionFuse, seatFuse]
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
  const handleSelect = (result: SearchResult) => {
    saveToRecent(result);

    // Track search result click in analytics
    const label = isSeatResult(result)
      ? `${result.sectionName} - Row ${result.row}, Seat ${result.seatNumber}`
      : `${(result as SearchIndexSection).stadiumName} - ${(result as SearchIndexSection).name}`;

    trackEvent(
      'search_result_click',
      'engagement',
      label,
      undefined
    );

    setSearchTerm('');
    setIsOpen(false);
    router.push(result.url);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Combine section and seat results for keyboard navigation
    const displayResults: SearchResult[] = searchTerm.trim().length >= 1
      ? [...sectionResults, ...seatResults]
      : recentSearches;

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
  const hasSearchTerm = searchTerm.trim().length >= 1;
  const displayResults: SearchResult[] = hasSearchTerm
    ? [...sectionResults, ...seatResults]
    : recentSearches;
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
          {/* Recent Searches */}
          {!hasSearchTerm && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                Recent Searches
              </div>
              <ul className="py-2">
                {recentSearches.map((result, index) => (
                  <li
                    key={result.url}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent-50 border-l-4 border-accent-500'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {isSeatResult(result) ? (
                      // Seat Result
                      <div className="flex flex-col gap-1">
                        <div className="text-base font-semibold text-gray-900">
                          {result.sectionName} • Row {result.row} • Seat {result.seatNumber}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {result.covered && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Covered
                            </span>
                          )}
                          {result.isAisle && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Aisle
                            </span>
                          )}
                          {result.wheelchairAccessible && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Wheelchair
                            </span>
                          )}
                          {result.viewQuality && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {result.viewQuality}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Section Result
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-gray-900 truncate">
                            {result.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <span className="truncate">{result.stadiumName}</span>
                            <span className="text-gray-400">•</span>
                            <span className="capitalize">{result.level}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <div className="text-sm font-medium text-gray-900">
                            {result.seats}
                          </div>
                          <div className="text-xs text-gray-500">seats</div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Search Results - Sections */}
          {hasSearchTerm && sectionResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                Sections
              </div>
              <ul className="py-2">
                {sectionResults.map((section, index) => (
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
                        <div className="text-base font-semibold text-gray-900 truncate">
                          {section.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <span className="truncate">{section.stadiumName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="capitalize">{section.level}</span>
                        </div>
                      </div>
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
            </>
          )}

          {/* Search Results - Seats */}
          {hasSearchTerm && seatResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                Individual Seats
              </div>
              <ul className="py-2">
                {seatResults.map((seat, index) => {
                  const globalIndex = sectionResults.length + index;
                  return (
                    <li
                      key={seat.url}
                      id={`search-result-${globalIndex}`}
                      role="option"
                      aria-selected={globalIndex === selectedIndex}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        globalIndex === selectedIndex
                          ? 'bg-accent-50 border-l-4 border-accent-500'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => handleSelect(seat)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-base font-semibold text-gray-900">
                          {seat.sectionName} • Row {seat.row} • Seat {seat.seatNumber}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {seat.covered && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Covered
                            </span>
                          )}
                          {seat.isAisle && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Aisle
                            </span>
                          )}
                          {seat.wheelchairAccessible && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Wheelchair
                            </span>
                          )}
                          {seat.viewQuality && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {seat.viewQuality}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && hasSearchTerm && sectionResults.length === 0 && seatResults.length === 0 && !isLoading && (
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
          <p className="text-gray-600 font-medium">No results found</p>
          <p className="text-sm text-gray-500 mt-1">
            {stadiumId
              ? 'Try searching by section, row, or seat number'
              : 'Try searching by section number, stadium, or level'}
          </p>
        </div>
      )}
    </div>
  );
}
