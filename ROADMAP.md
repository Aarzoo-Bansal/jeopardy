# Algo Jeopardy — Product Roadmap

A multiplayer Jeopardy-style game platform where anyone can create custom question sets and host interactive quiz games. Built with React, Node.js, Express, and SQLite.

---

## Phase 1: Core Game ✅ COMPLETE

The foundation — a fully functional single-user game with admin controls, game configuration, and component architecture.

### Game Features
- Dynamic game board (configurable categories × configurable difficulty levels)
- Custom game title (host any topic — algorithms, movies, trivia, anything)
- Game configuration screen (select title, categories, difficulty levels per session)
- Team management (add/remove, 60 emoji avatars, up to 12 teams)
- Spin wheel for random team selection (SVG arc-based, accurate landing)
- Circular SVG countdown timer with danger zone animation
- Question modal with flip card (question/answer toggle)
- Score management (+/- per difficulty level per team)
- Winner/tie detection with confetti celebration
- Random question selection from pool (different game every session)
- Category/difficulty checkboxes with question count indicators (green/yellow/red)
- Empty slot warnings for incomplete categories
- Summary stats (selected categories, difficulties, total slots)

### UI/UX
- Floating code particles background (35 CSS-animated elements)
- CRT scanline overlay
- Gradient text animations (background-position shift, no filter conflicts)
- Staggered board cell entrance animation
- Score pop animations on point changes
- Rank medals (🥇🥈🥉) on team cards
- Category-colored question modals and board cells
- Responsive design (horizontal scroll for many categories, flexWrap for mobile)
- CSS Grid with auto-aligned category headers (gridTemplateRows: auto)
- Glassmorphism card effects with backdrop blur
- Interactive button hover effects (fill transitions)
- Responsive font sizing with clamp()

### Admin Panel (`/admin`)
- Full CRUD for categories (add, inline edit with SAVE/CANCEL, delete with confirmation)
- Full CRUD for questions (add, inline edit with difficulty/time/text, delete)
- Filter questions by category with dropdown + clear button
- Collapsible question groups by category (accordion pattern)
- Alphabetical category sorting
- Particles background and gradient title matching game theme
- CSS button classes (btn-edit, btn-delete, btn-save, btn-cancel)
- Mobile-responsive form layout (flexWrap)

### Architecture
- **Frontend:** React 19 + Vite
- **Styling:** Inline styles + custom CSS classes in animations.css (no Tailwind)
- **Components:** JeopardyGame (parent), GameConfig, TeamsSetup, AdminPanel, SpinWheel, CircularTimer, ParticlesBg, ConfettiBurst, ScorePop
- **State pattern:** Lifting state up with callback props (onNext, onBack, onStart, onAddTeam, onRemoveTeam)
- **Backend:** Node.js + Express + SQLite (better-sqlite3, WAL mode)
- **API:** 8 REST endpoints (CRUD for categories and questions)
- **Routing:** React Router (`/` game, `/admin` admin panel)
- **Config:** Environment variables (.env with VITE_ prefix)
- **Database:** SQLite with CASCADE deletes, transaction-wrapped seeds

### Game Flow
```
Config Screen → Add Teams → Game Board → Winner → Reset
(GameConfig)    (TeamsSetup)  (JeopardyGame)
```

---

## Phase 2: Authentication & Multi-Tenancy (Next)

Transform from a single-user tool to a multi-user platform where anyone can sign up and manage their own question sets.

### User Authentication
- **Sign up** — Email + password registration
- **Log in / Log out** — Session management with JWT tokens
- **Password hashing** — bcrypt for secure storage (never store plain text)
- **Protected routes** — Admin panel requires login, game is public
- **API middleware** — POST/PUT/DELETE endpoints require valid JWT, GET remains public

