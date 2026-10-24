const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const CITY_KEY = "weather-app.last-city";
const UNIT_KEY = "weather-app.unit";
const DEFAULT_CITY = "Quetta";
const REQUEST_TIMEOUT_MS = 10000;

// WMO weather codes -> [description, emoji]
const WEATHER_CODES = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Freezing fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  56: ["Freezing drizzle", "🌧️"],
  57: ["Heavy freezing drizzle", "🌧️"],
  61: ["Light rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"],
  67: ["Heavy freezing rain", "🌧️"],
  71: ["Light snow", "🌨️"],
  73: ["Snow", "🌨️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "❄️"],
  80: ["Light showers", "🌦️"],
  81: ["Showers", "🌧️"],
  82: ["Violent showers", "⛈️"],
  85: ["Snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Severe thunderstorm with hail", "⛈️"],
};

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locateBtn = document.getElementById("locate-btn");
const statusBox = document.getElementById("status");
const weatherSection = document.getElementById("weather");
const unitButtons = document.querySelectorAll(".unit");

let unit = loadSetting(UNIT_KEY, "c");
let lastResult = null; // { place, data }

/* ---------- Storage helpers ---------- */
function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error("Could not save setting:", err);
  }
}

/* ---------- Networking ---------- */
class AppError extends Error {}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new AppError(`The weather service returned an error (${response.status}). Please try again.`);
    }
    return await response.json();
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === "AbortError") {
      throw new AppError("The request took too long. Please try again.");
    }
    throw new AppError("Network problem. Check your internet connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}

async function findCity(name) {
  const url = `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const data = await fetchJson(url);
  if (!data.results || data.results.length === 0) {
    throw new AppError(`City "${name}" was not found. Check the spelling and try again.`);
  }
  const r = data.results[0];
  return {
    name: r.name,
    region: r.admin1 || "",
    country: r.country || "",
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

async function getForecast(place) {
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,cloud_cover,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "5",
  });
  return fetchJson(`${FORECAST_URL}?${params}`);
}

/* ---------- UI state ---------- */
function showLoading(message = "Loading weather data...") {
  statusBox.hidden = false;
  statusBox.className = "status";
  statusBox.innerHTML = '<div class="spinner"></div><span></span>';
  statusBox.querySelector("span").textContent = message;
  weatherSection.hidden = true;
}

function showError(message) {
  statusBox.hidden = false;
  statusBox.className = "status error";
  statusBox.textContent = `⚠️ ${message}`;
  weatherSection.hidden = true;
}

function clearStatus() {
  statusBox.hidden = true;
  statusBox.textContent = "";
}

/* ---------- Formatting ---------- */
function describe(code) {
  return WEATHER_CODES[code] || ["Unknown", "❔"];
}

function temp(celsius) {
  const value = unit === "c" ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(value)}°${unit.toUpperCase()}`;
}

function windSpeed(kmh) {
  return unit === "c" ? `${Math.round(kmh)} km/h` : `${Math.round(kmh * 0.621371)} mph`;
}

// Pick a background theme from the weather code and day/night flag
function themeFor(code, isDay) {
  if (!isDay) return "night";
  if (code >= 95) return "storm";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code === 3 || code === 45 || code === 48) return "cloudy";
  return "sunny";
}

function dayName(dateStr, index) {
  if (index === 0) return "Today";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });
}

/* ---------- Rendering ---------- */
function render() {
  if (!lastResult) return;
  const { place, data } = lastResult;
  const cur = data.current;
  const [desc, icon] = describe(cur.weather_code);

  const label = [place.name, place.region, place.country].filter(Boolean).join(", ");
  document.getElementById("place-name").textContent = label;
  document.getElementById("current-date").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  document.getElementById("current-icon").textContent = icon;
  document.getElementById("current-temp").textContent = temp(cur.temperature_2m);
  document.getElementById("current-desc").textContent = desc;
  document.getElementById("stat-feels").textContent = temp(cur.apparent_temperature);
  document.getElementById("stat-humidity").textContent = `${cur.relative_humidity_2m}%`;
  document.getElementById("stat-wind").textContent = windSpeed(cur.wind_speed_10m);
  document.getElementById("stat-rain").textContent = `${data.daily.precipitation_probability_max[0] ?? 0}%`;
  document.getElementById("stat-pressure").textContent = `${Math.round(cur.pressure_msl)} hPa`;
  document.getElementById("stat-clouds").textContent = `${cur.cloud_cover}%`;
  document.body.dataset.theme = themeFor(cur.weather_code, cur.is_day === 1);

  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";
  data.daily.time.forEach((date, i) => {
    const [dayDesc, dayIcon] = describe(data.daily.weather_code[i]);
    const card = document.createElement("div");
    card.className = "day";
    card.innerHTML = `
      <div class="name"></div>
      <div class="day-icon" title="${dayDesc}">${dayIcon}</div>
      <div class="range"><strong>${temp(data.daily.temperature_2m_max[i])}</strong>
        <span class="low">${temp(data.daily.temperature_2m_min[i])}</span></div>
      <div class="rain">💧 ${data.daily.precipitation_probability_max[i] ?? 0}%</div>`;
    card.querySelector(".name").textContent = dayName(date, i);
    forecast.appendChild(card);
  });

  clearStatus();
  weatherSection.hidden = false;
}

/* ---------- Main flows ---------- */
async function loadCity(name) {
  showLoading(`Looking up ${name}...`);
  try {
    const place = await findCity(name);
    showLoading(`Getting weather for ${place.name}...`);
    const data = await getForecast(place);
    lastResult = { place, data };
    saveSetting(CITY_KEY, place.name);
    render();
  } catch (err) {
    showError(err instanceof AppError ? err.message : "Something went wrong. Please try again.");
    console.error(err);
  }
}

async function loadMyLocation() {
  if (!navigator.geolocation) {
    showError("Your browser does not support location access.");
    return;
  }
  showLoading("Finding your location...");
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const place = {
          name: "Your location",
          region: "",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        const data = await getForecast(place);
        lastResult = { place, data };
        render();
      } catch (err) {
        showError(err instanceof AppError ? err.message : "Something went wrong. Please try again.");
      }
    },
    (err) => {
      const reasons = {
        1: "Location permission was denied. Search for a city instead.",
        2: "Your location could not be determined.",
        3: "Finding your location took too long.",
      };
      showError(reasons[err.code] || "Could not get your location.");
    },
    { timeout: 10000 }
  );
}

/* ---------- Events ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = cityInput.value.trim();
  if (!name) {
    showError("Please enter a city name.");
    return;
  }
  loadCity(name);
});

locateBtn.addEventListener("click", loadMyLocation);

unitButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    unit = btn.dataset.unit;
    saveSetting(UNIT_KEY, unit);
    unitButtons.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  })
);

/* ---------- Init ---------- */
unitButtons.forEach((b) => b.classList.toggle("active", b.dataset.unit === unit));
loadCity(loadSetting(CITY_KEY, DEFAULT_CITY));
