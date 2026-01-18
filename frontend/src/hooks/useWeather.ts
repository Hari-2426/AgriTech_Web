import { useState, useEffect } from 'react';
import type { WeatherData } from '@/types/agri';

// Mock weather data for demo - In production, integrate with OpenWeatherMap API
const generateMockWeather = (): WeatherData => {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️'];

  const randomCondition = Math.floor(Math.random() * conditions.length);

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() + i) % 24;
    const condIdx = Math.floor(Math.random() * conditions.length);
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      temp: Math.round(25 + Math.random() * 10 - 5),
      condition: conditions[condIdx],
      icon: icons[condIdx],
      precipChance: Math.round(Math.random() * 40),
    };
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const condIdx = Math.floor(Math.random() * conditions.length);
    return {
      date: date.toISOString().split('T')[0],
      day: days[date.getDay()],
      high: Math.round(28 + Math.random() * 8),
      low: Math.round(18 + Math.random() * 6),
      condition: conditions[condIdx],
      icon: icons[condIdx],
      precipChance: Math.round(Math.random() * 60),
    };
  });

  return {
    current: {
      temp: Math.round(26 + Math.random() * 6),
      humidity: Math.round(55 + Math.random() * 25),
      windSpeed: Math.round(8 + Math.random() * 12),
      condition: conditions[randomCondition],
      icon: icons[randomCondition],
      uv: Math.round(4 + Math.random() * 5),
      feelsLike: Math.round(27 + Math.random() * 5),
    },
    hourly: hourlyData,
    daily: dailyData,
  };
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Get farmer district from localStorage
        const farmerDataString = localStorage.getItem('farmerData');
        const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;
        const district = farmerData?.district || 'Hyderabad';

        const response = await fetch(`http://localhost:5000/api/weather?location=${encodeURIComponent(district)}`);
        const json = await response.json();

        if (json.success) {
          setWeather(json.data);
          // Cache in localStorage for offline use
          localStorage.setItem('agri_weather_cache', JSON.stringify({
            data: json.data,
            location: district,
            timestamp: Date.now(),
          }));
        } else {
          throw new Error(json.message || 'Failed to fetch weather');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        // Try to load from cache
        const cached = localStorage.getItem('agri_weather_cache');
        if (cached) {
          const { data } = JSON.parse(cached);
          setWeather(data);
        } else {
          setError('Failed to fetch weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setLoading(true);
    const farmerDataString = localStorage.getItem('farmerData');
    const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;
    const district = farmerData?.district || 'Hyderabad';

    try {
      const response = await fetch(`http://localhost:5000/api/weather?location=${encodeURIComponent(district)}`);
      const json = await response.json();
      if (json.success) setWeather(json.data);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return { weather, loading, error, refresh };
}
