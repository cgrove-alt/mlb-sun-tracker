import { withCache } from '../utils/apiCache';
import { withRetry, createRetryableFetch } from '../utils/retryUtils';
import { validateNumericRange, sanitizeApiUrl } from '../utils/validation';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  conditions: WeatherCondition[];
  precipitationProbability?: number;
  precipitationAmount?: number;
  time?: string; // Optional time property for weather data
}

export interface WeatherForecast {
  current: WeatherData;
  hourly: Array<{
    time: string;
    weather: WeatherData;
  }>;
  daily: Array<{
    date: string;
    weather: {
      day: WeatherData;
      night: WeatherData;
      min: number;
      max: number;
    };
  }>;
}

export class WeatherApiService {
  // Using Open-Meteo as it's free and doesn't require an API key
  private baseUrl = 'https://api.open-meteo.com/v1';
  private retryableFetch = createRetryableFetch({
    maxRetries: 3,
    initialDelay: 500,
    maxDelay: 5000,
    onRetry: (error, retryCount) => {
      // Retry attempt ${retryCount} after error
    }
  });

  // Centralized method to get consistent weather for any time
  getWeatherForTime(forecast: WeatherForecast, targetTime?: Date): WeatherData & { isForecastAvailable?: boolean } {
    if (!targetTime) return forecast.current;
    
    // Check if we have hourly data
    if (!forecast.hourly || forecast.hourly.length === 0) {
      return {
        ...forecast.current,
        isForecastAvailable: false
      };
    }
    
    // Get the time range of available forecast data
    const firstHourTime = new Date(forecast.hourly[0].time).getTime();
    const lastHourTime = new Date(forecast.hourly[forecast.hourly.length - 1].time).getTime();
    const targetHour = targetTime.getTime();
    
    // Check if target time is beyond forecast range
    const isBeyondForecast = targetHour > lastHourTime;
    const isBeforeForecast = targetHour < firstHourTime;
    
    // Find the closest hourly forecast to the target time
    let closestWeather = {
      ...forecast.current,
      time: new Date().toISOString()
    };
    let closestDiff = Infinity;
    
    // Debug logging
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // Weather selection debug information available
    }
    
