import config from "./config.js";

// DOM Elements
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const location = document.getElementById("location");
const temp1 = document.getElementById("temp1");
const temp2 = document.getElementById("temp2");
const temp3 = document.getElementById("temp3");
const day1 = document.getElementById("day1");
const day2 = document.getElementById("day2");
const day3 = document.getElementById("day3");
const date1 = document.getElementById("date1");
const icon1 = document.getElementById("icon1");
const icon2 = document.getElementById("icon2");
const icon3 = document.getElementById("icon3");

// Get current date and next two days
function getDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  return [today, tomorrow, dayAfterTomorrow];
}

// Format date
function formatDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    day: days[date.getDay()],
    date: `${date.getDate()} ${months[date.getMonth()]}`,
  };
}

// Update dates in the cards
function updateDates() {
  const dates = getDates();
  const formattedDates = dates.map(formatDate);

  day1.textContent = formattedDates[0].day;
  day2.textContent = formattedDates[1].day;
  day3.textContent = formattedDates[2].day;
  date1.textContent = formattedDates[0].date;
}

// Get weather icon based on temperature and weather condition
function getWeatherIcon(temp, weatherCondition) {
  if (weatherCondition.includes("rain")) return "fa-cloud-rain";
  if (weatherCondition.includes("snow")) return "fa-snowflake";
  if (weatherCondition.includes("thunder")) return "fa-bolt";
  if (weatherCondition.includes("cloud")) return "fa-cloud";
  if (temp < 10) return "fa-snowflake";
  if (temp < 20) return "fa-cloud";
  if (temp < 30) return "fa-cloud-sun";
  return "fa-sun";
}

async function getWeatherData(city) {
  try {
    location.textContent = "Loading...";
    temp1.textContent = "--°C";
    temp2.textContent = "--°C";
    temp3.textContent = "--°C";
    icon1.className = "fas fa-cloud";
    icon2.className = "fas fa-cloud";
    icon3.className = "fas fa-cloud";

    const response = await fetch(
      `${config.BASE_URL}${config.ENDPOINTS.FORECAST}?key=${config.API_KEY}&q=${city}&days=3&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Update UI with the data
    location.textContent = `${data.location.name}, ${data.location.country}`;

    // Update first card
    temp1.textContent = `${Math.round(data.current.temp_c)}°C`;
    icon1.className = `fas ${getWeatherIcon(
      data.current.temp_c,
      data.current.condition.text.toLowerCase()
    )}`;

    // Update second card
    temp2.textContent = `${Math.round(
      data.forecast.forecastday[1].day.avgtemp_c
    )}°C`;
    icon2.className = `fas ${getWeatherIcon(
      data.forecast.forecastday[1].day.avgtemp_c,
      data.forecast.forecastday[1].day.condition.text.toLowerCase()
    )}`;

    // Update third card
    temp3.textContent = `${Math.round(
      data.forecast.forecastday[2].day.avgtemp_c
    )}°C`;
    icon3.className = `fas ${getWeatherIcon(
      data.forecast.forecastday[2].day.avgtemp_c,
      data.forecast.forecastday[2].day.condition.text.toLowerCase()
    )}`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    location.textContent = "Error: " + error.message;
    temp1.textContent = "--°C";
    temp2.textContent = "--°C";
    temp3.textContent = "--°C";
    icon1.className = "fas fa-cloud";
    icon2.className = "fas fa-cloud";
    icon3.className = "fas fa-cloud";
  }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = locationInput.value.trim();
  if (city) {
    getWeatherData(city);
  } else {
    alert("Please enter a city name");
  }
});

locationInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

updateDates();
