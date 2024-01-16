import axios from 'axios'
import { useEffect, useState } from 'react'


const Languages = ( {languages} ) => {
  return (
    <ul>
      {Object.values(languages).map((language, index) => 
      <li key={index}>{language}</li>
      )}
    </ul>
  )
}

const Weather = ( {country} ) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHERKEY
  
  
  
  useEffect(() => {
    axios
    .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&limit=1&appid=${apiKey}`)
    .then(response => {
      const lat = response.data[0].lat
      const lon = response.data[0].lon

     return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    })
      .then(response => {
        setWeather(response.data)
    })
  }, [])
  
  if (!weather) {
    return <div>Loading weather information...</div>
  }

  const temp = (weather.main.temp)
  const weatherIcon = (`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`)
   
  return (
    <div>
      <div>temperature {temp.toFixed(2)} Celsius </div>
      <img src={weatherIcon} alt="image of the current weather" style={{width: '120px', height: 'auto'}}/>
      <div>{`wind ${weather.wind.speed}m/s`}</div>
    </div>
   )
}

const Country = ({ country, oneCountry}) => {
  const [infoState, setInfoState] = useState(false)
  const toggleShowInfo = () => {
    setInfoState(!infoState)
  }

  if (oneCountry || infoState){
    
    return(
    <div>
      <h1>{country.name.common}</h1>
      <br />
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <Languages languages={country.languages}/>
      <img src={country.flags.png} alt={country.flags.alt} style={{width: '150px', height: 'auto'}} />
      <h3>Weather in {country.capital}</h3>
      <Weather country={country}/>
      {! oneCountry && <button onClick={toggleShowInfo}>hide</button>}
    </div>
    )}

  return (
  <div>
    {country.name.common}
    <button onClick={toggleShowInfo}>show</button>
  </div>
 )}

const Countries = ({ countriesToShow }) => {
  const oneCountry = (countriesToShow.length === 1)
  if (countriesToShow.length > 10){
    return(
    <div>
      Too many matches, specify another filter
    </div>
    )}
    
    return (
      <div>
      {countriesToShow.map(country => 
        <Country 
          key={country.name.common}
          country={country}
          oneCountry={oneCountry}
        />
        )} 
      </div>
    )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    
    if (searchString){
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
      
    }
  }, [searchString  ])

  const countriesToShow = searchString
  ? countries.filter(country => country.name.common.toLowerCase().includes(searchString.toLowerCase()))
  : countries

  const handleSearchString = (event) => {
    setSearchString(event.target.value)
  }
  
  return (
    <div>
        find countries <input value={searchString} onChange={handleSearchString} />
        <Countries countriesToShow={countriesToShow}/>
    </div>
  )
}

export default App
