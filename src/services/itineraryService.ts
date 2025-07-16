import { Stadium } from '../data/stadiums';
import { StadiumAmenity, getStadiumAmenities, calculateProximity } from '../data/stadiumAmenities';
import { 
  SmartItinerary, 
  ItineraryRecommendation, 
  ItineraryPreferences, 
  ItineraryTimeSlot,
  getOptimalActivityTime,
  RECOMMENDATION_TEMPLATES
} from '../data/itineraryTypes';
import { WeatherForecast } from './weatherApi';
import { getSunPosition, calculateDetailedSectionSunExposure, filterSectionsBySunExposure } from '../utils/sunCalculations';
import { MLBGame } from './mlbApi';

export class ItineraryService {
  
  /**
   * Generate a smart itinerary based on stadium, game, weather, and user preferences
   */
  async generateSmartItinerary(
    stadium: Stadium,
    game: MLBGame | null,
    gameDateTime: Date,
    weather: WeatherForecast,
    preferences: ItineraryPreferences,
    selectedSectionId?: string
  ): Promise<SmartItinerary> {
    
    const itinerary: SmartItinerary = {
      id: `itinerary_${stadium.id}_${gameDateTime.getTime()}`,
      stadiumId: stadium.id,
      gameDate: gameDateTime,
      gameStartTime: gameDateTime,
      createdAt: new Date(),
      preferences,
      weatherContext: {
        maxUVIndex: this.getMaxUVIndex(weather),
        averageTemperature: this.getAverageTemperature(weather),
        cloudCover: weather.current.cloudCover,
        precipitationProbability: weather.current.precipitationProbability || 0
      },
      recommendations: [],
      summary: {
        totalWalkingTime: 0,
        sunscreenReminders: 0,
        shadeBreaks: 0,
        familyFriendlyStops: 0,
        estimatedCost: 0
      }
    };

    // Generate time slots for the game day
    const timeSlots = this.generateTimeSlots(gameDateTime, stadium, weather);
    
    // Generate recommendations based on time slots and preferences
    const recommendations = await this.generateRecommendations(
      stadium,
      timeSlots,
      preferences,
      selectedSectionId
    );
    
    itinerary.recommendations = recommendations;
    itinerary.summary = this.calculateSummary(recommendations);
    
    // Generate section recommendations based on sun exposure preferences
    const sectionRecommendations = this.generateSectionRecommendations(
      stadium,
      gameDateTime,
      weather,
      preferences
    );
    itinerary.sectionRecommendations = sectionRecommendations;
    
    return itinerary;
  }

  /**
   * Generate time slots throughout the game day
   */
  private generateTimeSlots(
    gameDateTime: Date,
    stadium: Stadium,
    weather: WeatherForecast
  ): ItineraryTimeSlot[] {
    const slots: ItineraryTimeSlot[] = [];
    const startTime = new Date(gameDateTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    const endTime = new Date(gameDateTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours after
    
    // Create 30-minute time slots
    for (let time = startTime.getTime(); time < endTime.getTime(); time += 30 * 60 * 1000) {
      const slotStart = new Date(time);
      const slotEnd = new Date(time + 30 * 60 * 1000);
      
      // Calculate sun conditions for this time slot
      const sunPosition = getSunPosition(slotStart, stadium.latitude, stadium.longitude);
      const uvIndex = this.estimateUVIndex(slotStart, weather);
      
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        inningRange: this.estimateInningRange(slotStart, gameDateTime),
        sunConditions: {
          uvIndex,
          sunAngle: sunPosition.altitudeDegrees,
          recommendedAction: this.getSunRecommendation(uvIndex, sunPosition.altitudeDegrees)
        },
        crowdLevel: this.estimateCrowdLevel(slotStart, gameDateTime),
        suitableActivities: this.getSuitableActivities(slotStart, gameDateTime, uvIndex)
      });
    }
    
    return slots;
  }

