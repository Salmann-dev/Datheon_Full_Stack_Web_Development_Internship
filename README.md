# Datheon Full Stack Web Development Internship

Submission for the **Datheon Full Stack Web Development Internship (Batch 01)**. This repository contains three completed tasks, each in its own folder with its own README, and each deployed live.

**Intern:** Muhammad Salman
**Program:** Full Stack Web Development Internship, Batch 01 (4 weeks)

## Tasks Completed

| # | Task | Tech | Live Demo | Code |
|---|------|------|-----------|------|
| 1 | **Personal Developer Portfolio & Project Showcase** | React, TypeScript, Node.js, Vercel serverless functions | [salman-dev-phi.vercel.app](https://salman-dev-phi.vercel.app/) | [`task-1-portfolio`](./task-1-portfolio) |
| 2 | **Dynamic Task Manager & Productivity Tracker (CRUD)** | HTML, CSS, JavaScript, localStorage | [salman-task-manager-app.vercel.app](https://salman-task-manager-app.vercel.app/) | [`task-2-task-manager`](./task-2-task-manager) |
| 3 | **Real-Time Weather Forecast & Climate Telemetry App** | HTML, CSS, JavaScript, Open-Meteo REST API | [salman-weather-app.vercel.app](https://salman-weather-app.vercel.app/) | [`task-3-weather-app`](./task-3-weather-app) |

## Project Summaries

### Task 1: Developer Portfolio
A portfolio styled like a VS Code workspace, with a file explorer, editor tabs and an interactive terminal. It includes About, Work Experience, Skills, Projects and a Contact form that sends messages through a serverless function. It showcases two projects: Copyforge and AI Resume Analyzer.

### Task 2: Task Manager
A task app with full CRUD: add, edit, delete and complete tasks. It supports priority levels, due dates with overdue highlighting, All/Active/Completed filters and a progress bar. Tasks are saved in the browser with `localStorage`, so they survive a refresh.

### Task 3: Weather App
A live weather dashboard. Search any city to see current temperature, conditions with icons, humidity, wind speed, atmospheric pressure and a 5-day forecast. The background changes with the weather and the time of day. It handles loading states and errors such as unknown cities, network failures and timeouts.

## Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── README.md
├── task-1-portfolio/
├── task-2-task-manager/
└── task-3-weather-app/
```

Each task folder has its own README with features, tech used and project details.

## How to Run

### Task 1: Portfolio

```bash
cd task-1-portfolio
npm install
cp .env.example .env    # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Task 2 and Task 3

Both are plain HTML, CSS and JavaScript, so no install is needed. Open the `index.html` file in a browser, or use the VS Code Live Server extension.

Task 3 needs an internet connection, since it calls the Open-Meteo API. No API key is required.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), React, TypeScript
- **Backend:** Node.js, Vercel serverless functions
- **APIs:** Open-Meteo (geocoding and forecast)
- **Storage:** Browser `localStorage`
- **Deployment:** Vercel
- **Tools:** Git, GitHub, VS Code

## Contact

- GitHub: [@Salmann-dev](https://github.com/Salmann-dev)
- LinkedIn: [Muhammad Salman](https://www.linkedin.com/in/muhammad-salman-09693a289/)
- Email: Salman.connect001@gmail.com
