# Jeopardy — Product Roadmap

A multiplayer Jeopardy-style game platform where anyone can create custom question sets and host interactive quiz games. Built with React, Node.js, Express, and PostgreSQL.

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

## Phase 2: Authentication & Multi-Tenancy 🔄 IN PROGRESS

Transform from a single-user tool to a multi-user platform where anyone can sign up and manage their own question sets.

### Completed So Far
- ✅ Migrated from SQLite to PostgreSQL (better-sqlite3 → pg)
- ✅ Migration system built (numbered SQL files, migrations tracking table, never runs twice)
- ✅ New database schema: users, categories, questions tables with foreign keys and indexes
- ✅ Route extraction: server.js split into routes/categories.js and routes/questions.js
- ✅ All queries rewritten as async/await with parameterized $1, $2 syntax
- ✅ Health check endpoint (/api/health)
- ✅ Global error handler and 404 handler added to server.js

### User Authentication
- **Sign up** — Email + password registration
- **Log in / Log out** — JWT tokens, 24 hour expiry
- **Password hashing** — bcrypt with automatic salting (never store plain text)
- **Protected routes** — Admin panel requires login, game board is public
- **API middleware** — POST/PUT/DELETE endpoints require valid JWT, GET remains public

### Security Decisions & Reasoning

#### Authentication: JWT (not Sessions)
JWT is stateless — the server never stores tokens. Verification is pure mathematics using the JWT_SECRET signature. This scales perfectly because any server can verify a token without a database lookup.

Sessions require shared storage between servers — complex and expensive to scale.

**Tradeoff:** JWT tokens cannot be truly invalidated before expiry. If stolen, they remain valid until they expire. Mitigated by short expiry times.

#### Token Storage: localStorage (Phase 2) → httpOnly Cookie (Phase 5)
localStorage is simple and sufficient for a portfolio project. However, JavaScript can read localStorage, making it vulnerable to XSS attacks.

httpOnly cookies cannot be read by JavaScript — the browser handles them automatically. This fully eliminates the XSS token theft attack surface. Will be upgraded in Phase 5.

#### Token Expiry: 24 hours (Phase 2) → 15 minutes (Phase 5)
24 hours balances security with UX for a quiz platform. Users (teachers, students) should not have to log in repeatedly during a session.

Phase 5 will introduce a two-token system:
- **Access token** — 15 minute expiry, stored in memory (React state)
- **Refresh token** — 7 day expiry, stored in httpOnly cookie, rotated on every use

#### Password Hashing: bcrypt
bcrypt is a one-way hash — cannot be reversed. Even if the database is breached, passwords are safe. bcrypt automatically salts every hash (same password produces different hashes), defeating rainbow table attacks. bcrypt is intentionally slow (~100 hashes/second) making brute force attacks impractical.

#### Parameterized Queries: $1, $2, $3
All database queries use PostgreSQL's parameterized syntax. User input is sent separately from the SQL string and is always treated as plain data, never as executable SQL. This fully prevents SQL injection attacks.

```
SAFE:   pool.query('SELECT * FROM users WHERE email = $1', [email])
UNSAFE: pool.query(`SELECT * FROM users WHERE email = '${email}'`)
```

#### Multi-Tenancy: Row-Level (not database-per-user)
All users share one database. Every categories and questions row has a user_id column. Every query filters by the authenticated user's ID. One user can never access another user's data because the WHERE clause always includes user_id = req.user.userId.

Creating a separate database per user would be operationally impossible to manage at scale and is not the industry standard for this type of platform.

#### CORS: Open in Development → Restricted in Production
`cors()` with no origin restriction is used during development for convenience. Before deploying to Render, this will be locked to the production frontend URL:
```js
cors({ origin: process.env.FRONTEND_URL })
```
An open CORS policy in production would allow any website to make API calls using a user's credentials.

### Attack Vectors & Mitigations

