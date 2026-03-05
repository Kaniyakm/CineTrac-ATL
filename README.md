# CineTrack ATL v2.0 🎬

**MERN full-stack Atlanta film industry hub**

---

## Quick Start

```bash
# 1. Unzip
unzip CineTrackATL_v2_Complete.zip
cd cinetrack-atl

# 2. Install backend
cd backend
npm install

# 3. Install frontend
cd ../frontend
npm install

# 4. Environment files
cd ../backend
cp .env.example .env       # Fill in MONGO_URI, JWT_SECRET, TMDB_API_KEY, GOOGLE_MAPS_API_KEY

cd ../frontend
cp .env.example .env       # Fill in VITE_API_URL, VITE_TMDB_API_KEY, VITE_GOOGLE_MAPS_KEY

# 5. Seed database (MongoDB Atlas must be connected first)
cd ../backend
npm run seed

# 6. Start development servers
# Terminal 1:
cd backend  && npm run dev    # → http://localhost:5000
# Terminal 2:
cd frontend && npm run dev    # → http://localhost:5173
```

---

## API Keys Required

| Key | Source | Free Tier |
|-----|--------|-----------|
| MongoDB Atlas URI | cloud.mongodb.com | ✅ M0 Free Forever |
| TMDB API Key | themoviedb.org/settings/api | ✅ Always Free |
| Google Maps Key | console.cloud.google.com | ✅ $200/mo credit |

---

## Folder Structure

```
cinetrack-atl/
├── backend/
│   ├── config/db.js
│   ├── controllers/      (7 files)
│   ├── middleware/        authMiddleware.js
│   ├── models/           (6 files: User, Production, Studio, Job, Review, Watchlist)
│   ├── routes/           (8 files)
│   ├── scripts/          seedAll.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/   (5 files)
    │   ├── context/      AuthContext.jsx
    │   ├── hooks/        useDebounce.js
    │   ├── pages/        (7 files)
    │   ├── services/     (7 files)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env.example
```

---

## Deploy

### Backend (Railway / Render)
1. Push `/backend` folder
2. Set all env vars from `.env.example`
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Push `/frontend` folder
2. Set `VITE_API_URL=https://your-backend.railway.app/api`
3. Build command: `npm run build`
4. Output: `dist/`

---

*Built in Atlanta, GA*