  /**
   * Generate specific recommendations based on time slots and preferences
   */
  private async generateRecommendations(
    stadium: Stadium,
    timeSlots: ItineraryTimeSlot[],
    preferences: ItineraryPreferences,
    selectedSectionId?: string
  ): Promise<ItineraryRecommendation[]> {
    const recommendations: ItineraryRecommendation[] = [];
    const amenities = getStadiumAmenities(stadium.id);
    
    if (!amenities) {
      // If no amenities data, create basic recommendations
      return this.createBasicRecommendations(timeSlots, stadium, preferences);
    }

    // Pre-game recommendations
    const preGameSlots = timeSlots.filter(slot => 
      slot.inningRange === null
    );
    
    // Add arrival recommendation
    recommendations.push(this.createArrivalRecommendation(timeSlots[0], stadium, preferences));
    
    // Add sunscreen application recommendations
    const sunscreenKiosks = amenities.amenities.filter(a => a.type === 'sunscreen_kiosk');
    if (sunscreenKiosks.length > 0) {
      recommendations.push(...this.createSunscreenRecommendations(timeSlots, sunscreenKiosks, preferences));
    }
    
    // Add concession recommendations
    const concessions = amenities.amenities.filter(a => a.type === 'concession');
    if (concessions.length > 0 && !preferences.skipConcessions) {
      recommendations.push(...this.createConcessionRecommendations(timeSlots, concessions, preferences));
    }
    
    // Add restroom recommendations
    const restrooms = amenities.amenities.filter(a => a.type === 'restroom');
    if (restrooms.length > 0) {
      recommendations.push(...this.createRestroomRecommendations(timeSlots, restrooms, preferences));
    }
    
    // Add shade break recommendations for high UV periods
    recommendations.push(...this.createShadeBreakRecommendations(timeSlots, preferences));
    
    // Add family-friendly activity recommendations
    if (preferences.hasChildren) {
      const familyAreas = amenities.amenities.filter(a => a.type === 'family_area');
      recommendations.push(...this.createFamilyActivityRecommendations(timeSlots, familyAreas, preferences));
    }
    
    // Sort recommendations by time
    return recommendations.sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  /**
   * Create arrival recommendation
   */
  private createArrivalRecommendation(
    timeSlot: ItineraryTimeSlot,
    stadium: Stadium,
    preferences: ItineraryPreferences
  ): ItineraryRecommendation {
    const arrivalMinutes = preferences.arrivalTime === 'early' ? 90 : 
                          preferences.arrivalTime === 'on_time' ? 60 : 30;
    
    // Find game start time
    const gameStartSlot = timeSlot.inningRange?.start === 1 ? timeSlot : timeSlot;
    const gameStartTime = new Date(timeSlot.startTime.getTime() + (timeSlot.inningRange ? 0 : 2 * 60 * 60 * 1000));
    
    return {
      id: `arrival_${timeSlot.startTime.getTime()}`,
      time: new Date(gameStartTime.getTime() - arrivalMinutes * 60 * 1000),
      duration: 15,
      type: 'arrival',
      priority: 'medium',
      location: {
        description: `${stadium.name} - Main Entrance`,
        walkingTime: 0
      },
      details: {
        title: 'Arrive at Stadium',
        description: `Arrive ${arrivalMinutes} minutes before first pitch`,
        reason: `${preferences.arrivalTime === 'early' ? 'Extra time for exploring stadium and avoiding crowds' : 
                 preferences.arrivalTime === 'on_time' ? 'Balanced arrival for parking and getting to seats' : 
                 'Quick arrival - head straight to your seats'}`,
        uvIndexAtTime: timeSlot.sunConditions.uvIndex
      },
      familyConsiderations: preferences.hasChildren ? {
        kidFriendly: true,
        hasRestroom: true,
        shaded: false,
        quietArea: false,
        strollerAccessible: true
      } : undefined
    };
  }

  /**
   * Create sunscreen application recommendations
   */
  private createSunscreenRecommendations(
    timeSlots: ItineraryTimeSlot[],
    sunscreenKiosks: StadiumAmenity[],
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    
    // Initial sunscreen application
    const preGameSlot = timeSlots.find(slot => 
      slot.sunConditions.uvIndex > 3 && slot.inningRange === null
    );
    
    if (preGameSlot && sunscreenKiosks.length > 0) {
      recommendations.push({
        id: `sunscreen_initial_${preGameSlot.startTime.getTime()}`,
        time: preGameSlot.startTime,
        duration: 5,
        type: 'sunscreen',
        priority: preferences.sunSensitivity === 'high' || preferences.sunSensitivity === 'extreme' ? 'critical' : 'high',
        location: {
          amenityId: sunscreenKiosks[0].id,
          description: sunscreenKiosks[0].name,
          walkingTime: 3
        },
        details: {
          title: 'Apply Sunscreen',
          description: 'Visit the Play Sun Smart station before heading to your seats',
          reason: `UV index is ${preGameSlot.sunConditions.uvIndex} - sun protection recommended`,
          uvIndexAtTime: preGameSlot.sunConditions.uvIndex,
          sunExposureLevel: this.getSunExposureLevel(preGameSlot.sunConditions.uvIndex)
        },
        familyConsiderations: {
          kidFriendly: true,
          hasRestroom: false,
          shaded: true,
          quietArea: true,
          strollerAccessible: true
        }
      });
    }
    
    // Reapplication recommendations for high UV periods
    const highUVSlots = timeSlots.filter(slot => 
      slot.sunConditions.uvIndex > 6 && 
      slot.inningRange && 
      slot.inningRange.start > 3
    );
    
    highUVSlots.forEach(slot => {
      if (sunscreenKiosks.length > 0) {
        recommendations.push({
          id: `sunscreen_reapply_${slot.startTime.getTime()}`,
          time: slot.startTime,
          duration: 3,
          type: 'sunscreen',
          priority: 'high',
          location: {
            amenityId: sunscreenKiosks[0].id,
            description: sunscreenKiosks[0].name,
            walkingTime: 2
          },
          details: {
            title: 'Reapply Sunscreen',
            description: 'Time for sunscreen reapplication',
            reason: `UV index is ${slot.sunConditions.uvIndex} - reapplication recommended`,
            uvIndexAtTime: slot.sunConditions.uvIndex,
            sunExposureLevel: this.getSunExposureLevel(slot.sunConditions.uvIndex)
          }
        });
      }
    });
    
    return recommendations;
  }

  /**
   * Create concession recommendations
   */
  private createConcessionRecommendations(
    timeSlots: ItineraryTimeSlot[],
    concessions: StadiumAmenity[],
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    
    // Filter concessions based on preferences
    const suitableConcessions = concessions.filter(concession => {
      if (preferences.hasChildren && !concession.details.kidFriendly) return false;
      if (preferences.dietaryRestrictions.length > 0) {
        return preferences.dietaryRestrictions.some(diet => 
          concession.details.dietary?.includes(diet)
        );
      }
      return true;
    });
    
    // Pre-game concession visit
    const preGameSlot = timeSlots.find(slot => 
      slot.crowdLevel === 'low' && slot.inningRange === null
    );
    
    if (preGameSlot && suitableConcessions.length > 0) {
      const concession = suitableConcessions[0];
      recommendations.push({
        id: `concession_pregame_${preGameSlot.startTime.getTime()}`,
        time: preGameSlot.startTime,
        duration: 15,
        type: 'concession',
        priority: 'medium',
        location: {
          amenityId: concession.id,
          description: concession.name,
          walkingTime: 5
        },
        details: {
          title: 'Grab Game Snacks',
          description: 'Beat the crowds with pre-game concession visit',
          reason: 'Low crowd level - optimal time for concessions',
          uvIndexAtTime: preGameSlot.sunConditions.uvIndex
        },
        familyConsiderations: preferences.hasChildren ? {
          kidFriendly: concession.details.kidFriendly || false,
          hasRestroom: true,
          shaded: true,
          quietArea: false,
          strollerAccessible: true
        } : undefined
      });
    }
    
    return recommendations;
  }

  /**
   * Create restroom recommendations
   */
  private createRestroomRecommendations(
    timeSlots: ItineraryTimeSlot[],
    restrooms: StadiumAmenity[],
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    
    // Filter for family-friendly restrooms if needed
    const suitableRestrooms = restrooms.filter(restroom => {
      if (preferences.hasChildren) {
        return restroom.details.familyRestroom || restroom.details.changingStation;
      }
      return true;
    });
    
    // Seventh inning stretch restroom break
    const seventhInningSlot = timeSlots.find(slot => 
      slot.inningRange && slot.inningRange.start <= 7 && slot.inningRange.end >= 7
    );
    
    if (seventhInningSlot && suitableRestrooms.length > 0) {
      const restroom = suitableRestrooms[0];
      recommendations.push({
        id: `restroom_seventh_${seventhInningSlot.startTime.getTime()}`,
        time: seventhInningSlot.startTime,
        duration: 8,
        type: 'restroom',
        priority: 'medium',
        location: {
          amenityId: restroom.id,
          description: restroom.name,
          walkingTime: 3
        },
        details: {
          title: 'Restroom Break',
          description: 'Perfect timing during seventh inning stretch',
          reason: 'Traditional break time with less crowding',
          uvIndexAtTime: seventhInningSlot.sunConditions.uvIndex
        },
        familyConsiderations: preferences.hasChildren ? {
          kidFriendly: true,
          hasRestroom: true,
          shaded: true,
          quietArea: true,
          strollerAccessible: restroom.details.accessibility || false
        } : undefined
      });
    }
    
    return recommendations;
  }

  /**
   * Create shade break recommendations
   */
  private createShadeBreakRecommendations(
    timeSlots: ItineraryTimeSlot[],
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    
    // Find high UV periods that warrant shade breaks
    const highUVSlots = timeSlots.filter(slot => 
      slot.sunConditions.uvIndex > 7 && 
      slot.sunConditions.recommendedAction === 'seek_shade'
    );
    
    highUVSlots.forEach(slot => {
      recommendations.push({
        id: `shade_break_${slot.startTime.getTime()}`,
        time: slot.startTime,
        duration: 10,
        type: 'shade_break',
        priority: preferences.sunSensitivity === 'high' || preferences.sunSensitivity === 'extreme' ? 'high' : 'medium',
        location: {
          description: 'Concourse or covered area',
          walkingTime: 2
        },
        details: {
          title: 'Shade Break',
          description: 'Take a break from direct sun exposure',
          reason: `UV index is ${slot.sunConditions.uvIndex} - shade recommended`,
          uvIndexAtTime: slot.sunConditions.uvIndex,
          sunExposureLevel: this.getSunExposureLevel(slot.sunConditions.uvIndex)
        },
        familyConsiderations: {
          kidFriendly: true,
          hasRestroom: true,
          shaded: true,
          quietArea: true,
          strollerAccessible: true
        }
      });
    });
    
    return recommendations;
  }

  /**
   * Create family activity recommendations
   */
  private createFamilyActivityRecommendations(
    timeSlots: ItineraryTimeSlot[],
    familyAreas: StadiumAmenity[],
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    
    if (!preferences.hasChildren || familyAreas.length === 0) {
      return recommendations;
    }
    
    // Pre-game family activity
    const preGameSlot = timeSlots.find(slot => 
      slot.crowdLevel === 'low' && slot.inningRange === null
    );
    
    if (preGameSlot) {
      const familyArea = familyAreas[0];
      recommendations.push({
        id: `family_activity_${preGameSlot.startTime.getTime()}`,
        time: preGameSlot.startTime,
        duration: 20,
        type: 'activity',
        priority: 'low',
        location: {
          amenityId: familyArea.id,
          description: familyArea.name,
          walkingTime: 5
        },
        details: {
          title: 'Family Activity Time',
          description: 'Let kids play and explore family-friendly areas',
          reason: 'Low crowd level - perfect for family activities',
          uvIndexAtTime: preGameSlot.sunConditions.uvIndex
        },
        familyConsiderations: {
          kidFriendly: true,
          hasRestroom: true,
          shaded: true,
          quietArea: true,
          strollerAccessible: true
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Create basic recommendations when no amenities data is available
   */
  private createBasicRecommendations(
    timeSlots: ItineraryTimeSlot[],
    stadium: Stadium,
    preferences: ItineraryPreferences
  ): ItineraryRecommendation[] {
    const recommendations: ItineraryRecommendation[] = [];
    const gameStartTime = timeSlots.find(slot => slot.inningRange && slot.inningRange.start === 1)?.startTime || new Date();
    
    // Add arrival recommendation (before game)
    recommendations.push(this.createArrivalRecommendation(timeSlots[0], stadium, preferences));
    
    // Pre-game sunscreen application (30 minutes before first pitch)
    const preGameSlot = timeSlots.find(slot => !slot.inningRange);
    if (preGameSlot && preGameSlot.sunConditions.uvIndex > 3) {
      recommendations.push({
        id: `sunscreen_pregame_${preGameSlot.startTime.getTime()}`,
        time: new Date(gameStartTime.getTime() - 30 * 60 * 1000),
        duration: 5,
        type: 'sunscreen',
        priority: 'high',
        location: {
          description: 'Stadium sunscreen station or concourse',
          walkingTime: 3
        },
        details: {
          title: 'Apply Sunscreen - Pre-Game',
          description: 'Apply sunscreen before heading to your seats',
          reason: `UV index is ${preGameSlot.sunConditions.uvIndex} - protect yourself before the game`,
          uvIndexAtTime: preGameSlot.sunConditions.uvIndex,
          sunExposureLevel: this.getSunExposureLevel(preGameSlot.sunConditions.uvIndex)
        },
        familyConsiderations: {
          kidFriendly: true,
          hasRestroom: false,
          shaded: true,
          quietArea: true,
          strollerAccessible: true
        }
      });
    }
    
    // 3rd inning - First concession/restroom break
    const thirdInningSlot = timeSlots.find(slot => 
      slot.inningRange && slot.inningRange.start === 3
    );
    if (thirdInningSlot) {
      recommendations.push({
        id: `concession_3rd_${thirdInningSlot.startTime.getTime()}`,
        time: thirdInningSlot.startTime,
        duration: 15,
        type: 'concession',
        priority: 'medium',
        location: {
          description: 'Stadium concession stands',
          walkingTime: 5
        },
        details: {
          title: 'Concession Break - 3rd Inning',
          description: 'Good time for snacks and restroom before crowds',
          reason: 'Early innings typically have shorter lines',
          uvIndexAtTime: thirdInningSlot.sunConditions.uvIndex
        },
        familyConsiderations: preferences.hasChildren ? {
          kidFriendly: true,
          hasRestroom: true,
          shaded: true,
          quietArea: false,
          strollerAccessible: true
        } : undefined
      });
    }
    
    // 5th inning - Sunscreen reapplication for day games
    const fifthInningSlot = timeSlots.find(slot => 
      slot.inningRange && slot.inningRange.start === 5
    );
    if (fifthInningSlot && fifthInningSlot.sunConditions.uvIndex > 5) {
      recommendations.push({
        id: `sunscreen_5th_${fifthInningSlot.startTime.getTime()}`,
        time: fifthInningSlot.startTime,
        duration: 5,
        type: 'sunscreen',
        priority: preferences.sunSensitivity === 'high' || preferences.sunSensitivity === 'extreme' ? 'high' : 'medium',
        location: {
          description: 'Concourse sunscreen station',
          walkingTime: 2
        },
        details: {
          title: 'Reapply Sunscreen - 5th Inning',
          description: 'Time to reapply for continued protection',
          reason: `UV index is ${fifthInningSlot.sunConditions.uvIndex} - reapplication recommended after 2+ hours`,
          uvIndexAtTime: fifthInningSlot.sunConditions.uvIndex,
          sunExposureLevel: this.getSunExposureLevel(fifthInningSlot.sunConditions.uvIndex)
        },
        familyConsiderations: {
          kidFriendly: true,
          hasRestroom: false,
          shaded: true,
          quietArea: true,
          strollerAccessible: true
        }
      });
      
      // Also add shade break if UV is extreme
      if (fifthInningSlot.sunConditions.uvIndex > 7) {
        recommendations.push({
          id: `shade_break_5th_${fifthInningSlot.startTime.getTime()}`,
          time: new Date(fifthInningSlot.startTime.getTime() + 5 * 60 * 1000),
          duration: 10,
          type: 'shade_break',
          priority: 'high',
          location: {
            description: 'Concourse or covered area',
            walkingTime: 2
          },
          details: {
            title: 'Shade Break - Mid-Game',
            description: 'Take a break from intense sun exposure',
            reason: `UV index is ${fifthInningSlot.sunConditions.uvIndex} - extended shade break recommended`,
            uvIndexAtTime: fifthInningSlot.sunConditions.uvIndex,
            sunExposureLevel: this.getSunExposureLevel(fifthInningSlot.sunConditions.uvIndex)
          },
          familyConsiderations: {
            kidFriendly: true,
            hasRestroom: true,
            shaded: true,
            quietArea: true,
            strollerAccessible: true
          }
        });
      }
    }
    
    // 7th inning stretch
    const seventhInningSlot = timeSlots.find(slot => 
      slot.inningRange && slot.inningRange.start === 7
    );
    if (seventhInningSlot) {
      recommendations.push({
        id: `seventh_stretch_${seventhInningSlot.startTime.getTime()}`,
        time: seventhInningSlot.startTime,
        duration: 10,
        type: 'activity',
        priority: 'medium',
        location: {
          description: 'Stand and stretch at your seat',
          walkingTime: 0
        },
        details: {
          title: '7th Inning Stretch',
          description: 'Traditional stretch and "Take Me Out to the Ball Game"',
          reason: 'Baseball tradition and good time for restroom/concessions',
          uvIndexAtTime: seventhInningSlot.sunConditions.uvIndex
        },
        familyConsiderations: preferences.hasChildren ? {
          kidFriendly: true,
          hasRestroom: true,
          shaded: false,
          quietArea: false,
          strollerAccessible: true
        } : undefined
      });
    }
    
    // 8th inning - Final refreshments for families with kids
    if (preferences.hasChildren) {
      const eighthInningSlot = timeSlots.find(slot => 
        slot.inningRange && slot.inningRange.start === 8
      );
      if (eighthInningSlot) {
        recommendations.push({
          id: `family_8th_${eighthInningSlot.startTime.getTime()}`,
          time: eighthInningSlot.startTime,
          duration: 10,
          type: 'activity',
          priority: 'low',
          location: {
            description: 'Concourse for final snacks/restroom',
            walkingTime: 3
          },
          details: {
            title: 'Family Break - 8th Inning',
            description: 'Last chance for restroom and prepare for departure',
            reason: 'Families often leave early to beat crowds',
            uvIndexAtTime: eighthInningSlot.sunConditions.uvIndex
          },
          familyConsiderations: {
            kidFriendly: true,
            hasRestroom: true,
            shaded: true,
            quietArea: false,
            strollerAccessible: true
          }
        });
      }
    }
    
    return recommendations.sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  /**
   * Generate section recommendations based on sun exposure preferences
   */
  private generateSectionRecommendations(
    stadium: Stadium,
    gameDateTime: Date,
    weather: WeatherForecast,
    preferences: ItineraryPreferences
  ): SmartItinerary['sectionRecommendations'] {
    // Calculate sun position for game time
    const sunPosition = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);
    
    // Get weather data for calculations
    const gameWeather = weather ? this.getWeatherForGameTime(weather, gameDateTime) : undefined;
    
    // Calculate detailed section sun exposure
    const sectionData = calculateDetailedSectionSunExposure(stadium, sunPosition, gameWeather);
    
    // Separate sections by sun exposure
    const sunnySection = sectionData.filter(s => s.inSun && s.sunExposure > 60);
    const partialSunSections = sectionData.filter(s => s.inSun && s.sunExposure <= 60);
    const shadeSections = sectionData.filter(s => !s.inSun);
    
    let preferred: string[] = [];
    let alternatives: string[] = [];
    let avoid: string[] = [];
    let reasoning = '';
    
    // Determine recommendations based on preferences
    if (preferences.prioritizeShade || preferences.sunSensitivity === 'high' || preferences.sunSensitivity === 'extreme') {
      // User wants shade
      preferred = shadeSections.slice(0, 5).map(s => s.section.id);
      alternatives = partialSunSections.slice(0, 3).map(s => s.section.id);
      avoid = sunnySection.slice(0, 3).map(s => s.section.id);
      
      reasoning = `Based on your ${preferences.sunSensitivity} sun sensitivity and preference for shade, we recommend sections that will remain shaded throughout the game. `;
      
      if (preferences.hasChildren) {
        reasoning += 'These sections are also ideal for families with children to avoid prolonged sun exposure. ';
      }
      
      if (sunPosition.altitudeDegrees < 0) {
        reasoning = 'This is a night game, so sun exposure is not a concern. All sections are suitable. ';
      }
    } else if (preferences.sunSensitivity === 'low') {
      // User doesn't mind or wants sun
      preferred = [...partialSunSections.slice(0, 3), ...shadeSections.slice(0, 2)].map(s => s.section.id);
      alternatives = sunnySection.slice(0, 3).map(s => s.section.id);
      avoid = []; // No sections to avoid
      
      reasoning = 'Since you have low sun sensitivity, we recommend sections with partial sun for warmth without excessive exposure. ';
      
      if (gameWeather && gameWeather.temperature < 60) {
        reasoning += 'Given the cooler temperature, some sun exposure might be comfortable. ';
      }
    } else {
      // Moderate sensitivity - balanced approach
      preferred = [...partialSunSections.slice(0, 2), ...shadeSections.slice(0, 3)].map(s => s.section.id);
      alternatives = [...shadeSections.slice(3, 5), ...partialSunSections.slice(2, 4)].map(s => s.section.id);
      avoid = sunnySection.filter(s => s.sunExposure > 80).slice(0, 2).map(s => s.section.id);
      
      reasoning = 'With moderate sun sensitivity, we recommend sections with partial shade for a comfortable balance. ';
    }
    
    // Add weather considerations
    if (gameWeather) {
      if (gameWeather.cloudCover > 70) {
        reasoning += 'Cloudy conditions will provide natural sun protection across all sections. ';
      } else if (weather.current.uvIndex > 7) {
        reasoning += `High UV index (${weather.current.uvIndex}) - extra sun protection is recommended regardless of seating choice. `;
      }
    }
    
    // Add amenity proximity considerations
    if (preferences.hasChildren || preferences.frequentRestrooms) {
      reasoning += 'Preferred sections are also close to family amenities and restrooms. ';
    }
    
    return {
      preferred,
      alternatives,
      avoid,
      reasoning
    };
  }

  /**
   * Get weather data for specific game time
   */
  private getWeatherForGameTime(weather: WeatherForecast, gameTime: Date) {
    const closestHour = weather.hourly.find(h => 
      Math.abs(new Date(h.time).getTime() - gameTime.getTime()) < 60 * 60 * 1000
    );
    return closestHour?.weather || weather.current;
  }

  // Helper methods
  private getMaxUVIndex(weather: WeatherForecast): number {
    return Math.max(weather.current.uvIndex, ...weather.hourly.map(h => h.weather.uvIndex));
  }

  private getAverageTemperature(weather: WeatherForecast): number {
    const temps = weather.hourly.map(h => h.weather.temperature);
    return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
  }

  private estimateUVIndex(time: Date, weather: WeatherForecast): number {
    // Find closest hourly forecast
    const closestHour = weather.hourly.find(h => 
      Math.abs(new Date(h.time).getTime() - time.getTime()) < 60 * 60 * 1000
    );
    return closestHour?.weather.uvIndex || weather.current.uvIndex;
  }

  private estimateInningRange(time: Date, gameStart: Date): { start: number; end: number } | null {
    const timeDiff = time.getTime() - gameStart.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 0) return null; // Pre-game
    
    // Rough estimate: 20 minutes per inning
    const estimatedInning = Math.floor(minutesDiff / 20) + 1;
    
    if (estimatedInning > 9) return { start: 9, end: 9 }; // Post-game
    
    return { start: estimatedInning, end: estimatedInning };
  }

  private getSunRecommendation(uvIndex: number, sunAngle: number): 'seek_shade' | 'apply_sunscreen' | 'normal' | 'ideal_conditions' {
    if (uvIndex > 7) return 'seek_shade';
    if (uvIndex > 3) return 'apply_sunscreen';
    if (sunAngle > 45) return 'normal';
    return 'ideal_conditions';
  }

  private estimateCrowdLevel(time: Date, gameStart: Date): 'low' | 'moderate' | 'high' | 'peak' {
    const timeDiff = time.getTime() - gameStart.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < -60) return 'low'; // More than 1 hour before
    if (minutesDiff < -30) return 'moderate'; // 30-60 min before
    if (minutesDiff < 0) return 'high'; // Game starting
    if (minutesDiff < 120) return 'peak'; // First 2 hours
    return 'moderate'; // Late game
  }

  private getSuitableActivities(time: Date, gameStart: Date, uvIndex: number): string[] {
    const activities: string[] = [];
    const timeDiff = time.getTime() - gameStart.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 0) {
      activities.push('arrival', 'concession', 'exploration', 'sunscreen');
    } else if (minutesDiff < 60) {
      activities.push('watching_game', 'restroom');
      if (uvIndex > 6) activities.push('shade_break');
    } else if (minutesDiff < 120) {
      activities.push('watching_game', 'concession', 'restroom');
      if (uvIndex > 6) activities.push('shade_break');
    } else {
      activities.push('watching_game', 'souvenir', 'restroom');
    }
    
    return activities;
  }

  private getSunExposureLevel(uvIndex: number): 'low' | 'moderate' | 'high' | 'extreme' {
    if (uvIndex <= 2) return 'low';
    if (uvIndex <= 5) return 'moderate';
    if (uvIndex <= 7) return 'high';
    return 'extreme';
  }

  private calculateSummary(recommendations: ItineraryRecommendation[]): SmartItinerary['summary'] {
    const summary = {
      totalWalkingTime: 0,
      sunscreenReminders: 0,
      shadeBreaks: 0,
      familyFriendlyStops: 0,
      estimatedCost: 0
    };
    
    recommendations.forEach(rec => {
      summary.totalWalkingTime += rec.location.walkingTime || 0;
      if (rec.type === 'sunscreen') summary.sunscreenReminders++;
      if (rec.type === 'shade_break') summary.shadeBreaks++;
      if (rec.familyConsiderations?.kidFriendly) summary.familyFriendlyStops++;
      
      // Estimate costs
      if (rec.type === 'concession') {
        summary.estimatedCost += 25; // Average concession cost
      } else if (rec.type === 'activity') {
        summary.estimatedCost += 10; // Activity cost
      }
    });
    
    return summary;
  }
}

export const itineraryService = new ItineraryService();