| Attack | Risk | Mitigation |
|--------|------|------------|
| SQL Injection | Hacker injects SQL via user input | Parameterized queries ($1, $2) |
| Password theft (DB breach) | Hacker steals password column | bcrypt one-way hashing + salt |
| Token theft via XSS | Malicious JS reads localStorage | React escapes output automatically; upgrade to httpOnly cookie in Phase 5 |
| Token theft via network | Hacker sniffs traffic on WiFi | HTTPS (Render provides free SSL) |
| Token forgery | Hacker creates fake JWT | JWT_SECRET signature verification — mathematically impossible to forge without the secret |
| Brute force login | Hacker guesses passwords | bcrypt is slow (100/sec); rate limiting added in Phase 5 |
| Physical access | Someone uses an unlocked laptop | 24hr token expiry limits damage window |
| Open CORS | Any site calls your API | Restrict origin before production deploy |

### Database Changes
- Migrated from SQLite to PostgreSQL 16
- Migration system: numbered SQL files in /migrations, tracking table prevents reruns
- `users` table: id, email, password (bcrypt hash), created_at
- `categories` table: added user_id foreign key with ON DELETE CASCADE
- `questions` table: added user_id foreign key with ON DELETE CASCADE
- UNIQUE constraint: (name, user_id) on categories — same name allowed across different users
- Performance indexes: idx_categories_user_id, idx_questions_user_id, idx_questions_category_id
- PostgreSQL automatically creates indexes for PRIMARY KEY and UNIQUE constraints

### Multi-Tenancy
- Each user sees only their own categories and questions (WHERE user_id = req.user.userId)
- Separate admin panel per user (no cross-user data access possible)
- Seed script rewritten for PostgreSQL (optional for new users)
- ON DELETE CASCADE: deleting a user automatically deletes all their categories and questions

### Server Architecture (Restructured)
```
server/
├── config/
│   ├── db.js                  ← PostgreSQL connection pool
│   └── db.sqlite.old.js       ← old SQLite code (reference only, delete after Phase 2)
├── middleware/
│   └── auth.js                ← JWT verification middleware
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_categories.sql
│   └── 003_create_questions.sql
├── routes/
│   ├── auth.js                ← POST /api/auth/register, POST /api/auth/login
│   ├── categories.js          ← CRUD for categories (scoped by user_id)
│   └── questions.js           ← CRUD for questions (scoped by user_id)
├── migrate.js                 ← migration runner (node migrate.js)
├── seed.js                    ← sample data (rewritten for PostgreSQL)
└── server.js                  ← thin entry point: middleware, route mounting, error handlers
```

### Tech Decisions
- **JWT vs Sessions:** JWT is stateless — no server-side session storage, scales horizontally
- **bcrypt:** Industry standard for password hashing, automatic salting, intentionally slow
- **Middleware pattern:** One auth.js middleware that validates JWT on protected routes
- **Raw pg vs ORM:** Using raw pg + SQL queries to build deep understanding before introducing an ORM (Drizzle planned for Phase 3+)
- **PostgreSQL:** Managed service on Render, persistent across deploys

### Deployment
- Deploy to Render (free tier)
- Build frontend → serve from Express (single port, no CORS issues)
- PostgreSQL on Render's managed database
- Environment variables: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, JWT_SECRET, PORT, FRONTEND_URL

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
- Social sharing: "I scored $2400 on Jeopardy!"

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
- Backend calls the user's chosen AI model using their stored API key
- Supported models: OpenAI (GPT-4), Anthropic (Claude), Google (Gemini)
- Response shown in a review modal — admin can edit before saving
- Never auto-save — always require human review

### API Key Storage (Security Critical)
Users provide their own API keys — these are high value credentials that can cause real financial damage if stolen. Storing them requires encryption at rest:

```
❌ WRONG — plain text storage:
users table: openai_key = "sk-abc123..."
→ database breach = all keys exposed

✅ CORRECT — encrypted storage:
users table: openai_key = "AES256_encrypted_blob..."
→ encrypted with server-side MASTER_ENCRYPTION_KEY
→ useless to attacker without the master key
```

Implementation:
- AES-256 encryption before storing any API key
- MASTER_ENCRYPTION_KEY stored in environment variables only (never in DB or code)
- Keys masked in UI: show `sk-...abc123` never the full key
- User can delete/rotate key but cannot read it back in full
- New migration: `004_add_api_keys_to_users.sql`

