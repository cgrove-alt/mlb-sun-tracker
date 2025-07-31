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
  const popularSections = [
    { level: 'Field Level', sections: ['101', '102', '103', '104', '105'] },
    { level: 'Club Level', sections: ['201', '202', '203', '204', '205'] },
    { level: 'Upper Deck', sections: ['301', '302', '303', '304', '305'] },
  ];

  return (
    <div className="sr-only" aria-hidden="true">
      <h2>Are My Seats in the Shade at {stadium.name}?</h2>
      
      <h3>Quick Shade Guide for {stadium.name} Sections</h3>
      <p>
        Wondering "are my seats shaded" at {stadium.name}? Our real-time shade tracker shows you exactly 
        which seats are in the shade for any {stadium.team} game. Whether you're sitting in the field level, 
        club level, or upper deck, we'll help you find shaded seats and avoid sun exposure.
      </p>

      {popularSections.map(level => (
        <div key={level.level}>
          <h4>Are {level.level} Seats Shaded at {stadium.name}?</h4>
          <p>
            {level.level} sections {level.sections.join(', ')} at {stadium.name} have varying shade coverage 
            throughout the game. Sections on the third base side typically get shade earlier, while first 
            base side sections may have afternoon shade. Use our shade calculator to check if your specific 
            seats in {level.level} will be shaded during your game.
          </p>
        </div>
      ))}

      <h3>Best Shaded Seats at {stadium.name} by Game Time</h3>
      
      <h4>Day Games (12:00 PM - 4:00 PM)</h4>
      <p>
        For day games at {stadium.name}, the best shaded seats are typically found in the upper deck 
        sections on the third base side. These seats get shade from the stadium overhang and are 
        protected from direct sunlight. Field level seats behind home plate may also have shade 
        depending on the time of year.
      </p>

      <h4>Evening Games (6:00 PM - 8:00 PM)</h4>
      <p>
        Evening games at {stadium.name} start with sun exposure on the first base side. As the game 
        progresses, more sections become shaded. By the middle innings, most of the stadium is in 
        shade except for outfield sections.
      </p>

      <h3>Covered Seating Areas at {stadium.name}</h3>
      <p>
        {stadium.roof === 'fixed' ? 
          `${stadium.name} has a fixed roof, so all seats are protected from sun and rain.` :
          stadium.roof === 'retractable' ?
          `${stadium.name} features a retractable roof. When closed, all seats are shaded. When open, use our tool to find shaded sections.` :
          `${stadium.name} has covered seating in premium areas and upper deck overhangs. These permanently shaded seats are ideal for hot sunny days.`
        }
      </p>

      <h3>Tips for Finding Shaded Seats at {stadium.name}</h3>
      <ul>
        <li>Third base side sections typically get shade first during day games</li>
        <li>Upper deck seats often have overhead coverage providing shade</li>
        <li>Club level seats may have shade from luxury box overhangs</li>
        <li>Behind home plate sections can offer shade from the press box overhang</li>
        <li>Check game time - afternoon games have different shade patterns than evening games</li>
        <li>Consider the season - sun angles change throughout the baseball season</li>
      </ul>

      <h3>Common "Are My Seats Shaded" Questions for {stadium.name}</h3>
      <p>
        "Are my seats in section 115 shaded?" "Will I be in the sun in the bleachers?" 
        "Which side of {stadium.name} has shade?" These are common questions fans ask when 
        buying tickets for {stadium.team} games. Our shade calculator answers all these 
        questions with real-time, accurate shade predictions for every section.
      </p>
    </div>
  );
};