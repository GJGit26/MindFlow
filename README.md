#  MindFlow — AI Mood Journal

A full-stack MERN application where users journal their emotions and get real-time AI-powered sentiment analysis and insights using Claude AI.

![MindFlow Banner](https://via.placeholder.com/1200x400/0A0A0F/7C6AFF?text=MindFlow+AI+Mood+Journal)

## Features


-  **AI Sentiment Analysis** powered by Claude (Anthropic API)
-  **Daily Mood Journaling** with 6 mood categories
-  **Dashboard Analytics** — streak tracker, mood chart, recent entries
-  **JWT Authentication** — register & login securely
-  **Dark mode UI** — clean, modern, human-centered design
-  **MongoDB** — all entries stored persistently

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (custom design system) |
| 3D Animation | Spline |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude API |

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas account)
- Anthropic API key (free at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your keys:
# MONGO_URI=mongodb://localhost:27017/mindflow
# JWT_SECRET=your_secret_key
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open `http://localhost:3000` 

## 📁 Project Structure

```
mindflow/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing + Spline 3D
│   │   │   ├── Dashboard.jsx   # Analytics & stats
│   │   │   ├── Journal.jsx     # Write + AI analyze
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # JWT auth state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Full design system
│   ├── index.html
│   └── vite.config.js
│
└── backend/
    ├── models/
    │   ├── User.js             # Mongoose user schema
    │   └── Entry.js            # Journal entry schema
    ├── routes/
    │   ├── auth.js             # Register + Login
    │   └── entries.js          # CRUD + AI analysis
    ├── middleware/
    │   └── auth.js             # JWT protect middleware
    └── server.js               # Express app entry
```

## Key Design Decisions

- **Spline 3D** — Interactive 3D scene on homepage (with animated blob fallback while loading)
- **Mood-reactive UI** — Colors shift dynamically based on selected mood
- **AI-first** — Every entry can be analyzed; insights are empathetic, not clinical
- **Demo mode** — App works with mock data even without backend (great for showcasing)

## Resume / Interview Talking Points

1. **MERN full-stack** — REST API, JWT auth, MongoDB schemas, React context
2. **Third-party API integration** — Anthropic Claude for NLP sentiment analysis
3. **Modern tooling** — Vite, ES modules, environment config
4. **UX thinking** — Fallback states, loading spinners, error handling
5. **3D web** — Spline integration for immersive UI

---

Built with ❤️ 
