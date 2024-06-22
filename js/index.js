let searchInput = document.getElementById("find-location-input");
let container = document.querySelector(".weather-grid");
let findSearchBtn = document.querySelector(".find-location-btn");
let baseUrl = "http://api.weatherapi.com/v1";
let forecastWeatherRoute = "/forecast.json";
let apiKey = "f2717f8a00f143848ff151914242206";
let forecastRange = 3;

async function getCityWeather(input) {
  try {
    let response = await fetch(
      `${baseUrl}${forecastWeatherRoute}?key=${apiKey}&q=${input}&days=${forecastRange}`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function displayWeather(weatherData) {
  let currentDate = new Date(weatherData.current.last_updated);
  let currentDayName = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  let currentDayDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });

  let currentDay = `  
    <div class="col-lg-4 weather-item">
      <div>
        <div class="current-day d-flex justify-content-between align-items-center text-white-50 p-2">
          <span class="day">${currentDayName}</span>
          <span class="day-month">${currentDayDate}</span>
        </div>
        <div class="weather-details p-3 py-5">
          <span class="city-name">${weatherData.location.name}</span>
          <div class="current-temprature">${weatherData.current.temp_c}<sup>o</sup>C</div>
          <img src="${weatherData.current.condition.icon}" alt="" />
          <h6 class="weather-state">${weatherData.current.condition.text}</h6>
          <div class="weather-description">
            <span><img src="./images/icon-umberella.png" alt="" /> ${weatherData.current.humidity} %</span>
            <span><img src="./images/icon-wind.png" alt="" /> ${weatherData.current.wind_kph} km/h</span>
            <span><img src="./images/icon-compass.png" alt="" /> ${weatherData.current.wind_dir}</span>
          </div>
        </div>
      </div>
    </div>`;

  let comingDays = weatherData.forecast.forecastday
    .map((day, index) => {
      if (index !== 0) {
        let forecastDate = new Date(day.date);
        let forecastDayName = forecastDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        return `   
        <div class="col-lg-4 weather-item">
          <div>
            <div class="day text-center p-2">
              <span class="day">${forecastDayName}</span>
            </div>
            <div class="weather-details text-center p-3 py-5">
              <img src="${day.day.condition.icon}" alt="" />
              <div class="temprature mt-4">${day.day.maxtemp_c}<sup>o</sup>C</div>
              <div class="min-temprature">${day.day.mintemp_c}<sup>o</sup>C</div>
              <h6 class="weather-state mt-4">${day.day.condition.text}</h6>
            </div>
          </div>
        </div>`;
      }
    })
    .join("");

  container.innerHTML = currentDay + comingDays;
}

async function fetchWeatherForCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let weatherData = await getCityWeather(`${latitude},${longitude}`);
        displayWeather(weatherData);
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    console.log("Geolocation is permitted.");
  }
}

searchInput.addEventListener("input", async (event) => {
  if (event.target.value.length > 2) {
    let weatherData = await getCityWeather(event.target.value);
    displayWeather(weatherData);
  }
});
findSearchBtn.addEventListener("click", async () => {
  if (searchInput.value.length > 2) {
    let weatherData = await getCityWeather(searchInput.value);
    displayWeather(weatherData);
  }
});

window.onload = fetchWeatherForCurrentLocation;