```sql
ALTER TABLE users ADD COLUMN openai_key TEXT;
ALTER TABLE users ADD COLUMN anthropic_key TEXT;
ALTER TABLE users ADD COLUMN gemini_key TEXT;
-- all stored as AES-256 encrypted blobs
```

### 2FA Warning on API Key Storage
When a user tries to add an API key without 2FA enabled, show a clear warning:

```
⚠️  You're about to store an API key.
We strongly recommend enabling 2FA first
to protect your credentials from unauthorized access.

[Enable 2FA First]  [Continue without 2FA]
```

This pattern is used by GitHub, Vercel, and AWS — warn users without blocking them.

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

### Security Upgrades (from Phase 2 decisions)
- **Two-token system:** Short lived access token (15min) + refresh token (7 days)
- **httpOnly cookie** for refresh token — JavaScript cannot read it, eliminates XSS token theft
- **Refresh token rotation** — every use invalidates old token and issues new one
- **Token blacklisting** — logout invalidates refresh token in database
- **Rate limiting** on auth endpoints — prevent brute force login attacks (max 5 attempts/minute)
- **CORS restriction** — lock to production frontend URL only (process.env.FRONTEND_URL)
- **Helmet.js** — secure HTTP headers (HSTS, CSP, X-Frame-Options)
- **Input sanitization** — prevent XSS in question/answer text
- **CSRF protection** — prevent cross-site request forgery

### 2FA Implementation (triggered by API key storage in Phase 4)
- **Method:** TOTP via authenticator app (Google Authenticator, Authy)
  - More secure than email OTP — codes generated locally on user's phone, cannot be intercepted
  - Works even if user's email is compromised
- **Conditional mandatory:** 2FA becomes REQUIRED the moment a user saves an API key
  - Users without API keys → 2FA optional
  - Users with API keys → 2FA enforced on every login
  - Security scales with what's actually at risk
- **Implementation:**
  - `speakeasy` or `otplib` library for TOTP code generation/verification
  - New migration: `005_add_2fa_to_users.sql`
  ```sql
  ALTER TABLE users ADD COLUMN totp_secret TEXT;
  ALTER TABLE users ADD COLUMN totp_enabled BOOLEAN DEFAULT FALSE;
  ```
  - Setup flow: generate secret → show QR code → user scans → verify first code → enable
  - Login flow with 2FA: verify password → if totp_enabled → ask for TOTP code → verify → issue JWT
- **Backup codes:** generate 8 one-time backup codes on 2FA setup (stored as bcrypt hashes)
  - If user loses phone, backup codes let them in
  - Each code used once then invalidated

### Email Verification on Signup
- Send verification email on register (using Resend or SendGrid free tier)
- Account fully functional but flagged as unverified until confirmed
- Required before storing API keys
- Enables password reset flow

### Analytics
- Track: games played, questions answered, average game duration
- User dashboard stats: "You've hosted 12 games this month"

---

## Phase 6: Team Workspaces & RBAC (Future)

Enable teams to collaboratively manage shared question banks with role-based permissions. This is the foundation for the Team pricing tier.

### The Problem It Solves
Right now every category and question is owned by a single user. A teacher can't invite a colleague to help build a question bank. A team can't share questions across members. This phase adds a **workspace** layer between users and their content.

### User Flow
```
Aarzoo (owner) creates workspace: "CS Department"
→ invites John as editor
→ invites Sarah as viewer
→ John can add/edit/delete categories and questions
→ Sarah can only view questions (cannot modify)
→ nobody outside the workspace can access anything
```

### New Database Tables
```sql
-- A workspace is a shared question bank owned by one user
CREATE TABLE workspaces (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    owner_id   INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Who's in each workspace and what can they do
CREATE TABLE workspace_members (
    workspace_id  INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role          TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    joined_at     TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- Categories and questions belong to workspace, not individual user
ALTER TABLE categories ADD COLUMN workspace_id INTEGER REFERENCES workspaces(id);
ALTER TABLE questions  ADD COLUMN workspace_id INTEGER REFERENCES workspaces(id);
```

