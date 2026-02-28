# Jeopardy

A multiplayer Jeopardy-style quiz platform where anyone can sign up, create custom question sets, and host interactive games. Built as a full-stack application with a cyberpunk-themed UI featuring floating particles, gradient animations, and glassmorphism effects.

🔗 **Live:** [jeopardy-client-43tn.onrender.com](https://jeopardy-client-43tn.onrender.com)

![Phase 2 Complete](https://img.shields.io/badge/Status-Phase%202%20Complete-06b6d4?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?style=flat-square&logo=postgresql)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat-square&logo=render)

---

![Game Board](https://raw.githubusercontent.com/Aarzoo-Bansal/jeopardy/main/main_portal.gif)

![Winner Celebration](https://raw.githubusercontent.com/Aarzoo-Bansal/jeopardy/main/winners-portal.gif)

---

## Features

### Landing Page
- Hero section with animated gradient text
- Interactive game board preview with hover effects
- Feature highlights and call-to-action
- Responsive design for all screen sizes

### User Authentication
- Sign up with email and password
- JWT-based login with 24-hour token expiry
- bcrypt password hashing with automatic salting
- Protected routes — admin panel requires login
- Multi-tenant data isolation — your questions are yours alone

### Game Configuration
- Custom game title (host any topic — algorithms, movies, history, anything)
- Select/deselect categories with question count indicators
- Choose difficulty levels ($100–$500)
- Summary dashboard showing total slots before starting

### Team Management
- Add up to 12 teams with custom names
- 60 unique emoji avatars to choose from
- Auto-selects next available avatar

### Game Board
- Dynamic grid based on selected categories and difficulties
- Category-colored cells with hover glow effects
- Staggered entrance animation on board load
- Responsive horizontal scroll for many categories

### Question Flow
- Click a cell to open the question modal
- Circular SVG countdown timer with danger zone animation
- Flip card to reveal answer
- Pause, resume, and reset timer controls

### Spin Wheel
- SVG arc-based wheel with team segments
- Accurate landing detection
- Tracks which teams have already played this round
- Auto-resets round when all teams have played

### Scoring
- +/- buttons for each difficulty level per team
- Animated score pops on point changes
- Live rank medals (🥇🥈🥉)
- Winner/tie detection with confetti celebration

### Admin Panel (`/admin`)
- Full CRUD for categories and questions
- Inline editing with SAVE/CANCEL buttons
- Custom dropdown components (no native select bugs)
- Filter questions by category
- Collapsible question groups with accordion pattern
- Silent data refresh (no loading flash on CRUD operations)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | CSS animations + inline styles |
| Routing | React Router DOM |
| Backend | Node.js + Express |
| Database | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| Deployment | Render (Blueprint IaC) |
| CI/CD | Auto-deploy from GitHub |

---

## Project Structure

```
jeopardy/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── JeopardyGame.jsx     # Main game (board, scoreboard, modals)
│   │   │   ├── GameConfig.jsx       # Game configuration screen
│   │   │   ├── TeamsSetup.jsx       # Team management screen
│   │   │   ├── AdminPanel.jsx       # Admin CRUD interface
│   │   │   ├── LandingPage.jsx      # Public landing page
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Signup.jsx           # Registration form
│   │   │   ├── ProtectedRoute.jsx   # Auth route wrapper
│   │   │   ├── CustomSelect.jsx     # Custom dropdown component
│   │   │   ├── SpinWheel.jsx        # SVG spin wheel
│   │   │   ├── CircularTimer.jsx    # SVG countdown timer
│   │   │   ├── ParticlesBg.jsx      # Floating code particles
│   │   │   ├── ConfettiBurst.jsx    # Confetti celebration
│   │   │   └── ScorePop.jsx         # Score change animation
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state + useAuth() hook
│   │   ├── data/
│   │   │   └── constants.js         # Wheel colors constant
│   │   ├── utils/
│   │   │   └── geometry.js          # SVG arc math utilities
│   │   ├── style/
│   │   │   └── animations.css       # All keyframes and CSS classes
│   │   ├── App.jsx                  # Router + auth-based routing
│   │   └── index.css                # Global styles
│   ├── .env
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_categories.sql
│   │   └── 003_create_questions.sql
│   ├── routes/
│   │   ├── auth.js                  # POST /api/auth/register, /api/auth/login
│   │   ├── categories.js            # CRUD for categories (user-scoped)
│   │   └── questions.js             # CRUD for questions (user-scoped)
│   ├── migrate.js                   # Migration runner
│   ├── seed.js                      # Demo data seeder
│   ├── server.js                    # Express entry point
│   └── package.json
│
├── render.yaml                      # Render Blueprint (IaC)
├── ROADMAP.md                       # Product roadmap (Phases 1–7)
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16

### 1. Clone the repository

```bash
git clone https://github.com/Aarzoo-Bansal/jeopardy.git
cd jeopardy
```

### 2. Set up the database

Create a PostgreSQL database, then add your credentials to `server/.env`:

```
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jeopardy
JWT_SECRET=your_secret_key
```

### 3. Set up the backend

```bash
cd server
npm install
node migrate.js    # Creates tables
node seed.js       # (Optional) Populates demo data
node server.js     # Starts API on port 3000
```

### 4. Set up the frontend

```bash
cd client
npm install
```

Create `.env` in the client folder:

```
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

### 5. Open the app

- Landing Page: http://localhost:5173
- Admin Panel: http://localhost:5173/admin

Demo credentials (after running seed.js): `demo@jeopardy.com` / `demo1234`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login, returns JWT token |

### Categories (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List user's categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category (cascades) |

### Questions (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List user's questions |
| POST | `/api/questions` | Create a question |
| PUT | `/api/questions/:id` | Update a question |
| DELETE | `/api/questions/:id` | Delete a question |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## Deployment

The app is deployed on Render using a Blueprint (`render.yaml`) that provisions all three services:

- **PostgreSQL 16** — managed database
- **Node.js Web Service** — backend API with auto-migrations on deploy
- **Static Site** — compiled React frontend

To deploy your own instance:

1. Fork this repo
2. Go to [Render Dashboard](https://dashboard.render.com) → New → Blueprint
3. Connect your repo — Render reads `render.yaml` and creates everything
4. Set `FRONTEND_URL` on the backend and `VITE_API_URL` on the frontend
5. Both services auto-deploy on every push to `main`

---

## Security

- **Parameterized queries** — all SQL uses `$1, $2` syntax, preventing SQL injection
- **bcrypt password hashing** — one-way hash with automatic salting
- **JWT authentication** — stateless token verification, 24-hour expiry
- **Multi-tenant isolation** — every query filters by `user_id`, one user cannot access another's data
- **CORS restriction** — locked to production frontend URL via `FRONTEND_URL` env var
- **403 over 404** — never reveals whether a resource exists for another user

---

## Game Flow

```
Landing Page → Sign Up → Admin Panel → Configure Game → Add Teams → Play
                              │
                              ├─ Create categories
                              ├─ Add questions (difficulty, time limit)
                              └─ Edit / delete anytime
```

---

## What's Next

See [ROADMAP.md](./ROADMAP.md) for the full product roadmap (Phases 1–7).

**Coming soon:**
- 🔜 Game Rooms — shareable links with unique codes for live sessions
- 🔜 AI Question Generation — generate questions using OpenAI/Claude/Gemini
- 🔜 Real-time score updates via WebSocket
- 🔜 Landing page with demo video and pricing tiers

---

## License

MIT