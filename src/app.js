import { useState, useEffect } from 'react';

function App() {

  const tempDiff = 273.15;
  const [location, setLocation] = useState({ city: 'Krusevac', coords: { lat: 43.58, lon: 21.33389 } });
  const [isCelsius, setIsCelsius] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = '89301df2be1051593bf04d4e672d3729';
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ ...location, coords: { lat: pos.coords.latitude, lon: pos.coords.longitude } })
      })
    } else {
      alert('Location is not supported by your browser');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchWeatherForecast() {
      const lat = location.coords.lat;
      const lon = location.coords.lon;
      const result = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      const data = await result.json();
      setWeatherData(data);
    }
    fetchWeatherForecast();
  }, [location]);

  const kToCelsius = temp => {
    return Math.round(temp - tempDiff);
  }

  const kToFahrenheit = temp => {
    return Math.round((temp - tempDiff) * 1.8 + 32);
  }

  const DateInfo = () => {
    return <div>Today • {new Date().toDateString()}</div>
  }

  const Temperature = () => {
    const currentTemp = weatherData.current.temp;
    return (
      <div className="temperature">
        {isCelsius ? `${kToCelsius(currentTemp)}°C` : `${kToFahrenheit(currentTemp)}°F`}
      </div>
    )
  }

  const WeatherType = () => {
    return <div className="weathertype">{weatherData.current.weather[0].main}</div>
  }

  const WeatherIcon = () => {
    return <img src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt="" />
  }

  return weatherData ? (
    <div className="container">
      <div className="weather-container">
        <div className="current">
          <div className="current-left">
            <div className="location">{location.city}</div>
            <DateInfo />
            <WeatherIcon />
            <WeatherType />
          </div>
          <div className="current-right">
            <Temperature />
            <div className="button-container">
              <button onClick={() => setIsCelsius(false)}>°F</button>
              <button onClick={() => setIsCelsius(true)}>°C</button>
            </div>
          </div>
        </div>
        <div className="bydate">
        </div>
      </div>
    </div>
  ) : null;
}

export default App;