### Three Roles
```
owner  → full control: create/edit/delete content, invite members, remove members, delete workspace
editor → can add/edit/delete categories and questions
viewer → read only: can see questions, cannot modify anything
```

### Authorization Pattern
```js
// Check if user has required role before any write operation
const checkRole = async (userId, workspaceId, requiredRoles) => {
    const result = await pool.query(
        `SELECT role FROM workspace_members
         WHERE user_id = $1 AND workspace_id = $2`,
        [userId, workspaceId]
    );
    if (result.rows.length === 0) return false; // not a member
    return requiredRoles.includes(result.rows[0].role);
};

// Example: only owner and editor can create categories
router.post('/categories', verifyToken, async (req, res) => {
    const canEdit = await checkRole(
        req.user.userId,
        req.body.workspaceId,
        ['owner', 'editor']
    );
    if (!canEdit) return res.status(403).json({ error: 'Not authorized' });
    // proceed...
});
```

### New API Endpoints
```
POST /api/workspaces                    → create workspace
GET  /api/workspaces                    → list my workspaces
POST /api/workspaces/:id/invite         → invite member by email
PUT  /api/workspaces/:id/members/:uid   → change member role
DELETE /api/workspaces/:id/members/:uid → remove member
```

### Invitation Flow
```
Owner sends invite:
POST /api/workspaces/1/invite { email: "john@gmail.com", role: "editor" }
      ↓
Server creates workspace_members row
{ workspace_id: 1, user_id: 2, role: "editor" }
      ↓
John logs in → sees "CS Department" workspace → can edit questions
```

### Permission Matrix
| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| View questions | ✅ | ✅ | ✅ |
| Add/edit questions | ✅ | ✅ | ❌ |
| Delete questions | ✅ | ✅ | ❌ |
| Invite members | ✅ | ❌ | ❌ |
| Change roles | ✅ | ❌ | ❌ |
| Delete workspace | ✅ | ❌ | ❌ |

### Migration Path from Phase 2
Phase 2 uses `user_id` on every row. Phase 6 introduces `workspace_id`. The migration strategy:
- Every existing user automatically gets a personal workspace created for them
- Their existing categories/questions are migrated to that personal workspace
- They become the owner of their personal workspace
- No data is lost, no user action required

### Industry References
This pattern is used by every major collaboration tool:
```
Notion    → workspaces + member roles
Figma     → teams + can view / can edit permissions
GitHub    → organizations + read/write/admin roles
Google    → shared drives + viewer/commenter/editor roles
```

---

## Phase 7: Monetization (Optional — if/when needed)

### Pricing Model
- **Free tier:** 3 categories, 30 questions max, 5 AI generations/month, personal workspace only
- **Pro ($5/month):** Unlimited categories/questions, 100 AI generations/month, custom branding
- **Team ($15/month):** Everything in Pro + workspaces, up to 10 members, role-based permissions, shared question banks, priority support

### Payment Integration
- Stripe for subscription management
- Webhook handling for upgrade/downgrade/cancellation
- Usage limits enforced per tier (middleware checks plan before allowing action)

---

## Tech Stack Evolution

| Phase | Frontend | Backend | Database | Styling | Hosting |
|-------|----------|---------|----------|---------|---------|
| 1 ✅ | React 19 + Vite + Router | Express | SQLite | Inline + CSS classes | Local |
| 2 🔄 | Same | + JWT auth + bcrypt + pg | PostgreSQL 16 | Same | Render |
| 3 | + Socket.io client | + Socket.io | + rooms tables | Same | Render |
| 4 | Same | + Claude API | Same | Same | Render |
| 5 | Same | + Helmet + rate limiting | Same | + Tailwind (new components) | Render Pro |
| 6 | Same | + RBAC middleware | + workspaces tables | Same | Render Pro |
| 7 | Same | + Stripe | Same | Same | Render Pro |

---

## Key Concepts Learned

