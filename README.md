# MERN Personal Finance Tracker (Expense Tracker + optional Income)

This is a production-leaning **MERN** project (MongoDB + Express + React + Node) implementing the **core requirements from the assignment** (create/list expenses, filter by category, sort by newest date, show total) and adds **optional** real-world extensions: **JWT auth, income tracking, dashboard charts, history, profile, and monthly summary**.

The backend is designed to behave correctly under **retries / refreshes / unreliable networks** by supporting **idempotent creates** via an `Idempotency-Key` header.

---

## Tech choices (and why)

- **MongoDB + Mongoose**: matches MERN and provides flexible querying + aggregation for summaries.
- **Money handling**: amounts are stored as **integer paise** (e.g., ₹10.50 => 1050) to avoid floating-point errors.
- **Idempotency**: create endpoints accept an `Idempotency-Key` and enforce uniqueness per user so retries return the same created document.

---

## Repo structure

- `server/` – Express API (auth + expenses + income + summaries)
- `client/` – React UI (Vite) with pages:
  - Dashboard
  - Income
  - Expense
  - History
  - Profile
  - Monthly

---

## Quick start (local)

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Set `MONGO_URI` to your MongoDB connection string.

### 2) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL it prints (usually `http://localhost:5173`).

---

## Environment variables

### `server/.env`
- `PORT=5000`
- `MONGO_URI=mongodb://...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=http://localhost:5173`

### `client/.env`
- `VITE_API_BASE_URL=http://localhost:5000/api`

---

## API overview

### Auth
- `POST /api/auth/register` `{name,email,password}`
- `POST /api/auth/login` `{email,password}` -> `{token,user}`
- `GET /api/auth/me` (Bearer token)

### Expenses (assignment core)
- `POST /api/expenses` (Bearer token)
  - Headers: `Idempotency-Key: <uuid>`
  - Body: `{amount, category, description, date}`
- `GET /api/expenses?category=Food&sort=date_desc`

### Income (optional extension)
- `POST /api/incomes` (same pattern)
- `GET /api/incomes?category=Salary&sort=date_desc`

### History + summaries (optional)
- `GET /api/history` -> combined income + expense timeline
- `GET /api/summary/overview` -> totals + expense category breakdown
- `GET /api/summary/monthly?month=YYYY-MM` -> daily totals for charts

---

## Notes / trade-offs

- UI is intentionally simple; focus is on correctness, totals, filtering, sorting, error/loading handling, and idempotent writes.
- No refresh-token rotation; JWT access token is stored in `localStorage` for simplicity.
- Minimal validation is implemented server-side and client-side.

---

## Production notes

- In production, prefer httpOnly cookies for tokens, rate limiting, helmet, request logging, and stronger password rules.
- Consider unique category collections or enums if category set is constrained.
