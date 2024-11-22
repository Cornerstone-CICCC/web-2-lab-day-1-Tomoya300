const search = document.getElementById("search")
const searchBtn = document.getElementById("search_btn")
const temperature = document.getElementById("temperature")
const country = document.getElementById("country")
const timezone = document.getElementById("timezone")
const population = document.getElementById("population")
const forecastMin = document.getElementById("forecast_min")
const forecastMax = document.getElementById("forecast_max")
const searchResult = document.getElementById("search_result")
const nameOfCity = document.getElementById("city_name")
const cityContainer = document.getElementById("city_container")
const flexible = document.querySelectorAll(".flexible")

searchBtn.addEventListener("click", () => {
    const input = search.value

    const city = async(cityName) => {
        try {
            const resCity = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`)
            const cityData = await resCity.json()
            const cityLat = cityData.results[0].latitude
            const cityLong = cityData.results[0].longitude
            const countryName = cityData.results[0].country
            const cityTimezone = cityData.results[0].timezone
            const cityPop = cityData.results[0].population
            country.textContent = countryName
            timezone.textContent = cityTimezone
            population.textContent = cityPop
            nameOfCity.textContent = cityData.results[0].name
            return {cityLat, cityLong}
        } catch(errCity) {
            console.error(errCity)
        }
    }
    
    const weather = async(latitude, longitude) => {
        try {
            const resWeather = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
            const weatherData = await resWeather.json()
            const cityTemp = weatherData.current.temperature_2m
            const minTemp = weatherData.daily.temperature_2m_min
            const maxTemp = weatherData.daily.temperature_2m_max
            const cityTime = weatherData.current.time
            const newTime = new Date(cityTime)
            const crrHour = newTime.getHours()
            temperature.textContent = cityTemp
            forecastMin.textContent = minTemp
            forecastMax.textContent = maxTemp
            return crrHour
        } catch(errWeather) {
            console.error(errWeather)
        }
    }
    
    const getLocation = async() => {
        try {
            const cityLoc = await city(input) 
            const setHour = await weather(cityLoc.cityLat, cityLoc.cityLong)
            searchResult.classList.remove("hidden")
            if (setHour >= 18 || setHour <= 6) {
                cityContainer.classList.add("night")
                cityContainer.classList.remove("day")
                flexible.forEach(element => {
                    element.classList.add("black")
                })
            } else {
                cityContainer.classList.add("day")
                cityContainer.classList.remove("night")
                flexible.forEach(element => {
                    element.classList.remove("black")
                })
            }
        } catch(errLoc) {
            console.error(errLoc)
        }
        
    }
    
    getLocation()
})