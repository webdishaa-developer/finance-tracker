# FinTrack — Business Finance Tracker

A production-ready SaaS finance tracker for small teams.
Track income & expenses, view profit/loss, with full user data isolation.

---

## Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, Recharts            |
| Backend  | Node.js, Express              |
| Database | MongoDB (Mongoose)            |
| Auth     | JWT + bcrypt                  |
| Deploy   | Vercel (FE) + Render (BE)     |

---

## Project Structure

```
finance-tracker/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── summaryController.js
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── summary.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   ├── client.js        # Axios instance + JWT interceptors
    │   │   └── services.js      # API calls
    │   ├── components/
    │   │   ├── AddTransactionModal.js
    │   │   ├── FilterBar.js
    │   │   ├── MonthlyChart.js
    │   │   ├── Navbar.js
    │   │   ├── SummaryCards.js
    │   │   └── TransactionList.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── AuthPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── LoginPage.js
    │   │   └── RegisterPage.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.css
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    ├── package.json
    └── vercel.json
```

---

## API Reference

### Auth
| Method | Endpoint             | Auth | Description       |
|--------|----------------------|------|-------------------|
| POST   | /api/auth/register   | ✗    | Register user     |
| POST   | /api/auth/login      | ✗    | Login user        |
| GET    | /api/auth/me         | ✓    | Get current user  |

### Transactions
| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| GET    | /api/transactions         | ✓    | Get all (with filters)   |
| POST   | /api/transactions         | ✓    | Create transaction       |
| DELETE | /api/transactions/:id     | ✓    | Delete transaction       |

**GET /api/transactions query params:**
- `month` (1–12)
- `year` (e.g. 2025)
- `type` (income | expense)
- `page`, `limit`

### Summary
| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| GET    | /api/summary          | ✓    | Monthly summary          |
| GET    | /api/summary/yearly   | ✓    | Full year breakdown      |

**GET /api/summary query params:** `month`, `year`
**GET /api/summary/yearly query params:** `year`

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-app.vercel.app
```

### Frontend — `frontend/.env`

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Local Development

### 1. MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. Create DB user and whitelist IP `0.0.0.0/0`
3. Copy connection string into `backend/.env`

### 2. Backend
```bash
cd backend
cp .env.example .env       # fill in values
npm install
npm run dev                # runs on :5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env       # set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start                  # runs on :3000
```

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create new **Web Service** on https://render.com
3. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables from `backend/.env`
5. Copy the deployed URL (e.g. `https://fintrack-api.onrender.com`)

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo (or same monorepo)
2. Import project at https://vercel.com/new
3. Set Framework: **Create React App**
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://fintrack-api.onrender.com/api`
5. Deploy — Vercel auto-deploys on every push

### After Deployment
Update backend `CLIENT_URL` env var on Render to match your Vercel URL.

---

## Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT expires in 7 days
- All transaction routes require valid JWT
- Every DB query scoped to `user: req.user._id` — no cross-user data leaks
- CORS restricted to `CLIENT_URL`

---

## Features

- ✅ Register / Login with JWT auth
- ✅ Protected routes & per-user data isolation
- ✅ Add income / expense transactions
- ✅ Month + year filter
- ✅ Total income, expense, profit/loss cards
- ✅ Monthly bar chart (yearly overview)
- ✅ Delete transactions
- ✅ Category breakdown via aggregation
- ✅ Pagination support
- ✅ Responsive mobile UI
- ✅ Dark premium design
