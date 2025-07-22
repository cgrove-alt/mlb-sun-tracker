import React, { useEffect, useState, useCallback } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { seatgeekApi, SeatGeekEvent, SeatGeekListing, SEATGEEK_VENUE_IDS } from '../services/seatgeekApi';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { useTranslation } from '../i18n/i18nContext';
import { SeatGeekTicketFilter, TicketFilterCriteria } from './SeatGeekTicketFilter';
import './AffordableShadeSection.css';

interface AffordableShadeSectionProps {
  stadium: Stadium;
  sections: SeatingSectionSun[];
  gameDateTime: Date | null;
  selectedGame?: MLBGame | null;
}

interface AffordableSection {
  section: SeatingSectionSun;
  lowestPrice: number;
  listingCount: number;
  listings: SeatGeekListing[];
}

interface TicketData {
  event: SeatGeekEvent;
  allListings: Map<string, SeatGeekListing[]>;
  priceRange: { min: number; max: number };
}

export const AffordableShadeSection: React.FC<AffordableShadeSectionProps> = ({
  stadium,
  sections,
  gameDateTime,
  selectedGame
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [filteredSections, setFilteredSections] = useState<AffordableSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<TicketFilterCriteria>({
    priceRange: { min: 0, max: 100 },
    sunExposure: { min: 0, max: 20 },
    seatingLevels: [],
    coverage: 'any',
    showOnlyAvailable: true,
    sortBy: 'price',
    sortOrder: 'asc'
  });

  useEffect(() => {
    if (gameDateTime && SEATGEEK_VENUE_IDS[stadium.id]) {
      fetchTicketData();
    }
  }, [stadium.id, gameDateTime]);

  useEffect(() => {
    if (ticketData) {
      applyFilters();
    }
  }, [ticketData, filterCriteria]);

  const fetchTicketData = async (isRetry = false) => {
    setLoading(true);
    setError(null);
    setShowRetryButton(false);
    
    try {
      // Find the SeatGeek event for this game
      const gameEvent = await seatgeekApi.findGameEvent(stadium.id, gameDateTime!);
      
      if (!gameEvent) {
        setError(t('tickets.noTicketDataAvailable'));
        setTicketData(null);
        setShowRetryButton(false); // No retry for unavailable data
        return;
      }
      
      // Get all section names for API query
      const sectionNames = sections.map(s => s.section.name);
      
      // Fetch tickets for all sections (we'll filter later)
      const sectionListings = await seatgeekApi.getAffordableTicketsInSections(
        gameEvent.id,
        sectionNames,
        500 // High price limit to get all tickets
      );
      
      // Calculate price range
      let minPrice = Infinity;
      let maxPrice = 0;
      
      sectionListings.forEach(listings => {
        listings.forEach(listing => {
          minPrice = Math.min(minPrice, listing.price);
          maxPrice = Math.max(maxPrice, listing.price);
        });
      });
      
      const priceRange = {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice || 200
      };
      
      setTicketData({
        event: gameEvent,
        allListings: sectionListings,
        priceRange
      });
      
      // Update filter criteria with actual price range
      setFilterCriteria(prev => ({
        ...prev,
        priceRange: {
          min: priceRange.min,
          max: Math.min(priceRange.max, 100) // Default max to $100
        }
      }));
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (err) {
      console.error('Error fetching ticket data:', err);
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('credentials not configured')) {
          setError(t('tickets.ticketDataUnavailable'));
          setShowRetryButton(false); // No retry for missing configuration
        } else if (err.message.includes('Invalid client credentials')) {
          setError(t('tickets.invalidCredentials'));
          setShowRetryButton(false); // No retry for invalid credentials
        } else if (err.message.includes('403')) {
          setError(t('tickets.accessDenied'));
          setShowRetryButton(false); // No retry for access denied
        } else if (err.message.includes('429')) {
          setError(t('tickets.rateLimitExceeded'));
          setShowRetryButton(true);
        } else if (err.message.includes('timeout') || err.message.includes('network')) {
          setError(t('tickets.networkError'));
          setShowRetryButton(true);
        } else {
          setError(t('tickets.genericError'));
          setShowRetryButton(true);
        }
      } else {
        setError(t('tickets.genericError'));
        setShowRetryButton(true);
      }
      
      // Increment retry count
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      fetchTicketData(true);
    }
  };

  const applyFilters = useCallback(() => {
    if (!ticketData) return;
    
    const { allListings } = ticketData;
    const filtered: AffordableSection[] = [];
    
    // Filter sections based on criteria
    const eligibleSections = sections.filter(sectionData => {
      // Sun exposure filter
      const sunExposure = sectionData.sunExposure;
      if (sunExposure < filterCriteria.sunExposure.min || sunExposure > filterCriteria.sunExposure.max) {
        return false;
      }
      
      // Seating level filter
      if (filterCriteria.seatingLevels.length > 0 && 
          !filterCriteria.seatingLevels.includes(sectionData.section.level)) {
        return false;
      }
      
      // Coverage filter
      if (filterCriteria.coverage !== 'any') {
        const isCovered = sectionData.section.covered;
        if (filterCriteria.coverage === 'covered' && !isCovered) return false;
        if (filterCriteria.coverage === 'uncovered' && isCovered) return false;
      }
      
      return true;
    });
    
    // Build filtered sections with ticket data
    eligibleSections.forEach(sectionData => {
      const listings = allListings.get(sectionData.section.name);
      if (listings && listings.length > 0) {
        // Filter listings by price
        const priceFilteredListings = listings.filter(listing => 
          listing.price >= filterCriteria.priceRange.min && 
          listing.price <= filterCriteria.priceRange.max
        );
        
        if (priceFilteredListings.length > 0) {
          const lowestPrice = Math.min(...priceFilteredListings.map(l => l.price));
          filtered.push({
            section: sectionData,
            lowestPrice,
            listingCount: priceFilteredListings.length,
            listings: priceFilteredListings.sort((a, b) => a.price - b.price).slice(0, 3)
          });
        }
      }
    });
    
    // Sort results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filterCriteria.sortBy) {
        case 'price':
          aValue = a.lowestPrice;
          bValue = b.lowestPrice;
          break;
        case 'sunExposure':
          aValue = a.section.sunExposure;
          bValue = b.section.sunExposure;
          break;
        case 'section':
          aValue = a.section.section.name;
          bValue = b.section.section.name;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filterCriteria.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return filterCriteria.sortOrder === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    });
    
    setFilteredSections(filtered);
  }, [ticketData, filterCriteria, sections]);
  
  const handleBuyTickets = (section: AffordableSection) => {
    if (!ticketData) return;
    
    const url = seatgeekApi.generateTicketUrl(ticketData.event, {
      section: section.section.section.name,
      priceMax: filterCriteria.priceRange.max
    });
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!gameDateTime) {
    return null;
  }

  // Check if SeatGeek API is configured
  if (!seatgeekApi.isApiConfigured()) {
    return (
      <div className="affordable-shade-section">
        <div className="section-header">
          <h3>
            <span className="icon">🎟️</span>
            {t('tickets.ticketSearch')}
          </h3>
        </div>
        <div className="api-config-notice">
          <div className="config-notice-content">
            <h4>🔧 {t('tickets.apiConfigurationRequired')}</h4>
            <p>{t('tickets.ticketDataUnavailable')}</p>
            <div className="config-steps">
              <ol>
                <li>{t('tickets.configStep1')}</li>
                <li>{t('tickets.configStep2')}</li>
                <li>{t('tickets.configStep3')}</li>
              </ol>
            </div>
            <p className="config-note">{t('tickets.configNote')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!SEATGEEK_VENUE_IDS[stadium.id]) {
    return (
      <div className="affordable-shade-section">
        <div className="section-header">
          <h3>
            <span className="icon">🎟️</span>
            {t('tickets.ticketSearch')}
          </h3>
        </div>
        <div className="no-data">
          <p>{t('tickets.notAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="affordable-shade-section">
      <div className="section-header">
        <h3>
          <span className="icon">🎟️</span>
          {t('tickets.ticketSearch')}
        </h3>
        <p className="subtitle">
          {t('tickets.findTicketsDescription')}
        </p>
      </div>

      {ticketData && (
        <SeatGeekTicketFilter
          onFilterChange={setFilterCriteria}
          availableSections={sections}
          priceRange={ticketData.priceRange}
          disabled={loading}
        />
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('tickets.loading')}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          {showRetryButton && (
            <div className="error-actions">
              <button 
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="retry-button"
              >
                {retryCount >= 3 ? t('tickets.maxRetriesReached') : t('app.retry')}
              </button>
              {retryCount > 0 && (
                <span className="retry-count">
                  {t('tickets.retryAttempt', { count: retryCount, max: 3 })}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && filteredSections.length === 0 && ticketData && (
        <div className="no-results">
          <p>{t('tickets.noMatchingTickets')}</p>
          <a 
            href={ticketData.event.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-all-link"
          >
            {t('tickets.viewAllTickets')}
          </a>
        </div>
      )}

      {!loading && !error && filteredSections.length > 0 && (
        <div className="affordable-sections-list">
          <div className="results-summary">
            <p>{t('tickets.foundResults', { count: filteredSections.length })}</p>
          </div>
          
          {filteredSections.map((affordableSection) => (
            <div key={affordableSection.section.section.id} className="affordable-section-card">
              <div className="section-info">
                <h4>{affordableSection.section.section.name}</h4>
                <div className="section-details">
                  <span className="sun-exposure">
                    ☀️ {Math.round(affordableSection.section.sunExposure)}% {t('sections.sunExposure')}
                  </span>
                  <span className="level">
                    {t(`sections.levels.${affordableSection.section.section.level}`)}
                  </span>
                  {affordableSection.section.section.covered && (
                    <span className="covered-badge">
                      🏛️ {t('sections.covered')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="pricing-info">
                <div className="price-display">
                  <span className="from">{t('tickets.from')}</span>
                  <span className="price">${affordableSection.lowestPrice}</span>
                </div>
                <span className="listing-count">
                  {affordableSection.listingCount} {t('tickets.available')}
                </span>
              </div>

              <button
                className="buy-button"
                onClick={() => handleBuyTickets(affordableSection)}
                aria-label={t('tickets.buyTicketsFor', { section: affordableSection.section.section.name })}
              >
                {t('tickets.buyTickets')}
                <span className="arrow">→</span>
              </button>
            </div>
          ))}
          
          {ticketData && (
            <div className="view-all-section">
              <a 
                href={ticketData.event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-all-link"
              >
                {t('tickets.viewAllSections')}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};