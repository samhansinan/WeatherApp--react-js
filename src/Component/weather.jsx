import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

function Weather() {
  const [city, setCity] = useState('Colombo');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '98740f4ebc0d63bc0f8ba70090e5a091'; // Replace with your actual API key

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setError('');
  };

  const fetchWeather = async (cityName = city) => {
    if (!cityName) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = response.data;

      const currentDate = new Date();
      const time = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const date = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setWeatherData({
        location: data.name,
        region: data.sys.country,
        currentLocation: `${data.name}, ${data.sys.country}`,
        temperature: `${Math.round(data.main.temp)}°c`,
        condition: data.weather[0].main,
        humidity: `${data.main.humidity}%`,
        visibility: `${(data.visibility / 1000).toFixed(1)} km`,
        windSpeed: `${(data.wind.speed * 3.6).toFixed(1)} Km/h`,
        time: time,
        date: date
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Try another.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load Colombo weather data when component mounts
  useEffect(() => {
    fetchWeather('Colombo');
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="weather-container">
      <div className="left-panel">
        <div className="hero-content">
          <div className="location-info">
            <h1>{weatherData?.location || 'Colombo'}</h1>
            <span className="region">{weatherData?.region || 'LK'}</span>
          </div>
          <div className="time-info">
            <div className="time">{weatherData?.time || '00:00:00'}</div>
            <div className="date">{weatherData?.date || 'Monday, 1 January 2025'}</div>
          </div>
          <div className="temperature-display">
            <span className="temperature-value">
              {weatherData?.temperature?.split('°')[0] || '--'}
            </span>
            <span className="temperature-unit">°c</span>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="weather-info">
          <div className="condition">
            <div className="condition-icon">
              <div className="cloud-icon"></div>
              <div className="cloud-bar"></div>
            </div>
            <h2>{weatherData?.condition || 'Haze'}</h2>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search any city"
              value={city}
              onChange={handleCityChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button className="search-button" onClick={() => fetchWeather()} disabled={loading}>
              <div className="search-icon"></div>
            </button>
          </div>

          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="current-location">
            <span>{weatherData?.currentLocation || 'Colombo, LK'}</span>
            <div className="wave-icon"></div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weatherData?.humidity || '--'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{weatherData?.visibility || '--'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{weatherData?.windSpeed || '--'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;