'use client';

import React from 'react';
import { StadiumGuide } from '../data/stadiumGuides';
import { getUnifiedVenueById } from '../data/unifiedVenues';
import Link from 'next/link';
import {
  MapPinIcon,
  ClockIcon,
  SunIcon,
  CloudIcon,
  DropletIcon
} from './Icons';
import StadiumTitleBlock from './StadiumTitleBlock';
import { StadiumTitleData } from './StadiumTitleBlock';
import { FidelityNotice } from './FidelityNotice';
import { ShadeAnswer } from './ShadeAnswer';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import './StadiumGuide.css';

interface ComprehensiveStadiumGuideProps {
  stadiumId: string;
  // R1: guide + bowl sections + fidelity note are passed in by the server (or an
  // already-deferred client tree) instead of being looked up here. This keeps
  // ComprehensiveStadiumGuide — which renders ssr:true and is therefore in the
  // venue page's first-load bundle — from statically importing the full guides
  // (3.1 MB), venueSections (0.73 MB) and stadium-data-aggregator (2.25 MB)
  // datasets. The page loads only the current venue's data.
  guide: StadiumGuide | undefined;
  // Precomputed fidelity note (see FidelityNotice). null/undefined = no note.
  fidelityNote?: string | null;
  // When false, the guide's own title block (H1) is suppressed — used on MLB
  // stadium pages where StadiumPageSSR already renders the single H1/header.
  showTitleBlock?: boolean;
}

