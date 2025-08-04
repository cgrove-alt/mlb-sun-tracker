"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherApi = exports.WeatherApiService = void 0;
const apiCache_1 = require("../utils/apiCache");
const retryUtils_1 = require("../utils/retryUtils");
const validation_1 = require("../utils/validation");
class WeatherApiService {
    constructor() {
        // Using Open-Meteo as it's free and doesn't require an API key
        this.baseUrl = 'https://api.open-meteo.com/v1';
        this.retryableFetch = (0, retryUtils_1.createRetryableFetch)({
            maxRetries: 3,
            initialDelay: 500,
            maxDelay: 5000,
            onRetry: (error, retryCount) => {
                console.log(`Weather API retry attempt ${retryCount} after error:`, error.message);
            }
        });
        this.getForecast = (0, apiCache_1.withCache)(async (latitude, longitude) => {
            // Validate coordinates
            if (!(0, validation_1.validateNumericRange)(latitude, -90, 90)) {
                throw new Error('Invalid latitude: must be between -90 and 90');
            }
            if (!(0, validation_1.validateNumericRange)(longitude, -180, 180)) {
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
                const sanitizedUrl = (0, validation_1.sanitizeApiUrl)(url);
                const response = await this.retryableFetch(sanitizedUrl);
                if (!response.ok) {
                    throw new Error(`Weather API request failed: ${response.status}`);
                }
                const data = await response.json();
                return this.parseWeatherResponse(data);
            }
            catch (error) {
                console.error('Error fetching weather data:', error);
                // Throw error instead of silently falling back to mock data
                throw new Error(`Weather service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }, 'weather-forecast', 10 * 60 * 1000 // Cache for 10 minutes
        );
    }
    // Centralized method to get consistent weather for any time
    getWeatherForTime(forecast, targetTime) {
        if (!targetTime)
            return forecast.current;
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
        if (process.env.NODE_ENV === 'development') {
            console.log('Weather selection debug:', {
                targetTime: targetTime.toISOString(),
                hourlyDataCount: forecast.hourly.length,
                firstHour: forecast.hourly[0]?.time,
                lastHour: forecast.hourly[forecast.hourly.length - 1]?.time,
                isBeyondForecast,
                isBeforeForecast
            });
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
        if (process.env.NODE_ENV === 'development') {
            console.log('Selected weather:', {
                selectedTime: closestWeather.time,
                temperature: closestWeather.temperature,
                diffHours: closestDiff / (1000 * 60 * 60),
                isForecastAvailable: result.isForecastAvailable
            });
        }
        return result;
    }
    parseWeatherResponse(data) {
        const current = this.parseCurrentWeather(data.current);
        // Get all hourly data (7 days * 24 hours = 168 hours)
        const hourly = data.hourly.time.map((time, index) => ({
            time,
            weather: this.parseHourlyWeather(data.hourly, index)
        }));
        const daily = data.daily.time.map((date, index) => ({
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
    parseCurrentWeather(current) {
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
    parseHourlyWeather(hourly, index) {
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
    parseDailyWeather(daily, index, isDay) {
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
    getWeatherCondition(code, isDay = true) {
        // Complete WMO Weather interpretation codes
        const weatherCodes = {
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
    getWeatherImpactOnSun(weather) {
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
    getMockWeather() {
        const mockWeather = {
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
exports.WeatherApiService = WeatherApiService;
exports.weatherApi = new WeatherApiService();
