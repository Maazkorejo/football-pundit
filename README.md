# ⚽ AI Pundit Rankings — FIFA World Cup 2026

A social football prediction platform where friends compete to be the best pundit during the FIFA World Cup 2026. Post hot takes, predictions, and match analyses — then let AI judge you.

🌐 **Live at:** [football-pundit.vercel.app](https://football-pundit.vercel.app)

---

## What It Does

- **Hot Takes** — Post bold opinions before or during any match
- **Predictions** — Predict the winner and scoreline before kick-off
- **Pre-match Analysis** — Write tactical breakdowns before matches start
- **AI Scoring** — After every match, Mistral AI automatically scores all submissions against the actual result and generates roasts for bad takes
- **Leaderboard** — Weekly and tournament-wide rankings updated after every match
- **Profile Cards** — See your stats, ratings, and roasts in one place

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Python + Flask |
| Database | Supabase (PostgreSQL) |
| AI Scoring | Mistral AI API |
| Football Data | API-Football |
| Scheduler | APScheduler |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## How the AI Scoring Works

1. User posts a hot take or analysis before/during a match
2. Match ends — admin updates result in Supabase
3. APScheduler detects the finished match every 5 minutes
4. Flask sends each take + actual match result to Mistral AI
5. Mistral scores it out of 10 and generates a roast if score ≤ 5
6. Scores update live on the feed and leaderboard

---

## Database Schema

Five tables: `users`, `matches`, `hot_takes`, `analyses`, `predictions`

All takes and analyses link to a user and a match via foreign keys. Leaderboard rankings are calculated dynamically from scores — no separate leaderboard table needed.

---

## Project Structure

football-pundit/
├── backend/
│   ├── app.py              # Flask entry point
│   ├── scheduler.py        # APScheduler + AI scoring pipeline
│   ├── config.py           # Environment variables
│   ├── routes/             # API endpoints
│   ├── services/           # Mistral AI, Football API, scoring logic
│   └── db/                 # Supabase client
├── frontend/
│   └── src/
│       ├── pages/          # Onboarding, MatchFeed, Leaderboard, Profile
│       ├── components/     # Navbar
│       └── api/            # Axios API calls
└── schema.sql              # Database schema

---

## Running Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Add your keys to .env
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

SUPABASE_URL=
SUPABASE_KEY=
MISTRAL_API_KEY=
FOOTBALL_API_KEY=
FLASK_SECRET_KEY=

---

## Built By

Maaz Korejo — BS Information Technology, University of Sindh, Jamshoro  
[GitHub](https://github.com/Maazkorejo) · Built for FIFA World Cup 2026