### Database
- **PostgreSQL vs SQLite** — PostgreSQL handles concurrent multi-user writes; SQLite is single-writer, suitable for embedded/local use only
- **Connection Pooling** — pool of pre-opened connections reused across requests; one pool per process, shared across all route files via Node.js module cache
- **Migrations** — numbered SQL files that run exactly once, tracked in a migrations table; never DROP TABLE in production
- **Normalization** — store data once, reference by ID; use JOIN to combine tables in queries
- **N+1 Problem** — never query inside a loop; use JOIN to fetch related data in one query
- **Indexes** — B-tree structures that reduce lookup from O(n) to O(log n); always index foreign keys and frequently queried columns
- **Foreign Keys + CASCADE** — referential integrity enforced by database; ON DELETE CASCADE automatically cleans up child rows

### Authentication & Security
- **Authentication vs Authorization** — authentication = who are you; authorization = what are you allowed to do
- **JWT** — stateless bearer token; verified mathematically using JWT_SECRET signature; server stores nothing
- **bcrypt** — one-way hash with automatic salt; same password produces different hashes; intentionally slow to defeat brute force
- **SQL Injection** — never interpolate user input into SQL strings; always use parameterized queries ($1, $2)
- **Token theft** — if stolen, JWT is valid until expiry; mitigated by HTTPS, short expiry, httpOnly cookies
- **CORS** — browser security policy preventing cross-origin requests; configure to only allow your frontend URL in production
- **User enumeration** — never reveal whether an email exists; use same error message for wrong email and wrong password
- **Information disclosure** — return 403 (not 404) when user accesses another user's resource; never confirm whether a resource exists
- **Minimum information principle** — never reveal more than the user needs; every extra piece of info is a potential attack vector
- **Encryption at rest** — API keys and sensitive credentials must be AES-256 encrypted before storing; bcrypt is one-way (for passwords), AES-256 is two-way (for values you need to use later)
- **Conditional security** — scale security requirements to match what's at risk; mandatory 2FA only when user stores high-value credentials like API keys
- **TOTP vs Email OTP** — TOTP (authenticator app) is stronger than email OTP; codes generated locally on device, cannot be intercepted even if email is compromised

### Authorization & Access Control (Phase 6)
- **RBAC (Role-Based Access Control)** — assign roles (owner/editor/viewer) to users; check role before every write operation
- **Workspace model** — a shared namespace owned by one user; members join with assigned roles; content belongs to workspace not individual user
- **Composite primary key** — PRIMARY KEY (workspace_id, user_id) on workspace_members ensures one role per user per workspace
- **Progressive permission modeling** — start simple (single user), add sharing (game rooms), then add full RBAC (teams); never over-engineer early
- **Migration path** — when adding workspaces to existing data, auto-create a personal workspace per user and migrate their content; zero data loss

### Node.js & Express
- **Async vs Sync** — Node.js is single-threaded; blocking freezes everything; async/await lets Node.js handle other requests while waiting for database
- **Module cache** — require() runs a file once per process; subsequent imports return cached instance; one pool shared across all routes
- **Route extraction** — separate route files with express.Router(); mounted in server.js with prefix; separation of concerns
- **Middleware order** — Express reads top to bottom; 404 handler must be last; error handler needs 4 parameters (err, req, res, next)

---

## File Structure (Phase 2)

```
jeopardy/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JeopardyGame.jsx
│   │   │   ├── GameConfig.jsx
│   │   │   ├── TeamsSetup.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── SpinWheel.jsx
│   │   │   ├── CircularTimer.jsx
│   │   │   ├── ParticlesBg.jsx
│   │   │   ├── ConfettiBurst.jsx
│   │   │   └── ScorePop.jsx
│   │   ├── style/
│   │   │   └── animations.css
│   │   ├── utils/
│   │   │   └── geometry.js
│   │   ├── data/
│   │   │   └── defaultQuestions.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/
│   ├── config/
│   │   ├── db.js                  ← PostgreSQL pool
│   │   └── db.sqlite.old.js       ← old SQLite reference
│   ├── middleware/
│   │   └── auth.js                ← JWT verification
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_categories.sql
│   │   └── 003_create_questions.sql
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── questions.js
│   ├── migrate.js
│   ├── seed.js
│   ├── server.js
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

*Last updated: February 26, 2026*