    forecast.hourly.forEach(hourly => {
      const hourlyTime = new Date(hourly.time).getTime();
      const diff = Math.abs(hourlyTime - targetHour);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestWeather = {
          ...hourly.weather,
          time: hourly.time
        };
      }
    });
    
    // Add metadata about forecast availability
    const result = {
      ...closestWeather,
      isForecastAvailable: !isBeyondForecast && !isBeforeForecast
    };
    
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // Selected weather debug information available
    }
    
    return result;
  }
  
  getForecast = withCache(
    async (latitude: number, longitude: number): Promise<WeatherForecast> => {
      // Validate coordinates
      if (!validateNumericRange(latitude, -90, 90)) {
        throw new Error('Invalid latitude: must be between -90 and 90');
      }
      if (!validateNumericRange(longitude, -180, 180)) {
        throw new Error('Invalid longitude: must be between -180 and 180');
      }
      
      try {
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
          hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph',
          precipitation_unit: 'inch',
          timezone: 'auto',
          forecast_days: '7'
        });

        const url = `${this.baseUrl}/forecast?${params}`;
        const sanitizedUrl = sanitizeApiUrl(url);
        const response = await this.retryableFetch(sanitizedUrl);
        
        if (!response.ok) {
          throw new Error(`Weather API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        return this.parseWeatherResponse(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Throw error instead of silently falling back to mock data
        throw new Error(`Weather service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    'weather-forecast',
    10 * 60 * 1000 // Cache for 10 minutes
  );

  private parseWeatherResponse(data: any): WeatherForecast {
    const current = this.parseCurrentWeather(data.current);
    
    // Get all hourly data (7 days * 24 hours = 168 hours)
    const hourly = data.hourly.time.map((time: string, index: number) => ({
      time,
      weather: this.parseHourlyWeather(data.hourly, index)
    }));
    
    const daily = data.daily.time.map((date: string, index: number) => ({
      date,
      weather: {
        day: this.parseDailyWeather(data.daily, index, true),
        night: this.parseDailyWeather(data.daily, index, false),
        min: data.daily.temperature_2m_min[index],
        max: data.daily.temperature_2m_max[index]
      }
    }));
    
    return { current, hourly, daily };
  }

  private parseCurrentWeather(current: any): WeatherData {
    return {
      temperature: current.temperature_2m || 70,
      feelsLike: current.apparent_temperature || 70,
      humidity: current.relative_humidity_2m || 50,
      pressure: current.pressure_msl || 1013,
      windSpeed: current.wind_speed_10m || 0,
      windDirection: current.wind_direction_10m || 0,
      cloudCover: current.cloud_cover || 0,
      visibility: 10, // Open-Meteo doesn't provide current visibility
      uvIndex: 0, // Not available in current weather
      conditions: [this.getWeatherCondition(current.weather_code || 0, current.is_day)],
      precipitationProbability: 0,
      precipitationAmount: current.precipitation || 0
    };
  }

  private parseHourlyWeather(hourly: any, index: number): WeatherData {
    return {
      temperature: hourly.temperature_2m[index] || 70,
      feelsLike: hourly.apparent_temperature[index] || 70,
      humidity: hourly.relative_humidity_2m[index] || 50,
      pressure: hourly.pressure_msl[index] || 1013,
      windSpeed: hourly.wind_speed_10m[index] || 0,
      windDirection: hourly.wind_direction_10m[index] || 0,
      cloudCover: hourly.cloud_cover[index] || 0,
      visibility: hourly.visibility[index] / 1000 || 10, // Convert m to km
      uvIndex: hourly.uv_index[index] || 0,
      conditions: [this.getWeatherCondition(hourly.weather_code[index] || 0, hourly.is_day[index])],
      precipitationProbability: hourly.precipitation_probability[index] || 0,
      precipitationAmount: hourly.precipitation[index] || 0
    };
  }

  private parseDailyWeather(daily: any, index: number, isDay: boolean): WeatherData {
    return {
      temperature: isDay ? daily.temperature_2m_max[index] : daily.temperature_2m_min[index],
      feelsLike: isDay ? daily.apparent_temperature_max[index] : daily.apparent_temperature_min[index],
      humidity: 50, // Not available in daily data
      pressure: 1013, // Not available in daily data
      windSpeed: daily.wind_speed_10m_max[index] || 0,
      windDirection: daily.wind_direction_10m_dominant[index] || 0,
      cloudCover: 50, // Estimated
      visibility: 10,
      uvIndex: daily.uv_index_max[index] || 0,
      conditions: [this.getWeatherCondition(daily.weather_code[index] || 0, isDay)],
      precipitationProbability: daily.precipitation_probability_max[index] || 0,
      precipitationAmount: daily.precipitation_sum[index] || 0
    };
  }

  private getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
    // Complete WMO Weather interpretation codes
    const weatherCodes: Record<number, WeatherCondition> = {
      0: { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' },
      1: { id: 801, main: 'Clouds', description: 'Mainly clear', icon: '02d' },
      2: { id: 802, main: 'Clouds', description: 'Partly cloudy', icon: '03d' },
      3: { id: 803, main: 'Clouds', description: 'Overcast', icon: '04d' },
      45: { id: 741, main: 'Fog', description: 'Fog', icon: '50d' },
      48: { id: 741, main: 'Fog', description: 'Depositing rime fog', icon: '50d' },
      51: { id: 300, main: 'Drizzle', description: 'Light drizzle', icon: '09d' },
      53: { id: 301, main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
      55: { id: 302, main: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
      56: { id: 310, main: 'Drizzle', description: 'Light freezing drizzle', icon: '09d' },
      57: { id: 311, main: 'Drizzle', description: 'Dense freezing drizzle', icon: '09d' },
      61: { id: 500, main: 'Rain', description: 'Slight rain', icon: '10d' },
      63: { id: 501, main: 'Rain', description: 'Moderate rain', icon: '10d' },
      65: { id: 502, main: 'Rain', description: 'Heavy rain', icon: '10d' },
      66: { id: 511, main: 'Rain', description: 'Light freezing rain', icon: '10d' },
      67: { id: 511, main: 'Rain', description: 'Heavy freezing rain', icon: '10d' },
      71: { id: 600, main: 'Snow', description: 'Slight snow', icon: '13d' },
      73: { id: 601, main: 'Snow', description: 'Moderate snow', icon: '13d' },
      75: { id: 602, main: 'Snow', description: 'Heavy snow', icon: '13d' },
      77: { id: 600, main: 'Snow', description: 'Snow grains', icon: '13d' },
      80: { id: 520, main: 'Rain', description: 'Slight rain showers', icon: '09d' },
      81: { id: 521, main: 'Rain', description: 'Moderate rain showers', icon: '09d' },
      82: { id: 522, main: 'Rain', description: 'Violent rain showers', icon: '09d' },
      85: { id: 620, main: 'Snow', description: 'Slight snow showers', icon: '13d' },
      86: { id: 621, main: 'Snow', description: 'Heavy snow showers', icon: '13d' },
      95: { id: 200, main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
      96: { id: 201, main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '11d' },
      99: { id: 202, main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' }
    };
    
    // Log unmapped codes for debugging
    if (!weatherCodes[code]) {
      console.warn(`Unknown weather code: ${code}. Defaulting to partly cloudy.`);
      return { id: 802, main: 'Clouds', description: 'Unknown conditions (partly cloudy)', icon: isDay ? '03d' : '03n' };
    }
    
    const condition = weatherCodes[code];
    // Apply day/night icon variation
    const icon = condition.icon.replace('d', isDay ? 'd' : 'n');
    
    return {
      ...condition,
      icon
    };
  }

  getWeatherImpactOnSun(weather: WeatherData): {
    visibility: 'excellent' | 'good' | 'poor' | 'blocked';
    recommendation: string;
    sunExposureAdjustment: number; // 0-1 multiplier for sun exposure
  } {
    const { cloudCover, conditions, precipitationProbability } = weather;
    
    if ((precipitationProbability && precipitationProbability > 70) || conditions.some(c => c.main === 'Rain' || c.main === 'Snow')) {
      return {
        visibility: 'blocked',
        recommendation: 'Rain/snow will block most sunlight. Any covered seating recommended.',
        sunExposureAdjustment: 0.1
      };
    }
    
    if (cloudCover > 80) {
      return {
        visibility: 'poor',
        recommendation: 'Heavy cloud cover will significantly reduce sun exposure.',
        sunExposureAdjustment: 0.3
      };
    }
    
    if (cloudCover > 50) {
      return {
        visibility: 'good',
        recommendation: 'Partial cloud cover will provide some relief from direct sunlight.',
        sunExposureAdjustment: 0.6
      };
    }
    
    if (cloudCover > 20) {
      return {
        visibility: 'good',
        recommendation: 'Mostly sunny with some clouds providing occasional shade.',
        sunExposureAdjustment: 0.8
      };
    }
    
    return {
      visibility: 'excellent',
      recommendation: 'Clear skies - full sun exposure expected. Consider shade if sun-sensitive.',
      sunExposureAdjustment: 1.0
    };
  }

  // Public methods for testing and enhanced functionality
  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const forecast = await this.getForecast(latitude, longitude);
      return forecast.current;
    } catch (error) {
      console.warn('Failed to fetch current weather, returning fallback data:', error);
      return this.getMockWeather().current;
    }
  }
  
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecast> {
    try {
      return await this.getForecast(latitude, longitude);
    } catch (error) {
      console.warn('Failed to fetch weather forecast, returning fallback data:', error);
      return this.getMockWeather();
    }
  }
  
  mapWeatherCode(code: number): WeatherCondition {
    return this.getWeatherCondition(code, true);
  }
  
  calculateSunExposureMultiplier(cloudCover: number, precipitation: number): number {
    // Heavy precipitation blocks most sun
    if (precipitation > 0) {
      return Math.max(0.1, 0.2 - precipitation * 0.02);
    }
    
    // Cloud cover reduces sun exposure
    if (cloudCover >= 100) return 0.1;
    if (cloudCover >= 75) return 0.25;
    if (cloudCover >= 50) return 0.5;
    if (cloudCover >= 25) return 0.75;
    return 1.0;
  }
  
  getUVRecommendation(uvIndex: number): string {
    if (uvIndex >= 11) {
      return 'Extreme UV! Avoid sun exposure. Use maximum protection including sunscreen SPF 50+, hat, and UV-blocking clothing.';
    }
    if (uvIndex >= 8) {
      return 'Very high UV. Extra protection needed. Use sunscreen SPF 30+, seek shade during midday hours.';
    }
    if (uvIndex >= 6) {
      return 'High UV. Protection required. Use sunscreen SPF 30+, wear hat and sunglasses.';
    }
    if (uvIndex >= 3) {
      return 'Moderate UV. Consider protection if outside for extended periods. Sunscreen SPF 15+ recommended.';
    }
    return 'Low UV. Minimal protection needed for most skin types.';
  }

  private getMockWeather(): WeatherForecast {
    const mockWeather: WeatherData = {
      temperature: 75,
      feelsLike: 78,
      humidity: 45,
      pressure: 1015,
      windSpeed: 8,
      windDirection: 180,
      cloudCover: 25,
      visibility: 10,
      uvIndex: 6,
      conditions: [{ id: 801, main: 'Clouds', description: 'Few clouds', icon: '02d' }],
      precipitationProbability: 10,
      precipitationAmount: 0
    };

    const current = mockWeather;
    
    const hourly = Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      weather: {
        ...mockWeather,
        temperature: mockWeather.temperature + Math.random() * 10 - 5,
        cloudCover: Math.max(0, Math.min(100, mockWeather.cloudCover + Math.random() * 40 - 20))
      }
    }));
    
    const daily = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weather: {
        day: { ...mockWeather, temperature: mockWeather.temperature + 5 },
        night: { ...mockWeather, temperature: mockWeather.temperature - 10 },
        min: mockWeather.temperature - 10,
        max: mockWeather.temperature + 5
      }
    }));
    
    return { current, hourly, daily };
  }
}

export const weatherApi = new WeatherApiService();