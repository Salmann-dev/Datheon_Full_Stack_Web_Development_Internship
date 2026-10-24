# Task 3: Real-Time Weather Forecast & Climate Telemetry App

A weather app that fetches live data from third-party REST APIs, handles errors, and updates the UI dynamically. Built with plain HTML, CSS and JavaScript.

## Features

- Search any city in the world
- Current conditions with a weather icon: temperature, feels-like, humidity, wind speed, atmospheric pressure, cloud cover and rain chance
- Background gradient that changes with the weather (sunny, cloudy, rain, storm, snow) and switches to a night theme after dark
- 5-day forecast with daily highs, lows and rain chance
- Switch between °C/°F (and km/h/mph), saved between visits
- "Use my location" button with the browser's geolocation
- Loading indicator while data is fetched
- Error handling for empty input, city not found, network failure, request timeout and denied location permission
- Remembers the last searched city
- Responsive layout for phones and desktops

## APIs Used

Both are provided by [Open-Meteo](https://open-meteo.com/), which is free and needs no API key:

- **Geocoding API** to turn a city name into coordinates
- **Forecast API** for current weather and the daily forecast

I chose Open-Meteo over OpenWeatherMap because it needs no API key. That means no secret can leak from a client-side app, and anyone can run the project right away.

## Tech Used

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+, `async/await`, `fetch`, `AbortController`)
- Browser `localStorage` and Geolocation API

## How to Run

No install and no API key are needed.

1. Open `index.html` in a browser, or
2. Use the VS Code "Live Server" extension.

## Project Structure

```
task-3-weather-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Live Demo

Add your deployed link here after publishing.
