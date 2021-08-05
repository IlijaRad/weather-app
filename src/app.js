import { useState, useEffect } from 'react';

function App() {

  const tempDiff = 273.15;
  const [location, setLocation] = useState({ city: 'Krusevac', coords: { lat: 43.58, lon: 21.33389 } });
  const [isCelsius, setIsCelsius] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [byDateHourly, setByDateHourly] = useState(true);

  const API_KEY = '89301df2be1051593bf04d4e672d3729';
  const API_KEY_2 = 'pk.1c68a0c13f86af3c08c005f9468d6644';

  useEffect(() => {
    if (navigator.geolocation) {
      async function getCity(lat, lon){
        const result = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${API_KEY_2}&lat=${lat}&lon=${lon}&format=json`);
        const data = await result.json();
        return data.address.city;
      }

      navigator.geolocation.getCurrentPosition(async ({coords: {latitude : lat, longitude: lon}}) => {
        const city = await getCity(lat, lon);
        setLocation({ city, coords: { lat, lon } })
      })
    } else {
      alert('Location is not supported by your browser');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function getWeatherForecast() {
      const {lat, lon} = location.coords;
      const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      const data = await result.json();
      setWeatherData(data);
    }

    getWeatherForecast();
  }, [location]);

  const kToCelsius = temp => {
    return Math.round(temp - tempDiff);
  }

  const kToFahrenheit = temp => {
    return Math.round((temp - tempDiff) * 1.8 + 32);
  }

  const DateInfo = () => {
    return <div className="current-left__date">{new Date().toLocaleDateString('en-US', {month: 'long', day:'numeric', year: 'numeric'})}</div>
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
    return <div className="current-left__weathertype">{weatherData.current.weather[0].main}</div>
  }

  const WeatherIcon = () => {
    return <img className="weather-icon" src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt="" />
  }

  const ByHourBodyItem = ({date, icon, temp}) => {
    return (
      <div className="bydate__body__item">
        <div className="bydate__body__item__time">{epochToDate(date).toLocaleString('en-US', { hour: 'numeric', hour12: true })}</div>
        <img className="bydate__body__item__icon" src={`http://openweathermap.org/img/wn/${icon}.png`} alt="" />
        <div className="bydate__body__item__temp">{isCelsius ? `${kToCelsius(temp)}°C` : `${kToFahrenheit(temp)}°F`}</div>
      </div>
    )
  }

  const ByDayBodyItem = ({date, min, max, icon}) => {
    return (
      <div className="bydate__body__item">
        <div className="bydate__body__item__date">{epochToDate(date).toLocaleString('en-US', {weekday: 'short'})}</div>
        <img className="bydate__body__item__icon" src={`http://openweathermap.org/img/wn/${icon}.png`} alt="" />
        <div className="bydate__body__item__max">{isCelsius ? `${kToCelsius(max)}°C` : `${kToFahrenheit(max)}°F`}</div>
        <div className="bydate__body__item__min">{isCelsius ? `${kToCelsius(min)}°C` : `${kToFahrenheit(min)}°F`}</div>
      </div>
    )
  }

  const epochToDate = epoch => {
    if (epoch < 10000000000) epoch *= 1000;
    epoch = epoch + (new Date().getTimezoneOffset() * -1);        
    return new Date(epoch);
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
          <div className="bydate__header">
            {byDateHourly ? (
              <>
                <div className="bydate__header__item active" onClick={() => setByDateHourly(true)}>Hourly</div>
                <div className="bydate__header__item" onClick={() => setByDateHourly(false)}>Daily</div>
              </>
            ) : (
              <>
                <div className="bydate__header__item" onClick={() => setByDateHourly(true)}>Hourly</div>
                <div className="bydate__header__item active" onClick={() => setByDateHourly(false)}>Daily</div>
              </>
            )}
          </div>
          <div className="bydate__body">
          {byDateHourly ? weatherData.hourly.slice(0, 5).map((item, ix) => (
            <ByHourBodyItem key={ix} date={item.dt} icon={item.weather[0].icon} temp={item.temp} />
          )) : (
            weatherData.daily.slice(0, 5).map((item, ix) => (
              <ByDayBodyItem key={ix} date={item.dt} min={item.temp.min} icon={item.weather[0].icon} max={item.temp.max} />
          )))}

          </div>
        </div>
      </div>
    </div>
  ) : null;
}            

export default App;