# Task 1: Personal Developer Portfolio & Project Showcase

An interactive developer portfolio designed to look and feel like a VS Code workspace. Visitors browse my work through a file explorer, tabs and a working terminal.

**Live demo:** https://salman-dev-phi.vercel.app/

## Features

- VS Code-style interface with a file explorer, editor tabs, activity bar and status bar
- Sections for About Me, Work Experience, Skills, Projects and Contact
- Interactive terminal that runs `help`, `about`, `skills`, `projects`, `contact` and `clear`, with command history on the arrow keys
- Project showcase with live demos and source code links
- Contact form that sends messages through a serverless function
- Responsive layout for desktop and mobile
- SEO metadata and an Open Graph preview image for link sharing

## Featured Projects

| Project | Description | Links |
|---|---|---|
| **Copyforge** | AI copywriting tool that generates product descriptions and social posts in a custom brand voice, using the Google Gemini API through a secure serverless proxy | [Live](https://copyforge.vercel.app/) · [Source](https://github.com/Salmann-dev/Copyforge) |
| **AI Resume Analyzer** | Scores a resume (PDF or Word) against an optional job description and returns strengths, gaps and missing keywords | [Live](https://ai-resume-analyzer-vki0.onrender.com/) · [Source](https://github.com/Salmann-dev/ai-resume-analyzer) |

## Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- React and TypeScript components
- Node.js server
- Vercel serverless functions
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Run locally

```bash
# 1. Go to the project folder
cd task-1-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# then open .env and fill in the values

# 4. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

> The terminal may print `0.0.0.0:3000`. Use `localhost:3000` in the browser.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. The `.env` file is ignored by Git, so secrets are never committed. The contact form needs these values to send messages. The rest of the site works without them.

## Project Structure

```
task-1-portfolio/
├── api/
│   └── contact.js          # Serverless function for the contact form
├── public/                 # Static assets
├── src/
│   └── app/
│       ├── components/     # ActivityBar, Terminal
│       ├── about-me.tsx
│       ├── work-experience.tsx
│       ├── skills.tsx
│       ├── copyforge.tsx
│       ├── contact-me.tsx
│       ├── layout.tsx
│       └── page.tsx
├── server.js               # Local server
├── vercel.json             # Deployment config
├── .env.example            # Environment variable template
└── package.json
```

## Author

**Muhammad Salman**
BS Information Technology, University of Balochistan

- GitHub: [@Salmann-dev](https://github.com/Salmann-dev)
- LinkedIn: [Muhammad Salman](https://www.linkedin.com/in/muhammad-salman-09693a289/)
- Email: Salman.connect001@gmail.com
