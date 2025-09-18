/**
 * Weather API Integration Tests
 * Tests the Open-Meteo weather service integration
 */

import { WeatherApiService, WeatherData, WeatherForecast } from '../weatherApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('Weather API Service', () => {
  let weatherService: WeatherApiService;
  
  beforeEach(() => {
    weatherService = new WeatherApiService();
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCurrentWeather', () => {
    test('Fetches current weather successfully', async () => {
      const mockResponse = {
        current: {
          time: '2025-07-04T12:00:00',
          temperature_2m: 25,
          apparent_temperature: 27,
          relative_humidity_2m: 60,
          pressure_msl: 1013,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          cloud_cover: 40,
          weather_code: 1
        }
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const weather = await weatherService.getCurrentWeather(40.8296, -73.9262);
      
      expect(weather).toBeDefined();
      expect(weather.temperature).toBeCloseTo(77, 0); // 25°C to °F
      expect(weather.humidity).toBe(60);
      expect(weather.cloudCover).toBe(40);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.open-meteo.com'),
        expect.any(Object)
      );
    });

    test('Handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const weather = await weatherService.getCurrentWeather(40.8296, -73.9262);
      
      // Should return fallback data
      expect(weather).toBeDefined();
      expect(weather.temperature).toBeGreaterThan(0);
      expect(weather.conditions).toEqual([{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }]);
    });

    test('Validates coordinate inputs', async () => {
      const invalidCoordinates = [
        { lat: 91, lon: 0 },    // Invalid latitude
        { lat: -91, lon: 0 },   // Invalid latitude
        { lat: 0, lon: 181 },   // Invalid longitude
        { lat: 0, lon: -181 },  // Invalid longitude
        { lat: NaN, lon: 0 },   // NaN latitude
        { lat: 0, lon: NaN }    // NaN longitude
      ];
      
      for (const coords of invalidCoordinates) {
        const weather = await weatherService.getCurrentWeather(coords.lat, coords.lon);
        // Should return fallback data for invalid coordinates
        expect(weather).toBeDefined();
        expect(weather.temperature).toBeGreaterThan(0);
      }
    });

    test('Caches weather data', async () => {
      const mockResponse = {
        current: {
          time: '2025-07-04T12:00:00',
          temperature_2m: 25,
          relative_humidity_2m: 60,
          pressure_msl: 1013,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          cloud_cover: 40,
          weather_code: 1
        }
      };
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      // First call
      const weather1 = await weatherService.getCurrentWeather(40.8296, -73.9262);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Second call (should use cache)
      const weather2 = await weatherService.getCurrentWeather(40.8296, -73.9262);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still only 1 call
      
      expect(weather1).toEqual(weather2);
    });
  });

  describe('getWeatherForecast', () => {
    test('Fetches 7-day forecast successfully', async () => {
      const mockResponse = {
        current: {
          time: '2025-07-04T12:00:00',
          temperature_2m: 25,
          relative_humidity_2m: 60,
          weather_code: 1
        },
        hourly: {
          time: [
            '2025-07-04T00:00:00',
            '2025-07-04T01:00:00',
            '2025-07-04T02:00:00'
          ],
          temperature_2m: [20, 21, 22],
          relative_humidity_2m: [65, 64, 63],
          weather_code: [0, 0, 1]
        },
        daily: {
          time: ['2025-07-04', '2025-07-05'],
          temperature_2m_max: [30, 32],
          temperature_2m_min: [20, 22],
          weather_code: [1, 2]
        }
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const forecast = await weatherService.getWeatherForecast(40.8296, -73.9262);
      
      expect(forecast).toBeDefined();
      expect(forecast.current).toBeDefined();
      expect(forecast.hourly).toHaveLength(3);
      expect(forecast.daily).toHaveLength(2);
      expect(forecast.hourly[0].time).toBe('2025-07-04T00:00:00');
    });

    test('Handles missing forecast data', async () => {
      const mockResponse = {
        current: {
          time: '2025-07-04T12:00:00',
          temperature_2m: 25,
          weather_code: 1
        }
        // Missing hourly and daily data
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const forecast = await weatherService.getWeatherForecast(40.8296, -73.9262);
      
      expect(forecast).toBeDefined();
      expect(forecast.current).toBeDefined();
      expect(forecast.hourly).toEqual([]);
      expect(forecast.daily).toEqual([]);
    });
  });

  describe('getWeatherForTime', () => {
    const mockForecast: WeatherForecast = {
      current: {
        temperature: 75,
        feelsLike: 77,
        humidity: 60,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 180,
        cloudCover: 40,
        visibility: 10,
        uvIndex: 5,
        conditions: []
      },
      hourly: [
        {
          time: '2025-07-04T12:00:00',
          weather: {
            temperature: 80,
            feelsLike: 82,
            humidity: 55,
            pressure: 1012,
            windSpeed: 12,
            windDirection: 190,
            cloudCover: 30,
            visibility: 10,
            uvIndex: 7,
            conditions: []
          }
        },
        {
          time: '2025-07-04T15:00:00',
          weather: {
            temperature: 85,
            feelsLike: 88,
            humidity: 50,
            pressure: 1011,
            windSpeed: 15,
            windDirection: 200,
            cloudCover: 20,
            visibility: 10,
            uvIndex: 8,
            conditions: []
          }
        }
      ],
      daily: []
    };

    test('Returns current weather when no target time', () => {
      const weather = weatherService.getWeatherForTime(mockForecast);
      expect(weather).toEqual(mockForecast.current);
    });

    test('Returns closest hourly forecast for target time', () => {
      const targetTime = new Date('2025-07-04T14:30:00');
      const weather = weatherService.getWeatherForTime(mockForecast, targetTime);
      
      // Should return 15:00 forecast (closer than 12:00)
      expect(weather.temperature).toBe(85);
      expect(weather.cloudCover).toBe(20);
    });

    test('Handles time before forecast range', () => {
      const targetTime = new Date('2025-07-04T06:00:00');
      const weather = weatherService.getWeatherForTime(mockForecast, targetTime);
      
      // Should return first available hour
      expect(weather.temperature).toBe(80);
      expect(weather.isForecastAvailable).toBe(false);
    });

    test('Handles time after forecast range', () => {
      const targetTime = new Date('2025-07-05T12:00:00');
      const weather = weatherService.getWeatherForTime(mockForecast, targetTime);
      
      // Should return last available hour
      expect(weather.temperature).toBe(85);
      expect(weather.isForecastAvailable).toBe(false);
    });

    test('Handles empty hourly forecast', () => {
      const emptyForecast: WeatherForecast = {
        ...mockForecast,
        hourly: []
      };
      
      const targetTime = new Date('2025-07-04T15:00:00');
      const weather = weatherService.getWeatherForTime(emptyForecast, targetTime);
      
      expect(weather).toEqual({
        ...mockForecast.current,
        isForecastAvailable: false
      });
    });
  });

  describe('Weather Code Mapping', () => {
    test('Maps weather codes to conditions correctly', () => {
      const weatherCodes = [
        { code: 0, expected: 'Clear' },
        { code: 1, expected: 'Mainly Clear' },
        { code: 2, expected: 'Partly Cloudy' },
        { code: 3, expected: 'Overcast' },
        { code: 45, expected: 'Fog' },
        { code: 61, expected: 'Light Rain' },
        { code: 71, expected: 'Light Snow' },
        { code: 95, expected: 'Thunderstorm' }
      ];
      
      weatherCodes.forEach(({ code, expected }) => {
        const condition = weatherService.mapWeatherCode(code);
        expect(condition.main).toContain(expected);
      });
    });
  });

  describe('Performance and Retry Logic', () => {
    test('Retries on network failure', async () => {
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            current: {
              temperature_2m: 25,
              weather_code: 1
            }
          })
        });
      });
      
      const weather = await weatherService.getCurrentWeather(40.8296, -73.9262);
      
      expect(weather).toBeDefined();
      expect(callCount).toBe(3); // Failed twice, succeeded on third
    });

    test('Respects rate limits', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });
      
      const weather = await weatherService.getCurrentWeather(40.8296, -73.9262);
      
      // Should return fallback data on rate limit
      expect(weather).toBeDefined();
      expect(weather.conditions[0].main).toBe('Clear');
    });

    test('Times out long requests', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 10000))
      );
      
      const startTime = Date.now();
      const weather = await weatherService.getCurrentWeather(40.8296, -73.9262);
      const elapsed = Date.now() - startTime;
      
      expect(elapsed).toBeLessThan(6000); // Should timeout before 10s
      expect(weather).toBeDefined(); // Should return fallback
    });
  });

  describe('Weather Impact on Sun Exposure', () => {
    test('Calculates cloud cover impact', () => {
      const testCases = [
        { cloudCover: 0, expected: 1.0 },    // Clear sky
        { cloudCover: 25, expected: 0.75 },  // Few clouds
        { cloudCover: 50, expected: 0.5 },   // Partly cloudy
        { cloudCover: 75, expected: 0.25 },  // Mostly cloudy
        { cloudCover: 100, expected: 0.1 }   // Overcast
      ];
      
      testCases.forEach(({ cloudCover, expected }) => {
        const impact = weatherService.calculateSunExposureMultiplier(cloudCover, 0);
        expect(impact).toBeCloseTo(expected, 1);
      });
    });

    test('Accounts for precipitation', () => {
      const rainImpact = weatherService.calculateSunExposureMultiplier(50, 5);
      const noRainImpact = weatherService.calculateSunExposureMultiplier(50, 0);
      
      expect(rainImpact).toBeLessThan(noRainImpact);
      expect(rainImpact).toBeCloseTo(0.2, 1); // Heavy reduction with rain
    });

    test('UV index affects recommendations', () => {
      const weather: WeatherData = {
        temperature: 80,
        feelsLike: 82,
        humidity: 50,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 180,
        cloudCover: 20,
        visibility: 10,
        uvIndex: 9, // Very high
        conditions: []
      };
      
      const recommendation = weatherService.getUVRecommendation(weather.uvIndex);
      expect(recommendation).toContain('protection');
      expect(recommendation).toContain('sunscreen');
    });
  });

  describe('Stadium-Specific Weather', () => {
    test('Gets weather for all MLB stadiums', async () => {
      const stadiums = [
        { id: 'yankees', lat: 40.8296, lon: -73.9262 },
        { id: 'dodgers', lat: 34.0739, lon: -118.2400 },
        { id: 'fenway', lat: 42.3467, lon: -71.0972 }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 25,
            weather_code: 1
          }
        })
      });
      
      const weatherPromises = stadiums.map(s => 
        weatherService.getCurrentWeather(s.lat, s.lon)
      );
      
      const results = await Promise.all(weatherPromises);
      
      expect(results).toHaveLength(3);
      results.forEach(weather => {
        expect(weather).toBeDefined();
        expect(weather.temperature).toBeGreaterThan(0);
      });
    });
  });
});