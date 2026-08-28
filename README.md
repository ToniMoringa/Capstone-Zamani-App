# ZAMANI – Kenya's Time Capsule

A retro TV-themed full-stack application that lets users explore global and Kenyan history by selecting any date. Features a custom Flask + PostgreSQL backend, curated Kenyan milestones, and a polished CRT broadcast aesthetic. Built as Phase 2 of a 3-phase capstone project.

## Live Demo

**[View Production Frontend on Vercel](https://capstone-zamani-app.vercel.app/)**  
*Note: Backend runs locally at http://localhost:5000 for development. Render deployment link available upon request.*

## Setup Instructions

### Prerequisites

- Node.js v18+
- Python 3.10+
- PostgreSQL 14+
- pnpm (recommended), npm, or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/ToniMoringa/Capstone-Zamani-App.git
cd Capstone-Zamani-App

# 2. Setup Backend
cd server
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
createdb zamani_db  # Or use pgAdmin to create database
python -m server.seed  # Seeds PostgreSQL with Kenyan historical data
python -m server.app  # Runs on http://localhost:5000

# 3. Setup Frontend (in new terminal)
cd ../client
pnpm install  # or npm install
pnpm dev      # Runs on http://localhost:5173

```

## API Endpoints & Resources

This application uses a custom Flask REST API replacing public Wikipedia/NASA endpoints from Phase 1:

|Method|Endpoint|Purpose|
|---|---|---|
|GET|`/api/v1/capsules/`|List all capsules (filter by ?date=YYYY-MM-DD)|
|POST|`/api/v1/capsules/`|Create new capsule|
|GET|`/api/v1/capsules/:id`|Get single capsule|
|PUT|`/api/v1/capsules/:id`|Update capsule|
|DELETE|`/api/v1/capsules/:id`|Delete capsule|
|GET|`/api/v1/tags/`|List all tags|
|POST|`/api/v1/tags/`|Create new tag|

**Relational Resources:** Capsules ↔ Tags (Many-to-Many via association table)

## Known Issues & Scope Notes

- **Authentication:** Phase 2 pitch, user authentication is scoped for Phase 3. The `user_id` column exists in the Capsules table as a foreign key placeholder. Current MVP focuses on backend infrastructure, relational data modeling, and full CRUD operations without user ownership.
- **Kenya Archive Coverage:** Phase 2 MVP includes 10+ verified Kenyan historical milestones (Independence Day, Madaraka Day, Gen Z Protests, etc.). Dates without seeded records display an honest "No Signal Detected" state rather than falling back to global Wikipedia data. This preserves the integrity of the Kenya Archive as a curated collection. Expanded coverage and user-contributed entries are planned for Phase 3 alongside authentication.
- **NASA APOD Rate Limiting:** The NASA API relies on a public DEMO_KEY with strict hourly limits. Graceful error handling displays fallback UI when rate limits are exceeded.
- **CRT Overlay:** SVG physics-based warp (`<feTurbulence>`) uses `pointer-events: none` to prevent scanline layer from blocking mouse interactions.

## Project Roadmap

-  ꪜ**Phase 1:** React frontend + external APIs (Wikipedia, NASA)
- ꪜ **Phase 2:** Flask backend + PostgreSQL database + Full CRUD + Retro TV UI polish _(Current)_
- ⌛︎ **Phase 3:** JWT authentication + user-owned capsules + personal archive dashboard

## Tech Stack

**Backend:** Flask, SQLAlchemy, PostgreSQL, Flask-Migrate, Marshmallow  
**Frontend:** React 18, React Router v6, Axios, Context API  
**Styling:** Custom CSS with CRT scanlines, film grain, fisheye warp  
**Tools:** Postman (API testing), Git/GitHub, Vercel (frontend hosting)


