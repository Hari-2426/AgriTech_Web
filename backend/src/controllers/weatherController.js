const axios = require('axios');
const { formatResponse } = require('../utils/responseFormatter');

// Helper to map weather conditions to emojis used in the frontend
const getConditionIcon = (code) => {
    // WeatherAPI codes: https://www.weatherapi.com/docs/weather_conditions.json
    if (code === 1000) return '☀️'; // Sunny/Clear
    if ([1003, 1006, 1009].includes(code)) return '⛅'; // Cloudy
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return '🌧️'; // Rain
    if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return '🌨️'; // Snow
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️'; // Thunder
    return '🌤️'; // Default
};

exports.getWeather = async (req, res, next) => {
    try {
        const location = req.query.location || 'Hyderabad';
        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            console.warn('WEATHER_API_KEY is not defined. Using mock data.');
            return res.status(200).json(formatResponse(true, 'Mock weather data (No API Key)', generateMockWeather(location)));
        }

        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json`, {
            params: {
                key: apiKey,
                q: location,
                days: 7,
                aqi: 'no',
                alerts: 'yes'
            }
        });

        const data = response.data;

        const weatherData = {
            current: {
                temp: Math.round(data.current.temp_c),
                humidity: data.current.humidity,
                windSpeed: Math.round(data.current.wind_kph),
                condition: data.current.condition.text,
                icon: getConditionIcon(data.current.condition.code),
                uv: data.current.uv,
                feelsLike: Math.round(data.current.feelslike_c),
            },
            hourly: data.forecast.forecastday[0].hour.map(h => ({
                time: h.time.split(' ')[1],
                temp: Math.round(h.temp_c),
                condition: h.condition.text,
                icon: getConditionIcon(h.condition.code),
                precipChance: h.chance_of_rain || h.chance_of_snow || 0,
            })),
            daily: data.forecast.forecastday.map(d => ({
                date: d.date,
                day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
                high: Math.round(d.day.maxtemp_c),
                low: Math.round(d.day.mintemp_c),
                condition: d.day.condition.text,
                icon: getConditionIcon(d.day.condition.code),
                precipChance: d.day.daily_chance_of_rain || d.day.daily_chance_of_snow || 0,
            })),
        };

        res.status(200).json(formatResponse(true, `Weather for ${location} retrieved successfully`, weatherData));
    } catch (error) {
        console.error('Weather API Error:', error.message);
        // Fallback to mock data if API fails
        const location = req.query.location || 'Hyderabad';
        res.status(200).json(formatResponse(true, 'Weather data retrieved (Fallback)', generateMockWeather(location)));
    }
};

// Mock data generator for fallback
const generateMockWeather = (location) => {
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
