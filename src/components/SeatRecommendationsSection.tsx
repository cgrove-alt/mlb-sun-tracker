'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { SeatRecommendationEngine, UserPreferences } from '../services/seatRecommendationEngine';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { SeatPreferencesForm } from './SeatPreferencesForm';
import { LoadingSpinner } from './LoadingSpinner';
import { MLB_STADIUMS } from '../data/stadiums';

interface SeatRecommendationsSectionProps {
  sections: SeatingSectionSun[];
  stadiumId: string;
  gameTime?: string;
  gameDate?: Date;
}

export const SeatRecommendationsSection: React.FC<SeatRecommendationsSectionProps> = ({
  sections,
  stadiumId,
  gameTime = '13:00',
  gameDate = new Date()
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sunPreference: 'neutral',
    budgetRange: 'moderate',
    groupSize: 2,
    accessibilityNeeds: false,
    viewPreference: 'any',
    amenityPriorities: ['view', 'shade'],
    weatherSensitivity: 'medium',
    hasChildren: false,
    gameTimePreference: 'any'
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions for scoring
  const scoreSunPreference = (sunExposure: number, preference: string): number => {
    switch (preference) {
      case 'love-sun': return sunExposure >= 75 ? 100 : sunExposure >= 50 ? 70 : 30;
      case 'prefer-sun': return sunExposure >= 50 ? 90 : sunExposure >= 25 ? 70 : 40;
      case 'neutral': return sunExposure <= 75 && sunExposure >= 25 ? 80 : 60;
      case 'prefer-shade': return sunExposure <= 25 ? 90 : sunExposure <= 50 ? 70 : 40;
      case 'need-shade': return sunExposure === 0 ? 100 : sunExposure <= 25 ? 70 : 20;
      default: return 50;
    }
  };

  const scorePriceMatch = (sectionPrice: string, budgetRange: string): number => {
    if (budgetRange === 'any') return 80;
    if (sectionPrice === budgetRange) return 100;
    
    const priceOrder = { value: 1, moderate: 2, premium: 3, luxury: 4 };
    const sectionLevel = priceOrder[sectionPrice as keyof typeof priceOrder] || 2;
    const prefLevel = priceOrder[budgetRange as keyof typeof priceOrder] || 2;
    
    const diff = Math.abs(sectionLevel - prefLevel);
    return diff === 0 ? 100 : diff === 1 ? 70 : diff === 2 ? 40 : 20;
  };

  const scoreLevelPreference = (sectionLevel: string, viewPreference: string): number => {
    if (viewPreference === 'any') return 80;
    
    // Map view preferences to level preferences
    const levelMappings = {
      'home-plate': ['lower', 'club'],
      'first-base': ['lower', 'field', 'club'],
      'third-base': ['lower', 'field', 'club'],
      'outfield': ['upper', 'field']
    };
    
    const preferredLevels = levelMappings[viewPreference as keyof typeof levelMappings] || ['lower'];
    return preferredLevels.includes(sectionLevel) ? 100 : 60;
  };

  const recommendations = useMemo(() => {
    if (!sections || sections.length === 0) return [];

    try {
      setIsLoading(true);
      
      // Create simple recommendations based on sun exposure and preferences
      const scored = sections.map(sectionData => {
        const section = sectionData.section;
        const sunExposure = sectionData.sunExposure;
        let score = 0;
        let reasoning = [];
        
        // Sun preference scoring
        const sunScore = scoreSunPreference(sunExposure, preferences.sunPreference);
        score += sunScore * 0.35;
        
        // Budget scoring  
        const priceScore = scorePriceMatch(section.price || 'moderate', preferences.budgetRange);
        score += priceScore * 0.25;
        
        // Level preference
        const levelScore = scoreLevelPreference(section.level, preferences.viewPreference);
        score += levelScore * 0.20;
        
        // Amenities base score
        score += 20;
        
        // Generate reasoning
        if (sunExposure === 0) reasoning.push('Perfect shade coverage');
        else if (sunExposure < 25) reasoning.push('Mostly shaded during game');
        else if (sunExposure < 50) reasoning.push('Balanced sun and shade');
        else if (sunExposure < 75) reasoning.push('Mostly sunny exposure');
        else reasoning.push('Full sun exposure');
        
        // Check price with null safety
        const sectionPrice = section.price || 'moderate';
        if (sectionPrice === preferences.budgetRange) {
          reasoning.push(`Matches your ${preferences.budgetRange} budget`);
        }
        
        return {
          sectionId: section.id,
          sectionName: section.name,
          score: Math.min(100, score),
          reasoning: reasoning.join('. ') + '.',
          sunExposure,
          level: section.level,
          priceRange: section.price || 'moderate',
          pros: reasoning,
          cons: [],
          amenityHighlights: ['view', 'shade'].filter(a => 
            preferences.amenityPriorities.includes(a as any)
          )
        };
      });
      
      // Sort by score and return top 6
      return scored.sort((a, b) => b.score - a.score).slice(0, 6);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [sections, preferences, gameTime, gameDate, stadiumId]);

  const handlePreferencesChange = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const presetPreferences = {
    'sun-lover': {
      sunPreference: 'love-sun',
      budgetRange: 'moderate',
      groupSize: 2,
      accessibilityNeeds: false,
      viewPreference: 'any',
      amenityPriorities: ['view'],
      weatherSensitivity: 'low',
      hasChildren: false,
      gameTimePreference: 'day'
    },
    'shade-seeker': {
      sunPreference: 'need-shade',
      budgetRange: 'moderate',
      groupSize: 2,
      accessibilityNeeds: false,
      viewPreference: 'any',
      amenityPriorities: ['shade', 'view'],
      weatherSensitivity: 'high',
      hasChildren: false,
      gameTimePreference: 'evening'
    },
    'family': {
      sunPreference: 'prefer-shade',
      budgetRange: 'moderate',
      groupSize: 4,
      accessibilityNeeds: false,
      viewPreference: 'any',
      amenityPriorities: ['shade', 'food', 'restrooms'],
      weatherSensitivity: 'medium',
      hasChildren: true,
      gameTimePreference: 'any'
    },
    'budget': {
      sunPreference: 'neutral',
      budgetRange: 'budget',
      groupSize: 2,
      accessibilityNeeds: false,
      viewPreference: 'outfield',
      amenityPriorities: ['view'],
      weatherSensitivity: 'low',
      hasChildren: false,
      gameTimePreference: 'any'
    }
  };

  const handlePresetClick = (presetKey: keyof typeof presetPreferences) => {
    setPreferences({ ...presetPreferences[presetKey] } as UserPreferences);
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="seat-recommendations-section">
        <div className="text-center p-8">
          <p className="text-gray-600">No section data available for recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-recommendations-section">
      <div className="recommendations-header">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 AI Seat Recommendations
            </h2>
            <p className="text-gray-600">
              Get personalized seat suggestions based on your preferences
            </p>
          </div>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPreferences ? 'Hide' : 'Customize'} Preferences
          </button>
        </div>

        {/* Quick Preset Buttons */}
        <div className="preset-buttons mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Presets:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePresetClick('sun-lover')}
              className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors text-sm"
            >
              ☀️ Sun Lover
            </button>
            <button
              onClick={() => handlePresetClick('shade-seeker')}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              ⛅ Shade Seeker
            </button>
            <button
              onClick={() => handlePresetClick('family')}
              className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm"
            >
              👪 Family
            </button>
            <button
              onClick={() => handlePresetClick('budget')}
              className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors text-sm"
            >
              💰 Budget
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      {showPreferences && (
        <div className="mb-8">
          <SeatPreferencesForm
            onPreferencesChange={handlePreferencesChange}
            initialPreferences={preferences}
            showTitle={false}
          />
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations-content">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner message="Generating personalized recommendations..." />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={`${rec.sectionId}-${index}`} className="recommendation-card bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Section {rec.sectionName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round(rec.score)}% match
                    </span>
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sun Exposure:</span>
                    <span className={`font-medium ${
                      rec.sunExposure < 25 ? 'text-green-600' :
                      rec.sunExposure < 50 ? 'text-yellow-600' :
                      rec.sunExposure < 75 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {rec.sunExposure}%
                      {rec.sunExposure === 0 ? ' ⛅ Full shade' :
                       rec.sunExposure < 25 ? ' 🌤️ Mostly shade' :
                       rec.sunExposure < 75 ? ' ☀️ Some sun' : ' 🔥 Mostly sunny'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price Range:</span>
                    <span className="font-medium capitalize">
                      {rec.priceRange === 'value' ? '💵 Budget' :
                       rec.priceRange === 'moderate' ? '💳 Moderate' :
                       rec.priceRange === 'premium' ? '💎 Premium' : '👑 Luxury'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium capitalize">
                      {rec.level === 'field' ? '🏟️ Field' :
                       rec.level === 'lower' ? '🎯 Lower' :
                       rec.level === 'club' ? '🎩 Club' :
                       rec.level === 'upper' ? '🎫 Upper' : '👑 Suite'} Level
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Why this section:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rec.reasoning}
                  </p>
                </div>

                {rec.amenityHighlights && rec.amenityHighlights.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {rec.amenityHighlights.map((amenity, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity === 'view' ? '👀 Great view' :
                           amenity === 'shade' ? '⛅ Shade' :
                           amenity === 'food' ? '🍕 Food nearby' :
                           amenity === 'restrooms' ? '🚻 Restrooms' :
                           amenity === 'parking' ? '🅿️ Easy parking' : amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">No recommendations available</p>
            <p className="text-sm text-gray-500">Try adjusting your preferences or check back later.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .seat-recommendations-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
          border: 1px solid #e2e8f0;
        }
        
        .recommendation-card {
          background: white;
          transition: all 0.2s ease;
        }
        
        .recommendation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .preset-buttons button:hover {
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .seat-recommendations-section {
            padding: 16px;
            margin: 16px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SeatRecommendationsSection;