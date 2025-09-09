# Messenger — Realtime DM Chat (React + tRPC + Prisma + WebSockets)

A small take‑home project that implements:

- Login
- Sidebar with DM threads (create or select)
- Realtime chat window via tRPC subscriptions
- Postgres + Prisma for persistence
- Dark UI with Tailwind

---

## Requirements

- **Node.js** v18+ and **npm**
- **Docker** & **Docker Compose** (you already have a compose file)
- **Ports**
  - Backend: `4000`
  - Frontend (Vite): `5173`
  - Postgres (host): `5433` → container `5432` (adjust if your compose uses different ports)

---

## Quick Start

### 1) Start the database (using your existing docker-compose file)

```bash
docker compose up -d
```

> If your compose file maps a different host port or credentials, update the `DATABASE_URL` below to match.

---

### 2) Server environment

Create `server/.env`:

```env
# Matches the default compose mapping in this repo (adjust if yours differs)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/messenger?schema=public"
```

---

### 3) Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 4) Prisma: migrate & seed

From the **server** directory:

```bash
cd ../server

# Apply schema to the DB (creates tables)
npx prisma migrate dev --name init

# (Optional) regenerate Prisma client
npx prisma generate

# Seed demo data
npx prisma db seed
```

> If Prisma asks for the seed command, add this to `server/package.json`:
>
> ```json
> {
>   "prisma": {
>     "seed": "ts-node prisma/seed.ts"
>   }
> }
> ```
>
> (Install `ts-node` or use `tsx` if you prefer.)

---

### 5) Run the backend (HTTP + WebSocket on the same port)

From **server**:

```bash
npm run dev
```
- tRPC HTTP endpoint: `http://localhost:4000/trpc`
- WebSocket endpoint: `ws://localhost:4000`

> The WebSocket server is attached to the same Express server (port 4000). CORS allows `http://localhost:5173` by default.

---

### 6) Run the frontend

From **client**:

```bash
npm run dev
```

Open the app at **http://localhost:5173**.

---

## Demo users (for login)

Use any of the following credentials:

| Username | Password   |
|---------:|------------|
| alice    | alice123   |
| bob      | bob123     |
| charles  | charles123 |
| john     | john123    |
| liam     | liam123    |
| gustavo  | gustavo123 |

---

## How it works (quick tour)

- **Threads (DMs):** Sidebar lists your active threads (sorted by the other participant). Use the top form to create a new DM by username.
- **Messages:** Selecting a thread loads its message history via `messages.list` and subscribes to live updates via `messages.onMessage`.
- **Send:** Submits a new message with `messages.send`, which persists to Postgres and broadcasts to connected clients.
- **Session identity:** Login stores the current user in `sessionStorage` so multiple tabs can act as different users concurrently.

---

## Common commands

```bash
# Inspect DB in a browser UI
npx prisma studio

# View Docker logs
docker compose logs -f db

# Stop containers
docker compose down
```

---

## Notes & trade-offs

- Passwords are plain text for demo purposes (scope of take‑home). In real apps, hash (bcrypt) and never return them.
- Minimal routing/auth; session identity is passed from the client to tRPC for simplicity.
- WebSocket reconnection is kept simple; tRPC handles the basic flow.
- Prisma models include `User`, `Thread`, and `Message`, with `@@unique([userAId, userBId])` on `Thread` to enforce one DM per pair.

---

## Project status

Core features complete:
- Login, DM creation, list & select
- Realtime messaging (tRPC subscriptions)
- Prisma models and migrations
- Dark UI with Tailwind

Future enhancements (out of scope):
- Password hashing & tokens/cookies
- Toasted errors / optimistic UI
- Infinite scroll for messages
- Tests & CI
