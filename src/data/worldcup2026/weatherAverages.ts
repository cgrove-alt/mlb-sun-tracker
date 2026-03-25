// Static June/July weather averages for World Cup 2026 venue cities
// Sources: NOAA, Weather.com historical averages

export interface CityWeatherAverage {
  city: string;
  venueIds: string[];
  june: MonthWeather;
  july: MonthWeather;
}

export interface MonthWeather {
  highTempF: number;
  highTempC: number;
  humidity: number; // percent
  uvIndex: number;  // 1-11+
  rainyDays: number;
}

export const WEATHER_AVERAGES: CityWeatherAverage[] = [
  {
    city: 'East Rutherford, NJ',
    venueIds: ['metlife-stadium-wc'],
    june: { highTempF: 82, highTempC: 28, humidity: 62, uvIndex: 9, rainyDays: 10 },
    july: { highTempF: 87, highTempC: 31, humidity: 63, uvIndex: 9, rainyDays: 9 }
  },
  {
    city: 'Inglewood, CA',
    venueIds: ['sofi-stadium-wc'],
    june: { highTempF: 77, highTempC: 25, humidity: 68, uvIndex: 10, rainyDays: 1 },
    july: { highTempF: 83, highTempC: 28, humidity: 65, uvIndex: 10, rainyDays: 0 }
  },
  {
    city: 'Arlington, TX',
    venueIds: ['att-stadium-wc'],
    june: { highTempF: 95, highTempC: 35, humidity: 55, uvIndex: 10, rainyDays: 7 },
    july: { highTempF: 99, highTempC: 37, humidity: 48, uvIndex: 11, rainyDays: 4 }
  },
  {
    city: 'Atlanta, GA',
    venueIds: ['mercedes-benz-stadium-wc'],
    june: { highTempF: 89, highTempC: 32, humidity: 65, uvIndex: 10, rainyDays: 10 },
    july: { highTempF: 91, highTempC: 33, humidity: 68, uvIndex: 10, rainyDays: 11 }
  },
  {
    city: 'Kansas City, MO',
    venueIds: ['arrowhead-stadium-wc'],
    june: { highTempF: 88, highTempC: 31, humidity: 62, uvIndex: 10, rainyDays: 9 },
    july: { highTempF: 92, highTempC: 33, humidity: 60, uvIndex: 10, rainyDays: 7 }
  },
  {
    city: 'Miami Gardens, FL',
    venueIds: ['hard-rock-stadium-wc'],
    june: { highTempF: 90, highTempC: 32, humidity: 74, uvIndex: 11, rainyDays: 16 },
    july: { highTempF: 91, highTempC: 33, humidity: 73, uvIndex: 11, rainyDays: 16 }
  },
  {
    city: 'Philadelphia, PA',
    venueIds: ['lincoln-financial-field-wc'],
    june: { highTempF: 84, highTempC: 29, humidity: 60, uvIndex: 9, rainyDays: 10 },
    july: { highTempF: 89, highTempC: 32, humidity: 62, uvIndex: 9, rainyDays: 9 }
  },
  {
    city: 'Santa Clara, CA',
    venueIds: ['levis-stadium-wc'],
    june: { highTempF: 80, highTempC: 27, humidity: 52, uvIndex: 10, rainyDays: 1 },
    july: { highTempF: 82, highTempC: 28, humidity: 54, uvIndex: 10, rainyDays: 0 }
  },
  {
    city: 'Foxborough, MA',
    venueIds: ['gillette-stadium-wc'],
    june: { highTempF: 79, highTempC: 26, humidity: 62, uvIndex: 8, rainyDays: 10 },
    july: { highTempF: 84, highTempC: 29, humidity: 64, uvIndex: 9, rainyDays: 9 }
  },
  {
    city: 'Houston, TX',
    venueIds: ['nrg-stadium-wc'],
    june: { highTempF: 93, highTempC: 34, humidity: 72, uvIndex: 11, rainyDays: 10 },
    july: { highTempF: 95, highTempC: 35, humidity: 70, uvIndex: 11, rainyDays: 9 }
  },
  {
    city: 'Seattle, WA',
    venueIds: ['lumen-field-wc'],
    june: { highTempF: 70, highTempC: 21, humidity: 58, uvIndex: 7, rainyDays: 7 },
    july: { highTempF: 76, highTempC: 24, humidity: 52, uvIndex: 8, rainyDays: 3 }
  },
  {
    city: 'Mexico City',
    venueIds: ['estadio-azteca-wc'],
    june: { highTempF: 77, highTempC: 25, humidity: 60, uvIndex: 11, rainyDays: 18 },
    july: { highTempF: 75, highTempC: 24, humidity: 62, uvIndex: 11, rainyDays: 20 }
  },
  {
    city: 'Guadalajara',
    venueIds: ['estadio-akron-wc'],
    june: { highTempF: 88, highTempC: 31, humidity: 58, uvIndex: 11, rainyDays: 15 },
    july: { highTempF: 84, highTempC: 29, humidity: 65, uvIndex: 11, rainyDays: 19 }
  },
  {
    city: 'Monterrey',
    venueIds: ['estadio-bbva-wc'],
    june: { highTempF: 97, highTempC: 36, humidity: 52, uvIndex: 11, rainyDays: 8 },
    july: { highTempF: 97, highTempC: 36, humidity: 50, uvIndex: 11, rainyDays: 7 }
  },
  {
    city: 'Vancouver',
    venueIds: ['bc-place-wc'],
    june: { highTempF: 68, highTempC: 20, humidity: 60, uvIndex: 7, rainyDays: 9 },
    july: { highTempF: 73, highTempC: 23, humidity: 56, uvIndex: 8, rainyDays: 5 }
  },
  {
    city: 'Toronto',
    venueIds: ['bmo-field-wc'],
    june: { highTempF: 77, highTempC: 25, humidity: 60, uvIndex: 8, rainyDays: 10 },
    july: { highTempF: 81, highTempC: 27, humidity: 62, uvIndex: 9, rainyDays: 9 }
  }
];

/** Get weather averages for a specific venue */
export function getWeatherForVenue(venueId: string): CityWeatherAverage | undefined {
  return WEATHER_AVERAGES.find(w => w.venueIds.includes(venueId));
}
