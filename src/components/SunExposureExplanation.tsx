import React, { useState } from 'react';
import { SunIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon, FireIcon, UmbrellaIcon, ClockIcon, ThermometerIcon, ShadeIcon, PartlyCloudyIcon } from './Icons';
import './SunExposureExplanation.css';

export const SunExposureExplanation: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="sun-exposure-explanation">
      <button
        className="explanation-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="sun-exposure-details"
      >
        <div className="toggle-header">
          <InfoIcon size={20} />
          <span>What does sun exposure mean for fans?</span>
        </div>
        {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
      </button>

      {isExpanded && (
        <div id="sun-exposure-details" className="explanation-content">
          <div className="exposure-ranges">
            <h4>Understanding Sun Exposure Percentages</h4>
            <p className="intro-text">
              Sun exposure percentage indicates how much time during the game a seating section will be in direct sunlight. 
              For example, 50% means you'll be in sun for about 1.5 hours of a 3-hour game.
            </p>

            <div className="exposure-range-grid">
              <div className="exposure-range" data-range="0">
                <div className="range-header">
                  <ShadeIcon size={24} />
                  <span className="range-title">0% - Always Shaded</span>
                </div>
                <ul className="range-details">
                  <li>No direct sunlight during the entire game</li>
                  <li>No need for sunscreen or sunglasses</li>
                  <li>Cooler temperatures throughout</li>
                  <li>Best for heat-sensitive fans or hot summer days</li>
                </ul>
              </div>

              <div className="exposure-range" data-range="25">
                <div className="range-header">
                  <PartlyCloudyIcon size={24} />
                  <span className="range-title">1-25% - Briefly in Sun</span>
                </div>
                <ul className="range-details">
                  <li>Sun for less than 45 minutes of the game</li>
                  <li>Mostly shaded throughout</li>
                  <li>Light sunscreen recommended</li>
                  <li>Generally comfortable without extensive sun protection</li>
                </ul>
              </div>

              <div className="exposure-range" data-range="50">
                <div className="range-header">
                  <SunIcon size={24} color="#f59e0b" />
                  <span className="range-title">26-50% - Half the Game</span>
                </div>
                <ul className="range-details">
                  <li>Sun for 45-90 minutes of a 3-hour game</li>
                  <li>Transitions between sun and shade</li>
                  <li>Sunglasses and hat recommended</li>
                  <li>Apply sunscreen before the game</li>
                </ul>
              </div>

              <div className="exposure-range" data-range="75">
                <div className="range-header">
                  <SunIcon size={24} color="#f97316" />
                  <span className="range-title">51-75% - Mostly in Sun</span>
                </div>
                <ul className="range-details">
                  <li>Sun for 1.5-2.25 hours of a 3-hour game</li>
                  <li>Limited shade periods</li>
                  <li>Sun protection essential (hat, sunglasses, sunscreen)</li>
                  <li>Bring water to stay hydrated</li>
                </ul>
              </div>

              <div className="exposure-range" data-range="100">
                <div className="range-header">
                  <FireIcon size={24} color="#dc2626" />
                  <span className="range-title">76-100% - Nearly Always in Sun</span>
                </div>
                <ul className="range-details">
                  <li>Sun for 2.25+ hours of a 3-hour game</li>
                  <li>Little to no shade relief</li>
                  <li>Maximum sun protection required</li>
                  <li>High SPF sunscreen, reapply regularly</li>
                  <li>Frequent hydration breaks necessary</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="practical-tips">
            <h4>Practical Tips for Different Sun Exposures</h4>
            
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-header">
                  <ThermometerIcon size={20} />
                  <span>Temperature Impact</span>
                </div>
                <p>
                  Direct sun can make temperatures feel 10-15°F warmer. Shaded seats provide natural cooling, 
                  especially important during summer day games.
                </p>
              </div>

              <div className="tip-card">
                <div className="tip-header">
                  <UmbrellaIcon size={20} />
                  <span>What to Bring</span>
                </div>
                <p>
                  For sunny seats: sunscreen (SPF 30+), sunglasses, hat, water bottle. 
                  For shaded seats: light jacket for evening games as temperatures drop.
                </p>
              </div>

              <div className="tip-card">
                <div className="tip-header">
                  <ClockIcon size={20} />
                  <span>Time of Day Matters</span>
                </div>
                <p>
                  The percentage accounts for how the sun moves during the game. Afternoon games (1-4 PM) 
                  have the most intense sun. Evening games start sunny but end in shade.
                </p>
              </div>
            </div>
          </div>

          <div className="health-safety">
            <h4>Health & Safety Considerations</h4>
            <div className="safety-content">
              <p>
                <strong>UV Protection:</strong> Even on cloudy days, UV rays can cause sunburn. 
                The percentage shows time in direct sunlight. UV exposure can still occur when you're 
                temporarily in shade, especially from reflected light.
              </p>
              <p>
                <strong>Hydration:</strong> Sun exposure increases dehydration risk. Drink water before, 
                during, and after the game, especially in seats exposed to sun for 50%+ of game time.
              </p>
              <p>
                <strong>Special Considerations:</strong> Young children, elderly fans, and those with 
                sun sensitivity should prioritize sections with minimal sun time (0-25%) for comfort and safety.
              </p>
              <p>
                <strong>Covered Sections:</strong> Look for the 🏛️ "Covered" indicator. These sections have 
                permanent roofs or overhangs that provide protection from both sun and rain, typically showing 
                0% sun exposure throughout the game.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};