# ZAMANI – Kenya's Time Capsule

A retro TV-themed full-stack application that lets users explore global and Kenyan history by selecting any date. Features a custom Flask + PostgreSQL backend, JWT authentication, user-owned personal archives, and a polished CRT broadcast aesthetic. Built as a 3-phase capstone project.

## Live Demo

**[View Production Frontend on Vercel](https://capstone-zamani-app.vercel.app/)**  
**Backend API:** [https://zamani-api.onrender.com](https://zamani-api.onrender.com) *(Render free tier may sleep; first request takes ~30s)*

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
python fix_db.py       # Creates Phase 3 auth tables
python migrate_auth.py # Adds user_id column to capsules
python seed.py         # Seeds PostgreSQL with Kenyan historical data
python app.py          # Runs on http://localhost:5000

# 3. Setup Frontend (in new terminal)
cd ../client
pnpm install  # or npm install
pnpm dev      # Runs on http://localhost:5173
```


### Environment Variables
Create a `.env` file in the `server/` directory:
```
VITE_API_URL=http://localhost:5000/api/v1
```

## API Endpoints & Resources

|Method|Endpoint|Purpose|Auth Required|
|---|---|---|---|
|GET|`/api/v1/capsules/`|List all public/historical capsules|No|
|GET|`/api/v1/capsules/mine`|List user's personal capsules|Yes|
|POST|`/api/v1/capsules/`|Create personal capsule|Yes|
|PUT|`/api/v1/capsules/:id`|Update own capsule|Yes|
|DELETE|`/api/v1/capsules/:id`|Delete own capsule|Yes|
|GET|`/api/v1/tags/`|List all tags|No|
|POST|`/api/v1/auth/register`|Register new user|No|
|POST|`/api/v1/auth/login`|Login user|No|
|POST|`/api/v1/auth/logout`|Logout (invalidate token)|Yes|
|GET|`/api/v1/auth/me`|Get current user profile|Yes|
|PUT|`/api/v1/auth/me`|Update username|Yes|

**Relational Resources:** Capsules ↔ Tags (Many-to-Many), Users ↔ Capsules (One-to-Many)

## Phase 3 Features

- **JWT Authentication:** Secure register/login/logout with token blocklisting.
- **User-Owned Data:** Users can only edit/delete their own personal capsules (403 Forbidden on unauthorized access).
- **Protected Routes:** `/saved`, `/profile` require authentication; redirect to home if logged out.
- **Profile & Help:** Dedicated pages for avatar upload (localStorage), username change, and user guide.
- **Mobile Responsive:** Floating Action Button (FAB) for new memories, optimized dropdown, tall archive frames on mobile.
- **High Contrast Mode:** Full accessibility support with CSS variable overrides.

## Tech Stack

**Backend:** Flask, SQLAlchemy, PostgreSQL, Flask-JWT-Extended, Flask-Bcrypt  
**Frontend:** React 19, React Router v7, Axios, Context API  
**Styling:** Custom CSS with CRT scanlines, Kodachrome palette, high-contrast mode  
**Deployment:** Vercel (Frontend), Render (Backend + PostgreSQL)

## Project Roadmap

- ✅ **Phase 1:** React frontend + external APIs (Wikipedia, NASA)
- ✅ **Phase 2:** Flask backend + PostgreSQL database + Full CRUD + Retro TV UI polish
- ✅ **Phase 3:** JWT authentication + user-owned capsules + personal archive dashboard _(Current)_