### Database Changes
- Switch from SQLite to PostgreSQL (for multi-user persistence on Render)
- New `users` table: id, email, password_hash, display_name, created_at
- Add `user_id` column to `categories` and `questions` tables
- All queries filter by authenticated user's ID
- Migration script to update existing schema

### Multi-Tenancy
- Each user sees only their own categories and questions
- User dashboard: "My Categories", total question count, last edited
- Separate admin panel per user (no one sees another user's content)
- Seed script becomes optional (new users start with empty database or sample questions)

### Tech Decisions
- **JWT vs Sessions:** JWT is stateless (no server-side session storage), better for scaling
- **bcrypt:** Industry standard for password hashing, includes automatic salting
- **Middleware pattern:** One `auth.js` middleware file that validates JWT on protected routes
- **PostgreSQL:** Managed service on Render, persistent across deploys (unlike SQLite file)

### Deployment
- Deploy to Render (free tier)
- Build frontend → serve from Express (single port, no CORS needed)
- PostgreSQL on Render's managed database
- Environment variables for database URL, JWT secret

---

## Phase 3: Game Rooms & Sharing

Enable hosts to create unique game sessions that teams can join via a link.

### Game Rooms
- Host clicks "Start New Game" → creates a room with a unique code (e.g., `ALGO-7X2K`)
- Room URL: `yourapp.com/game/ALGO-7X2K`
- Teams join by entering the room code or visiting the link
- Room states: `lobby` → `playing` → `finished`
- Room expires after 24 hours or manual deletion

### Database Changes
- New `rooms` table: id (room code), user_id, status, created_at, config (JSON)
- New `room_teams` table: id, room_id, name, avatar, score
- Room stores game configuration (which categories, which difficulties)

### Real-Time Updates (Optional)
- WebSocket connection (Socket.io) for live score updates
- When host awards points, all connected browsers update instantly
- Useful if displaying scores on a separate screen/projector

### Sharing
- "Share Game" button generates a QR code for the room URL
- Teams scan QR code on their phones to see the live scoreboard
- Social sharing: "I scored $2400 on Algo Jeopardy!"

---

## Phase 4: AI Question Generation

Let users generate questions using AI instead of writing everything manually.

### User Flow
```
Admin clicks "Generate with AI"
→ Picks a topic: "Binary Search Trees"
→ Picks difficulty: $300
→ Picks count: 5 questions
→ AI generates 5 questions with answers
→ Admin reviews each one (edit/accept/reject)
→ Accepted questions save to database
```

### Implementation
- Backend endpoint: POST `/api/generate-questions`
- Request body: `{ topic, difficulty, count, category_id }`
- Backend calls Claude API (Anthropic) with a structured prompt
- Prompt instructs Claude to return JSON: `[{ question, answer, difficulty, time_limit }]`
- Response shown in a review modal — admin can edit before saving
- Never auto-save — always require human review

### AI Prompt Design
```
Generate {count} Jeopardy-style questions about {topic} 
at difficulty level {difficulty}/500.

Rules:
- Questions should be factual with single correct answers
- $100-$200: Basic definitions and simple recall
- $300: Application and comparison questions  
- $400-$500: Deep understanding, edge cases, tradeoffs
- Answers should be concise (1-2 sentences max)

Return ONLY valid JSON array: [{ "question": "...", "answer": "..." }]
```

### Cost Management
- Use Claude Haiku (cheapest model, ~$0.001 per generation)
- Free tier: 20 generations per month per user
- Paid tier: Unlimited (cost built into subscription)
- Cache: If same topic + difficulty requested again, serve cached result
- Rate limiting: Max 5 requests per minute per user

### API Key Strategy
- **Phase 4a:** Platform API key (you pay, simpler UX, include in pricing)
- **Phase 4b (optional):** "Bring your own key" option in user settings for power users

---

## Phase 5: Polish & Production

Final touches before public launch.

### Landing Page
- Hero section explaining the product
- Demo video or animated preview of the game
- "Sign Up Free" CTA
- Feature highlights: Custom questions, AI generation, multiplayer, spin wheel
- Pricing section (free tier vs paid)

### UI/UX Improvements
- Loading skeletons instead of "Loading..." text
- Toast notifications for success/error (instead of alert/confirm)
- Drag-and-drop category reordering in admin panel
- Bulk import/export questions (CSV upload)
- Dark/light theme toggle
- Sound effects (timer tick, correct answer, wheel spin, celebration)
- Keyboard shortcuts (space to flip card, arrow keys to navigate)

### Mobile Optimization
- Responsive game board (stacked on mobile, grid on desktop)
- Touch-friendly spin wheel
- Team scoreboard as swipeable cards on mobile

### Performance
- API response caching (React Query or SWR)
- Lazy loading for admin panel question list
- Database indexing on frequently queried columns

### Security
- Rate limiting on all API endpoints
- Input sanitization (prevent XSS in question/answer text)
- CSRF protection
- Helmet.js for secure HTTP headers
- Admin panel behind authentication (no public access)

### Analytics
- Track: games played, questions answered, average game duration
- User dashboard stats: "You've hosted 12 games this month"

---

## Phase 6: Monetization (Future)

### Pricing Model
- **Free tier:** 3 categories, 30 questions max, 5 AI generations/month
- **Pro ($5/month):** Unlimited categories/questions, 100 AI generations/month, custom branding
- **Team ($15/month):** Multiple admin users, shared question banks, priority support

### Payment Integration
- Stripe for subscription management
- Webhook handling for upgrade/downgrade/cancellation

---

## Tech Stack Evolution

| Phase | Frontend | Backend | Database | Styling | Hosting |
|-------|----------|---------|----------|---------|---------|
| 1 ✅ | React 19 + Vite + Router | Express | SQLite | Inline + CSS classes | Local |
| 2 | Same | + JWT auth + bcrypt | PostgreSQL | Same | Render |
| 3 | + Socket.io client | + Socket.io | + rooms tables | Same | Render |
| 4 | Same | + Claude API | Same | Same | Render |
| 5 | Same | + Stripe | Same | + Tailwind (new components) | Render Pro |

---

## File Structure

```
algo-jeopardy/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JeopardyGame.jsx    (parent: game board, modals, scoreboard)
│   │   │   ├── GameConfig.jsx      (config screen: title, categories, difficulties)
│   │   │   ├── TeamsSetup.jsx      (teams screen: add/remove teams, avatars)
│   │   │   ├── AdminPanel.jsx      (admin: CRUD categories & questions)
│   │   │   ├── SpinWheel.jsx       (random team selector)
│   │   │   ├── CircularTimer.jsx   (SVG countdown timer)
│   │   │   ├── ParticlesBg.jsx     (floating code particles)
│   │   │   ├── ConfettiBurst.jsx   (celebration effect)
│   │   │   └── ScorePop.jsx        (score change animation)
│   │   ├── style/
│   │   │   └── animations.css      (keyframes, button classes, utilities)
│   │   ├── utils/
│   │   │   └── geometry.js         (SVG arc math)
│   │   ├── data/
│   │   │   └── defaultQuestions.js  (WHEEL_COLORS)
│   │   ├── App.jsx                 (React Router)
│   │   ├── index.css               (imports animations.css)
│   │   └── main.jsx                (entry point)
│   ├── .env                        (VITE_API_URL)
│   └── package.json
├── server/
│   ├── db.js                       (database layer, schema, CRUD methods)
│   ├── seed.js                     (populates sample data)
│   ├── server.js                   (Express app, 8 REST endpoints, CORS)
│   └── package.json
├── ROADMAP.md
└── .gitignore
```

---

## Contributing

This project is open source. If you want to contribute:

1. Fork the repo
2. Create a feature branch
3. Follow existing code patterns
4. Submit a PR with a clear description

---

*Last updated: February 25, 2026*