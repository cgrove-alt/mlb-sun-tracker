import React, { useEffect, useState } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { seatgeekApi, SeatGeekEvent, SeatGeekListing, SEATGEEK_VENUE_IDS } from '../services/seatgeekApi';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { useTranslation } from '../i18n/i18nContext';
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

export const AffordableShadeSection: React.FC<AffordableShadeSectionProps> = ({
  stadium,
  sections,
  gameDateTime,
  selectedGame
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<SeatGeekEvent | null>(null);
  const [affordableShadedSections, setAffordableShadedSections] = useState<AffordableSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const MAX_PRICE = 40; // Maximum price threshold
  const MAX_SUN_EXPOSURE = 20; // Maximum sun exposure for "shaded" sections

  useEffect(() => {
    if (gameDateTime && SEATGEEK_VENUE_IDS[stadium.id]) {
      fetchTicketData();
    }
  }, [stadium.id, gameDateTime]);

  const fetchTicketData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Find the SeatGeek event for this game
      const gameEvent = await seatgeekApi.findGameEvent(stadium.id, gameDateTime!);
      
      if (!gameEvent) {
        setError('No ticket data available for this game');
        setAffordableShadedSections([]);
        return;
      }
      
      setEvent(gameEvent);
      
      // Filter sections that are in shade (low sun exposure)
      const shadedSections = sections.filter(s => s.sunExposure <= MAX_SUN_EXPOSURE);
      
      if (shadedSections.length === 0) {
        setAffordableShadedSections([]);
        return;
      }
      
      // Get section names for API query
      const sectionNames = shadedSections.map(s => s.section.name);
      
      // Fetch affordable tickets in these sections
      const sectionListings = await seatgeekApi.getAffordableTicketsInSections(
        gameEvent.id,
        sectionNames,
        MAX_PRICE
      );
      
      // Build affordable sections data
      const affordable: AffordableSection[] = [];
      
      shadedSections.forEach(sectionData => {
        const listings = sectionListings.get(sectionData.section.name);
        if (listings && listings.length > 0) {
          const lowestPrice = Math.min(...listings.map(l => l.price));
          affordable.push({
            section: sectionData,
            lowestPrice,
            listingCount: listings.length,
            listings: listings.sort((a, b) => a.price - b.price).slice(0, 3) // Top 3 cheapest
          });
        }
      });
      
      // Sort by lowest price
      affordable.sort((a, b) => a.lowestPrice - b.lowestPrice);
      setAffordableShadedSections(affordable);
      
    } catch (err) {
      console.error('Error fetching ticket data:', err);
      setError('Failed to load ticket information');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = (section: AffordableSection) => {
    if (!event) return;
    
    const url = seatgeekApi.generateTicketUrl(event, {
      section: section.section.section.name,
      priceMax: MAX_PRICE
    });
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!gameDateTime) {
    return null;
  }

  if (!SEATGEEK_VENUE_IDS[stadium.id]) {
    return (
      <div className="affordable-shade-section">
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
          {t('tickets.affordableShade', { price: MAX_PRICE })}
        </h3>
        <p className="subtitle">
          {t('tickets.shadedSeatsUnder', { price: MAX_PRICE, exposure: MAX_SUN_EXPOSURE })}
        </p>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('tickets.loading')}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && affordableShadedSections.length === 0 && (
        <div className="no-results">
          <p>{t('tickets.noAffordableShade')}</p>
          {event && (
            <a 
              href={event.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-all-link"
            >
              {t('tickets.viewAllTickets')}
            </a>
          )}
        </div>
      )}

      {!loading && !error && affordableShadedSections.length > 0 && (
        <div className="affordable-sections-list">
          {affordableShadedSections.map((affordableSection) => (
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
          
          {event && (
            <div className="view-all-section">
              <a 
                href={event.url} 
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