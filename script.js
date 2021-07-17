var searchButtonEl = document.querySelector("#custom-search-button");
var cityInputEl = document.querySelector("#city-input")

var currentWeatherTitleEl = document.querySelector("#current-weather-title");
var currentWeatherIconEl = document.querySelector("#current-weather-icon");
var currentDateEl = document.querySelector("#current-date");
var currentTempEl = document.querySelector("#current-temp");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentUVIEl = document.querySelector("#current-uvi");

var forecastDataElArray = document.querySelectorAll(".forecast-date");
var forecastIconElArray = document.querySelectorAll(".forecast-icon");
var forecastTempElArray = document.querySelectorAll(".forecast-temp");
var forecastWindElArray = document.querySelectorAll(".forecast-wind");
var forecastHumidityElArray = document.querySelectorAll(".forecast-humidity");

var currentDate = moment();

function init() {
    // Add event listener to search button
    searchButtonEl.addEventListener("click", handleSearch);
}

// Upon button click,
function handleSearch() {
    // Get user input
    var cityInput = cityInputEl.value.trim();

    // Render city name and current date to current weather card
    var currentWeatherTitle = cityInput + " (" + currentDate.format("M/D/YYYY") + ")";
    currentWeatherTitleEl.textContent = currentWeatherTitle;

    fetchLatLon(cityInput);
}

// Get latitude/longitude of city input
function fetchLatLon(cityInput) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=c8aa884e6f28d929f55e9ba1856815bd")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;

            fetchWeather(lat, lon);
        })
}

// Get weather data of latitude/longitude of city input
function fetchWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=c8aa884e6f28d929f55e9ba1856815bd")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Get current weather
            var currentWeather = {
                weatherIcon: "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png",
                temp: data.current.temp + " F",
                windSpeed: data.current.wind_speed + " MPH",
                humidity: data.current.humidity + "%",
                UVI: data.current.uvi,
            };

            var forecastArray = [];
            // Get 5-day forecast weather, push objects into forecastArray
            for (i = 0; i < 5; i++) {
                forecastArray.push(
                    {
                        weatherIcon: "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png",
                        temp: data.daily[i].temp.max + " F",
                        windSpeed: data.daily[i].wind_speed + " MPH",
                        humidity: data.daily[i].humidity + "%",
                    }
                );
            }

            renderCurrentWeather(currentWeather);
            renderForecast(forecastArray);
        })
}

// Render current weather to page
function renderCurrentWeather(currentWeather) {
    currentWeatherIconEl.setAttribute("src", currentWeather.weatherIcon);
    currentTempEl.textContent = currentWeather.temp;
    currentWindSpeedEl.textContent = currentWeather.windSpeed;
    currentHumidityEl.textContent = currentWeather.humidity;
    currentUVIEl.textContent = currentWeather.UVI;

    // Color code UVI
    if (currentWeather.UVI < 3) {
        currentUVIEl.setAttribute("class", "card-text btn btn-success");
    } else if (currentWeather.UVI > 3 && currentWeather.UVI < 5) {
        currentUVIEl.setAttribute("class", "card-text btn btn-warning");
    } else {
        currentUVIEl.setAttribute("class", "card-text btn btn-danger");
    }
}

// Render forecast to page
function renderForecast(forecastArray) {
    for (i = 0; i < forecastArray.length; i++) {
        // Render future dates
        var forecastDate = currentDate.add(1, "days");
        forecastDataElArray[i].textContent = forecastDate.format("M/D/YYYY");

        forecastIconElArray[i].setAttribute("src", forecastArray[i].weatherIcon);
        forecastTempElArray[i].textContent = forecastArray[i].temp;
        forecastWindElArray[i].textContent = forecastArray[i].windSpeed;
        forecastHumidityElArray[i].textContent = forecastArray[i].humidity;
    }
}

// Add current search to local storage
// Render cities from local storage to page
// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    // console.log(localStorage.getItem("City"));
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}

// Add event listener to city buttons

// Upon button click,
// Repeat search button function with that city's input

init();