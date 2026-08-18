import React from 'react';
import { Stadium } from '../data/stadiums';

interface SectionShadeSEOProps {
  stadium: Stadium;
}

/**
 * SEO-optimized content component targeting "are my seats in the shade" queries
 * This content is hidden visually but visible to search engines
 */
export const SectionShadeSEO: React.FC<SectionShadeSEOProps> = ({ stadium }) => {
  // `sr-only` hides this visually but keeps it in the accessibility tree;
  // `aria-hidden="true"` removed it from that tree as well, so the content
  // reached nobody — neither sighted users nor screen reader users. Keeping
  // `sr-only` alone preserves the intent (crawlable, non-visual content).
  return (
    <div className="sr-only">
      <h2>Are My Seats in the Shade at {stadium.name}?</h2>
      
      <h3>Quick Shade Guide for {stadium.name} Sections</h3>
      <p>
        The published seating map establishes section identities at {stadium.name}. It does not establish
        remotely measured row elevations, overhang depths, or obstruction geometry, so exact seat-level shade
        results are not currently published.
      </p>

      <h3>What Can Be Verified?</h3>
      <p>
        Date, time, location, and astronomical sun position can be calculated. A permanent fixed roof
        also supports a venue-level conclusion that the seating bowl is protected from direct sun.
        Section and row boundaries require physical measurements and independent shadow observations.
      </p>

      <h3>Covered Seating Areas at {stadium.name}</h3>
      <p>
        {stadium.roof === 'fixed' ? 
          `${stadium.name} has a fixed roof, so the seating bowl is protected from direct sun.` :
          stadium.roof === 'retractable' ?
          `${stadium.name} has a retractable roof, so direct-sun exposure depends on the confirmed roof state for that event.` :
          `The current public source does not provide enough measured geometry to certify a row-by-row covered-seat list at ${stadium.name}.`
        }
      </p>

      <h3>Before Buying Tickets</h3>
      <ul>
        <li>Confirm roof state and covered-seat details with the venue.</li>
        <li>Treat solar orientation as context, not a row guarantee.</li>
        <li>Use sun protection for daytime games when coverage is uncertain.</li>
      </ul>

      <h3>Common "Are My Seats Shaded" Questions for {stadium.name}</h3>
      <p>
        "Are my seats in section 115 shaded?" "Will I be in the sun in the bleachers?" 
        "Which side of {stadium.name} has shade?" These are common questions fans ask when 
        buying tickets for {stadium.team} games. Those questions need measured stadium geometry;
        the site withholds precise answers until that evidence is available.
      </p>
    </div>
  );
};