const ComprehensiveStadiumGuide: React.FC<ComprehensiveStadiumGuideProps> = ({
  stadiumId,
  guide,
  fidelityNote,
  showTitleBlock = true,
}) => {
  // The structured venue record is the single source of truth for header
  // facts (location, capacity, orientation, league). Previously these came
  // from the guide's free-text neighborhood string, which produced the
  // "South Bronx," (missing state) bug, a hardcoded 'MLB' league for MiLB/NFL,
  // and a capacity that conflicted with the canonical value.
  const venue = getUnifiedVenueById(stadiumId);
  
  // Debug logging
  if (typeof window !== 'undefined' && guide) {

  }
  
  if (!guide) {
    return (
      <div className="stadium-guide comprehensive">
        <div className="guide-section">
          <h2>Stadium Guide Not Available</h2>
          <p>We're still working on the comprehensive guide for this stadium.</p>
          <p className="text-sm text-gray-600 mt-2">Stadium ID: {stadiumId}</p>
        </div>
      </div>
    );
  }

  // Prepare data for StadiumTitleBlock
  const titleData: StadiumTitleData = {
    purpose: 'shade-guide',
    stadium: {
      name: venue?.name ?? guide.name,
      id: stadiumId
    },
    team: {
      name: venue?.team ?? guide.team,
      league: venue?.league ?? 'MLB'
    },
    quickFacts: {
      location: {
        city: venue?.city ?? (guide.neighborhood.name.split(',')[0] || guide.neighborhood.name),
        state: venue?.state ?? (guide.neighborhood.name.split(',')[1]?.trim() || '')
      },
      capacity: venue?.capacity ?? guide.capacity,
      orientation: venue?.orientation ?? 0,
      roofType: venue?.roof ?? 'open',
      yearBuilt: venue?.opened ?? guide.opened
    }
  };

  return (
    <div className="stadium-guide comprehensive">
      {showTitleBlock && (
        <StadiumTitleBlock
          data={titleData}
          showBreadcrumb={true}
        />
      )}

      {/* Answer-first summary — only when standalone (MLB pages get it from
          StadiumPageSSR instead, so it isn't duplicated). */}
      {showTitleBlock && venue && (
        <ShadeAnswer name={venue.name} orientation={venue.orientation} roof={venue.roof} />
      )}

      {/* The interactive shade diagram is intentionally NOT rendered for MiLB/NFL
          venues: their section geometry is a generated template (MiLB) or has
          unmeasured/zero orientation (many NFL), so a section-level shade diagram
          there would imply accuracy the data can't support. These venues rely on
          the structural section table instead, which is orientation-independent
          and honest everywhere. The diagram is MLB-only (see StadiumPageSSR). */}

      <FidelityNotice note={fidelityNote} />

      {/* Overview Section */}
      <section className="guide-section">
        <h2>Overview</h2>
        <p>{guide.overview.description}</p>
        <div className="highlights">
          <h3>Stadium Highlights</h3>
          <ul>
            {guide.overview.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </div>
        {guide.overview.uniqueFeatures && (
          <div className="unique-features">
            <h3>Unique Features</h3>
            <ul>
              {guide.overview.uniqueFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Shade Guide Section */}
      <section className="guide-section shade-guide">
        <h2>Shade & Sun Protection Guide</h2>
        
        <div className="shade-by-time">
          <h3>Best Shaded Sections by Time</h3>
          <div className="time-grid">
            <div className="time-slot">
              <h4>Morning Games</h4>
              <ul>
                {guide.shadeGuide.bestShadedSections.morning.map((section, idx) => (
                  <li key={idx}>{section}</li>
                ))}
              </ul>
            </div>
            <div className="time-slot">
              <h4>Afternoon Games</h4>
              <ul>
                {guide.shadeGuide.bestShadedSections.afternoon.map((section, idx) => (
                  <li key={idx}>{section}</li>
                ))}
              </ul>
            </div>
            <div className="time-slot">
              <h4>Evening Games</h4>
              <ul>
                {guide.shadeGuide.bestShadedSections.evening.map((section, idx) => (
                  <li key={idx}>{section}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="shade-tips">
          <h3>Shade Tips</h3>
          <ul>
            {guide.shadeGuide.shadeTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="weather-patterns">
          <h3>Monthly Weather Patterns</h3>
          <div className="weather-grid">
            {guide.shadeGuide.monthlyPatterns.map((pattern, idx) => (
              <div key={idx} className="weather-month">
                <h4>{pattern.month}</h4>
                <div className="weather-stats">
                  <span><SunIcon size={16} /> {pattern.avgTemp}°F</span>
                  <span><DropletIcon size={16} /> {pattern.avgHumidity}%</span>
                  <span><CloudIcon size={16} /> {pattern.rainChance}% rain</span>
                </div>
                <p className="conditions">{pattern.typicalConditions}</p>
                <p className="shade-tip">{pattern.shadeTip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seating Guide */}
      <section className="guide-section seating-guide">
        <h2>Seating Guide</h2>
        
        {guide.seatingGuide.premiumSeating && (
          <div className="premium-seating">
            <h3>Premium Seating Options</h3>
            {guide.seatingGuide.premiumSeating.clubs && (
              <div className="clubs">
                <h4>Club Levels</h4>
                {guide.seatingGuide.premiumSeating.clubs.map((club, idx) => (
                  <div key={idx} className="club-info">
                    <h5>{club.name}</h5>
                    <p>{club.access}</p>
                    <ul>
                      {club.perks.map((perk, pidx) => (
                        <li key={pidx}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="seating-tips">
          <h3>Seating Tips</h3>
          <div className="tips-grid">
            {guide.seatingGuide.tips.map((tip, idx) => (
              <div key={idx} className={`tip-card ${tip.category}`}>
                <h4>{tip.section}</h4>
                <p>{tip.tip}</p>
                <span className="category-badge">{tip.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="budget-options">
          <h3>Budget-Friendly Options</h3>
          <ul>
            {guide.seatingGuide.budgetOptions.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Concessions */}
      <section className="guide-section concessions">
        <h2>Food & Drink</h2>
        
        <div className="signature-items">
          <h3>Signature Items</h3>
          <ul>
            {guide.concessions.signature.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="local-favorites">
          <h3>Local Favorites</h3>
          <ul>
            {guide.concessions.local.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {guide.concessions.alcohol && (
          <div className="beverages">
            <h3>Beer & Beverages</h3>
            <ul>
              {guide.concessions.alcohol.beer.map((beer, idx) => (
                <li key={idx}>{beer}</li>
              ))}
            </ul>
            {guide.concessions.alcohol.localBreweries && (
              <p>Local breweries: {guide.concessions.alcohol.localBreweries.join(', ')}</p>
            )}
          </div>
        )}
      </section>

      {/* Transportation & Parking */}
      <section className="guide-section transportation">
        <h2>Getting There</h2>
        
        <div className="address">
          <h3>Address</h3>
          <p>{guide.transportation.address}</p>
        </div>

        <div className="parking">
          <h3>Parking Options</h3>
          <div className="parking-lots">
            {guide.parking.lots.map((lot, idx) => (
              <div key={idx} className="lot-info">
                <h4>{lot.name}</h4>
                <div className="lot-details">
                  <span>Distance: {lot.distance}</span>
                  <span>Price: {lot.price}</span>
                  {lot.covered && <span>✓ Covered</span>}
                  {lot.shadedSpots && <span>✓ Shaded spots</span>}
                </div>
                {lot.tip && <p className="tip">{lot.tip}</p>}
              </div>
            ))}
          </div>
        </div>

        {guide.parking.alternativeTransport && (
          <div className="alternative-transport">
            <h3>Alternative Transportation</h3>
            {guide.parking.alternativeTransport.publicTransit && (
              <div>
                <h4>Public Transit</h4>
                <ul>
                  {guide.parking.alternativeTransport.publicTransit.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            )}
            {guide.parking.alternativeTransport.rideShare && (
              <p><strong>Ride Share:</strong> {guide.parking.alternativeTransport.rideShare}</p>
            )}
          </div>
        )}
      </section>

      {/* Game Day Tips */}
      <section className="guide-section gameday">
        <h2>Game Day Tips</h2>
        <div className="tips-grid">
          {guide.gameDay.tips.map((tip, idx) => (
            <div key={idx} className={`gameday-tip ${tip.category}`}>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>

        <div className="schedule">
          <h3>Typical Game Day Schedule</h3>
          <ul>
            <li><ClockIcon size={16} /> Gates Open: {guide.gameDay.typicalSchedule.gatesOpen}</li>
            <li><ClockIcon size={16} /> First Pitch: {guide.gameDay.typicalSchedule.firstPitch}</li>
            {guide.gameDay.typicalSchedule.battingPractice && (
              <li><ClockIcon size={16} /> Batting Practice: {guide.gameDay.typicalSchedule.battingPractice}</li>
            )}
          </ul>
        </div>
      </section>

      {/* Neighborhood */}
      <section className="guide-section neighborhood">
        <h2>Neighborhood: {guide.neighborhood.name}</h2>
        <p>{guide.neighborhood.description}</p>
        
        <div className="neighborhood-options">
          <div className="before-game">
            <h3>Before the Game</h3>
            <ul>
              {guide.neighborhood.beforeGame.map((place, idx) => (
                <li key={idx}>{place}</li>
              ))}
            </ul>
          </div>
          
          <div className="after-game">
            <h3>After the Game</h3>
            <ul>
              {guide.neighborhood.afterGame.map((place, idx) => (
                <li key={idx}>{place}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="guide-section pro-tips">
        <h2>Insider Tips</h2>
        
        <div className="insider-tips">
          <h3>Pro Tips</h3>
          <ul>
            {guide.proTips.insiderTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="best-value">
          <h3>Best Value</h3>
          <ul>
            {guide.proTips.bestValue.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        {guide.proTips.hiddenGems && (
          <div className="hidden-gems">
            <h3>Hidden Gems</h3>
            <ul>
              {guide.proTips.hiddenGems.map((gem, idx) => (
                <li key={idx}>{gem}</li>
              ))}
            </ul>
          </div>
        )}

        {guide.proTips.avoidThese && (
          <div className="avoid-these">
            <h3>Things to Avoid</h3>
            <ul>
              {guide.proTips.avoidThese.map((avoid, idx) => (
                <li key={idx}>{avoid}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* History */}
      {guide.history && (
        <section className="guide-section history">
          <h2>Stadium History</h2>
          
          {guide.history.timeline && (
            <div className="timeline">
              <h3>Timeline</h3>
              <div className="timeline-events">
                {guide.history.timeline.map((event, idx) => (
                  <div key={idx} className="timeline-event">
                    <span className="year">{event.year}</span>
                    <span className="event">{event.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {guide.history.traditions && (
            <div className="traditions">
              <h3>Stadium Traditions</h3>
              {guide.history.traditions.map((tradition, idx) => (
                <div key={idx} className="tradition">
                  <h4>{tradition.name}</h4>
                  <p>{tradition.description}</p>
                </div>
              ))}
            </div>
          )}

          {guide.history.retired && (
            <div className="retired-numbers">
              <h3>Retired Numbers</h3>
              <div className="numbers-grid">
                {guide.history.retired.map((retired, idx) => (
                  <div key={idx} className="retired-number">
                    <span className="number">#{retired.number}</span>
                    <span className="player">{retired.player}</span>
                    <span className="year">({retired.year})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ComprehensiveStadiumGuide;