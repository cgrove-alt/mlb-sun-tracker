import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherWidget from '../WeatherWidget';

// Mock fetch
global.fetch = jest.fn();

const mockWeatherData = {
  current: {
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
  },
  hourly: Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
    weather: {
      temperature: 75 + Math.random() * 10 - 5,
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
    }
  })),
  daily: []
};

describe('WeatherWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData
    });
  });

  it('renders loading state initially', () => {
    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    expect(screen.getByText('Loading weather...')).toBeInTheDocument();
  });

  it('displays weather data after loading', async () => {
    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('75°F')).toBeInTheDocument();
    });

    expect(screen.getByText('Feels like 78°F')).toBeInTheDocument();
    expect(screen.getByText('Few clouds')).toBeInTheDocument();
    expect(screen.getByText(/25% -/)).toBeInTheDocument();
  });

  it('displays UV index with appropriate warning', async () => {
    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/6 \(High\)/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Protection required/)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Weather data unavailable')).toBeInTheDocument();
    });
  });

  it('shows hourly forecast when toggled', async () => {
    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Show Hourly Forecast')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Show Hourly Forecast');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Next 12 Hours')).toBeInTheDocument();
    expect(screen.getByText('Hide Hourly Forecast')).toBeInTheDocument();
  });

  it('displays weather for specific game time', async () => {
    const gameTime = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
        gameTime={gameTime}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/For game at/)).toBeInTheDocument();
    });
  });

  it('calls onWeatherLoad callback when weather is loaded', async () => {
    const onWeatherLoad = jest.fn();

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
        onWeatherLoad={onWeatherLoad}
      />
    );

    await waitFor(() => {
      expect(onWeatherLoad).toHaveBeenCalledWith(mockWeatherData.current);
    });
  });

  it('displays cloud cover impact correctly', async () => {
    const weatherWithHighClouds = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        cloudCover: 85
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => weatherWithHighClouds
    });

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/85% - Overcast - Minimal sun/)).toBeInTheDocument();
    });
  });

  it('shows precipitation warning when rain chance is high', async () => {
    const weatherWithRain = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        precipitationProbability: 75,
        conditions: [{ id: 500, main: 'Rain', description: 'Light rain', icon: '10d' }]
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => weatherWithRain
    });

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    expect(screen.getByText('Rain Chance')).toBeInTheDocument();
  });

  it('provides heat warnings for high temperatures', async () => {
    const hotWeather = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        temperature: 95
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => hotWeather
    });

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Stay hydrated/)).toBeInTheDocument();
    });
  });

  it('shows wind warning for windy conditions', async () => {
    const windyWeather = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        windSpeed: 20
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => windyWeather
    });

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Secure loose items/)).toBeInTheDocument();
    });
  });

  it('refreshes weather data every 10 minutes', async () => {
    jest.useFakeTimers();

    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('75°F')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Fast-forward 10 minutes
    jest.advanceTimersByTime(10 * 60 * 1000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it('properly formats API URL with coordinates', async () => {
    render(
      <WeatherWidget
        latitude={34.0735}
        longitude={-118.2400}
        stadiumName="Dodger Stadium"
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/weather/Dodger%20Stadium?lat=34.0735&lng=-118.24')
      );
    });
  });
});