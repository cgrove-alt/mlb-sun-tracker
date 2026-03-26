import { Stadium } from '../data/stadiums';
import { MLBGame } from './mlbApi';
import { MiLBGame } from './milbApi';
import { NFLGame } from './nflApi';
import { WeatherForecast } from './weatherApi';
import { SmartItinerary, ItineraryPreferences } from '../data/itineraryTypes';

class ItineraryService {
  async generateSmartItinerary(
    stadium: Stadium,
    game: MLBGame | MiLBGame | NFLGame | null,
    gameDateTime: Date,
    weather: WeatherForecast | null,
    preferences: ItineraryPreferences,
    sectionId?: string
  ): Promise<SmartItinerary> {
    // Stub — itinerary generation not yet implemented
    throw new Error('Itinerary generation not yet implemented');
  }
}

export const itineraryService = new ItineraryService();
