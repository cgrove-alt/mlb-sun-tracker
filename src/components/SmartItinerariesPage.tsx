import React, { useState, useEffect } from 'react';
import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { WeatherForecast } from '../services/weatherApi';
import { SmartItinerary, ItineraryPreferences } from '../data/itineraryTypes';
import { itineraryService } from '../services/itineraryService';
import { ItineraryTimeline } from './itineraries/ItineraryTimeline';
import { PreferencesPanel } from './itineraries/PreferencesPanel';
import { ItinerarySummary } from './itineraries/ItinerarySummary';
import { GameSelector } from './GameSelector';
import { useTranslation } from '../i18n/i18nContext';
import { ErrorProvider } from './ErrorNotification';
import './SmartItinerariesPage.css';

interface SmartItinerariesPageProps {
  selectedStadium: Stadium | null;
  selectedGame: MLBGame | null;
  gameDateTime: Date | null;
  weatherForecast: WeatherForecast | null;
  selectedSectionId?: string;
  onStadiumChange: (stadium: Stadium | null) => void;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
}

export const SmartItinerariesPage: React.FC<SmartItinerariesPageProps> = ({
  selectedStadium,
  selectedGame,
  gameDateTime,
  weatherForecast,
  selectedSectionId,
  onStadiumChange,
  onGameSelect
}) => {
  const { t } = useTranslation();
  const [itinerary, setItinerary] = useState<SmartItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<ItineraryPreferences>({
    groupSize: 2,
    hasChildren: false,
    hasElderly: false,
    mobilityNeeds: false,
    dietaryRestrictions: [],
    prioritizeShade: true,
    frequentRestrooms: false,
    budgetConstraints: 'moderate',
    arrivalTime: 'on_time',
    departureTime: 'full_game',
    nurslingNeeds: false,
    sunSensitivity: 'moderate',
    skipConcessions: false,
    skipActivities: false,
    prioritizeSpeed: false
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate itinerary when inputs change
   */
  useEffect(() => {
    if (selectedStadium && gameDateTime && weatherForecast) {
      generateItinerary();
    }
  }, [selectedStadium, gameDateTime, weatherForecast, preferences]);

  const generateItinerary = async () => {
    if (!selectedStadium || !gameDateTime || !weatherForecast) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const newItinerary = await itineraryService.generateSmartItinerary(
        selectedStadium,
        selectedGame,
        gameDateTime,
        weatherForecast,
        preferences,
        selectedSectionId
      );
      setItinerary(newItinerary);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error('Error generating itinerary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreferencesChange = (newPreferences: ItineraryPreferences) => {
    setPreferences(newPreferences);
  };

  const handleRegenerateItinerary = () => {
    generateItinerary();
  };

  if (!selectedStadium || !gameDateTime) {
    return (
      <div className="smart-itineraries-page">
        <div className="empty-state">
          <h2>🗓️ Smart Itineraries</h2>
          <p>Select a stadium and game time to generate your personalized ballpark itinerary</p>
          
          <GameSelector
            stadiums={MLB_STADIUMS}
            selectedStadium={selectedStadium}
            onStadiumChange={onStadiumChange}
            onGameSelect={onGameSelect}
          />
          
          <div className="empty-state-features">
            <h3>What you'll get:</h3>
            <ul>
              <li>🌞 Sun exposure-based timing recommendations</li>
              <li>🍿 Optimal concession visit times</li>
              <li>🚻 Family-friendly restroom and amenity locations</li>
              <li>🧴 Sunscreen application reminders</li>
              <li>👨‍👩‍👧‍👦 Kid-friendly activities and timing</li>
              <li>📍 Walking routes and proximity optimization</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorProvider>
      <div className="smart-itineraries-page">
        <div className={`preferences-sidebar ${showPreferences ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>⚙️ Preferences</h3>
            <button
              className="sidebar-toggle"
              onClick={() => setShowPreferences(!showPreferences)}
              aria-label={showPreferences ? 'Close preferences' : 'Open preferences'}
            >
              {showPreferences ? '×' : '☰'}
            </button>
          </div>
          {showPreferences && (
            <div className="sidebar-content">
              <PreferencesPanel
                preferences={preferences}
                onPreferencesChange={handlePreferencesChange}
                onClose={() => setShowPreferences(false)}
              />
            </div>
          )}
        </div>

        <div className={`itinerary-main-content ${showPreferences ? 'with-sidebar' : ''}`}>
          <div className="itinerary-header">
            <div className="header-content">
              <h1>🗓️ Smart Itinerary</h1>
              <h2>{selectedStadium.name}</h2>
              <p className="game-info">
                {selectedGame ? (
                  `${selectedGame.teams.away.team.name} @ ${selectedGame.teams.home.team.name}`
                ) : (
                  'Custom Game Time'
                )}
              </p>
              <p className="datetime">
                {gameDateTime.toLocaleDateString()} at {gameDateTime.toLocaleTimeString([], { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            <div className="header-actions">
              <button
                className="regenerate-button"
                onClick={handleRegenerateItinerary}
                disabled={isGenerating}
              >
                {isGenerating ? '🔄 Generating...' : '🔄 Regenerate'}
              </button>
            </div>
          </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={handleRegenerateItinerary}>Try Again</button>
          </div>
        )}

        {isGenerating && (
          <div className="generating-state">
            <div className="loading-spinner"></div>
            <h3>Generating Your Smart Itinerary...</h3>
            <p>Analyzing weather conditions, sun exposure, and stadium amenities</p>
          </div>
        )}

        {itinerary && !isGenerating && (
          <div className="itinerary-content">
            <ItinerarySummary 
              itinerary={itinerary} 
              stadium={selectedStadium}
            />
            
            <ItineraryTimeline 
              itinerary={itinerary} 
              stadium={selectedStadium}
            />
          </div>
        )}

        {!itinerary && !isGenerating && !error && (
          <div className="welcome-message">
            <h3>🎯 Your Personalized Ballpark Experience</h3>
            <p>
              Our Smart Itinerary combines real-time weather data, sun exposure calculations, 
              and stadium amenity locations to create the perfect game day plan for you and your family.
            </p>
            <div className="feature-highlights">
              <div className="feature">
                <span className="feature-icon">☀️</span>
                <h4>Sun Smart</h4>
                <p>Sunscreen reminders and shade breaks based on UV index</p>
              </div>
              <div className="feature">
                <span className="feature-icon">👨‍👩‍👧‍👦</span>
                <h4>Family First</h4>
                <p>Kid-friendly dining, restrooms, and activity recommendations</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🚶‍♂️</span>
                <h4>Optimized Routes</h4>
                <p>Minimize walking time with smart location planning</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⏰</span>
                <h4>Perfect Timing</h4>
                <p>Beat crowds with optimal concession and restroom timing</p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </ErrorProvider>
  );
};