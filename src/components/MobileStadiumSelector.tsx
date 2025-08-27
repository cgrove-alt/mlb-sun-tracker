import React, { useState, useMemo, useEffect } from 'react';
import { Stadium } from '../data/stadiums';
import { MobileStadiumCardSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';
import './MobileStadiumSelector.css';

interface MobileStadiumSelectorProps {
  stadiums: Stadium[];
  selectedStadium: Stadium | null;
  onStadiumSelect: (stadium: Stadium) => void;
  loading?: boolean;
}

export const MobileStadiumSelector: React.FC<MobileStadiumSelectorProps> = ({
  stadiums,
  selectedStadium,
  onStadiumSelect,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const loadingState = useLoadingState<Stadium[]>({ initialLoading: loading });

  const filteredStadiums = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return stadiums
      .filter(stadium => 
        stadium.name.toLowerCase().includes(query) ||
        stadium.team.toLowerCase().includes(query) ||
        stadium.city.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
  }, [stadiums, searchQuery]);

  const handleSelect = (stadium: Stadium) => {
    onStadiumSelect(stadium);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="mobile-stadium-selector">
      <button 
        className="mobile-stadium-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Select stadium"
      >
        <div className="mobile-stadium-trigger-content">
          <span className="mobile-stadium-label">Stadium</span>
          <span className="mobile-stadium-value">
            {selectedStadium ? selectedStadium.name : 'Choose a stadium'}
          </span>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="mobile-stadium-modal">
          <div className="mobile-stadium-modal-overlay" onClick={() => setIsOpen(false)} />
          <div className="mobile-stadium-modal-content">
            <div className="mobile-stadium-modal-header">
              <h2>Select Stadium</h2>
              <button 
                className="mobile-stadium-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mobile-stadium-search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mobile-stadium-search-icon">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
              </svg>
              <input
                type="search"
                className="mobile-stadium-search-input"
                placeholder="Search stadiums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mobile-stadium-list">
              {loading ? (
                // Show skeleton loaders while loading
                <>
                  {[1, 2, 3, 4, 5].map(i => (
                    <MobileStadiumCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredStadiums.length === 0 ? (
                <div className="mobile-stadium-empty">
                  <p>No stadiums found</p>
                </div>
              ) : (
                filteredStadiums.map(stadium => (
                  <button
                    key={stadium.id}
                    className={`mobile-stadium-item ${selectedStadium?.id === stadium.id ? 'selected' : ''} fade-in`}
                    onClick={() => handleSelect(stadium)}
                  >
                    <div className="mobile-stadium-item-content">
                      <div className="mobile-stadium-item-info">
                        <h3>{stadium.name}</h3>
                        <p>{stadium.team} • {stadium.city}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};