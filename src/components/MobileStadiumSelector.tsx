import React, { useState, useMemo, useEffect } from 'react';
import { Stadium } from '../data/stadiums';
import { MobileStadiumCardSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';

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
    <div className="w-full mb-4">
      <button
        className="flex items-center justify-between w-full min-h-[48px] px-4 py-2 bg-white border border-gray-200 rounded-md text-base cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2 active:bg-gray-50"
        onClick={() => setIsOpen(true)}
        aria-label="Select stadium"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm text-gray-600">Stadium</span>
          <span className="font-medium text-gray-900">
            {selectedStadium ? selectedStadium.name : 'Choose a stadium'}
          </span>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1050] flex items-end md:items-center md:p-8">
          <div className="absolute inset-0 bg-black/50 animate-modal-fade-in" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-2xl flex flex-col animate-slide-up md:max-w-[500px] md:max-h-[70vh] md:mx-auto md:rounded-2xl md:mb-8">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h2 className="m-0 text-lg font-semibold text-gray-900">Select Stadium</h2>
              <button
                className="flex items-center justify-center w-10 h-10 bg-transparent border-0 rounded-full cursor-pointer text-gray-600 active:bg-gray-50"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="relative px-4 py-4 border-b border-gray-200">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
              </svg>
              <input
                type="search"
                className="w-full min-h-[48px] px-2 pl-10 bg-gray-50 border border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-primary-700"
                placeholder="Search stadiums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] p-2">
              {loading ? (
                // Show skeleton loaders while loading
                <>
                  {[1, 2, 3, 4, 5].map(i => (
                    <MobileStadiumCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredStadiums.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-600">
                  <p className="m-0">No stadiums found</p>
                </div>
              ) : (
                filteredStadiums.map((stadium, index) => (
                  <button
                    key={stadium.id}
                    className={`
                      block w-full p-4 mb-2 bg-white border border-gray-200 rounded-md text-left cursor-pointer transition-all relative animate-fade-in-scale
                      ${selectedStadium?.id === stadium.id ? 'bg-blue-50 border-primary-700' : ''}
                      active:scale-[0.98]
                    `.trim().replace(/\s+/g, ' ')}
                    onClick={() => handleSelect(stadium)}
                    style={{ animationDelay: `${Math.min(index * 50, 250)}ms` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="m-0 mb-1 text-base font-semibold text-gray-900">{stadium.name}</h3>
                        <p className="m-0 text-sm text-gray-600">{stadium.team} • {stadium.city}</p>
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