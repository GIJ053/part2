import { useState, useEffect } from 'react';
import axios from 'axios';

const Countries = ({ countriesToShow, handleFilterChange }) => {
  if (countriesToShow.length >= 10) {
    return <div>Too many results, be more specific.</div>
  }
  else if (countriesToShow.length === 1) {
    return <CountryPage country={countriesToShow[0]} />
  }
  else {
    return (
      countriesToShow.map(country =>
        <div key={country.name.common} >
          {country.name.common} <button value={country.name.common} onClick={handleFilterChange}>Show</button>
        </div>
      )
    )
  }
}

const CountryPage = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather?lat='
        + country.capitalInfo.latlng[0] +
        '&lon=' + country.capitalInfo.latlng[1] +
        '&appid=' + process.env.REACT_APP_API_KEY +
        '&units=imperial')
      .then(response => {
        setWeather(response.data);
      })
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>

      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt='country flag' width='150' />

      <h1>Weather in {country.capital}</h1>
      <div>Temperature: {weather ? weather.main.temp : ''} Farenheit</div>
      <img
        src={weather ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ''}
        alt={weather ? weather.weather[0].description : ''}
      />
      <div>Wind: {weather ? weather.wind.speed : ''} m/s</div>
    </div>
  )
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('');
  const [showCountries, setShowCountries] = useState(false);


  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value);
    setShowCountries(event.target.value !== '');
  }

  const countriesToShow = countries.filter(country => country.name.common.toUpperCase().indexOf(currentFilter.toUpperCase()) >= 0);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all?fields=name,capital,area,flags,languages,capitalInfo')
      .then(response => {
        setCountries(response.data);
      })
  }, []);

  return (
    <div>
      filter countries <input value={currentFilter} onChange={handleFilterChange} />

      <Countries countriesToShow={countriesToShow} handleFilterChange={handleFilterChange} />
    </div>
  );
}

export default App;
