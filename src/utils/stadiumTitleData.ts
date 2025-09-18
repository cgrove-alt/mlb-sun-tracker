import { Stadium } from '../data/stadiums';
import { StadiumGuide } from '../data/stadiumGuides';
import { StadiumTitleData, StadiumLeague, RoofType, GameInfo, WeatherInfo, ShadeInfo } from '../components/StadiumTitleBlock/StadiumTitleBlock.types';
import { stadiumHistories } from '../data/stadiumDetails';

/**
 * Converts a Stadium object to StadiumTitleData format
 * @param stadium - The stadium data object
 * @param league - The league type (MLB, NFL, MiLB)
 * @param guide - Optional stadium guide with additional details
 * @returns StadiumTitleData formatted for the StadiumTitleBlock component
 */
export function createStadiumTitleData(
  stadium: Stadium,
  league: StadiumLeague = 'MLB',
  guide?: StadiumGuide | null
): StadiumTitleData {
  const history = stadiumHistories[stadium.id];

  return {
    purpose: 'shade-guide',
    stadium: {
      name: stadium.name,
      id: stadium.id
    },
    team: {
      name: stadium.team,
      league: league,
      division: undefined // Could be enhanced with division data
    },
    quickFacts: {
      location: {
        city: stadium.city,
        state: stadium.state
      },
      capacity: stadium.capacity,
      orientation: stadium.orientation,
      roofType: stadium.roof as RoofType,
      yearBuilt: guide?.opened || history?.opened
    }
  };
}

/**
 * Creates game info for a stadium
 * @param gameTime - The game time (e.g., "7:10 PM")
 * @param opponent - The opposing team
 * @param isHome - Whether it's a home game
 * @returns GameInfo object
 */
export function createGameInfo(
  gameTime?: string,
  opponent?: string,
  isHome: boolean = true
): GameInfo | undefined {
  if (!gameTime) return undefined;

  return {
    isToday: true,
    time: gameTime,
    opponent: opponent,
    isHome: isHome
  };
}

/**
 * Creates weather info for display
 * @param temperature - Temperature in Fahrenheit
 * @param condition - Weather condition description
 * @returns WeatherInfo object
 */
export function createWeatherInfo(
  temperature?: number,
  condition?: string
): WeatherInfo | undefined {
  if (!temperature) return undefined;

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('partly')) return '⛅';
    if (lowerCondition.includes('storm')) return '⛈️';
    if (lowerCondition.includes('snow')) return '❄️';
    return '☀️';
  };

  return {
    temperature: temperature,
    condition: condition || 'Clear',
    icon: condition ? getWeatherIcon(condition) : '☀️'
  };
}

/**
 * Calculates shade information for a stadium
 * @param sections - Array of section shade data
 * @param totalSections - Total number of sections
 * @returns ShadeInfo object
 */
export function calculateShadeInfo(
  shadedSections: number,
  totalSections: number,
  bestSections?: string[]
): ShadeInfo {
  const percentage = Math.round((shadedSections / totalSections) * 100);

  return {
    percentage: percentage,
    bestSections: bestSections || []
  };
}

/**
 * Helper to determine the league from stadium ID or team name
 * @param stadiumIdOrTeam - Stadium ID or team name
 * @returns The league type
 */
export function determineLeague(stadiumIdOrTeam: string): StadiumLeague {
  // NFL team keywords
  const nflKeywords = ['49ers', 'Bears', 'Bengals', 'Bills', 'Broncos', 'Browns',
    'Buccaneers', 'Cardinals', 'Chargers', 'Chiefs', 'Colts', 'Cowboys',
    'Dolphins', 'Eagles', 'Falcons', 'Giants', 'Jaguars', 'Jets', 'Lions',
    'Packers', 'Panthers', 'Patriots', 'Raiders', 'Rams', 'Ravens', 'Saints',
    'Seahawks', 'Steelers', 'Texans', 'Titans', 'Vikings', 'Washington'];

  // MiLB level keywords
  const milbKeywords = ['AAA', 'AA', 'A+', 'A', 'Rookie', 'Triple-A', 'Double-A', 'Single-A'];

  const lowerStr = stadiumIdOrTeam.toLowerCase();

  if (nflKeywords.some(keyword => lowerStr.includes(keyword.toLowerCase()))) {
    return 'NFL';
  }

  if (milbKeywords.some(keyword => lowerStr.includes(keyword.toLowerCase()))) {
    return 'MiLB';
  }

  return 'MLB';
}

/**
 * Complete helper to create all stadium title data with optional enhancements
 */
export function prepareStadiumTitleBlockData(
  stadium: Stadium,
  options?: {
    guide?: StadiumGuide | null;
    gameTime?: string;
    opponent?: string;
    temperature?: number;
    weatherCondition?: string;
    shadedSections?: number;
    totalSections?: number;
    bestShadedSections?: string[];
  }
) {
  const league = determineLeague(stadium.team);
  const titleData = createStadiumTitleData(stadium, league, options?.guide);

  const gameInfo = options?.gameTime
    ? createGameInfo(options.gameTime, options.opponent)
    : undefined;

  const weatherInfo = options?.temperature
    ? createWeatherInfo(options.temperature, options.weatherCondition)
    : undefined;

  const shadeInfo = options?.shadedSections && options?.totalSections
    ? calculateShadeInfo(options.shadedSections, options.totalSections, options.bestShadedSections)
    : undefined;

  return {
    data: titleData,
    gameInfo,
    weatherInfo,
    shadeInfo
  };
}