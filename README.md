# CineTrack ATL  🎬

A full-stack film industry platform for the Atlanta market. Combines TMDB movie discovery with a proprietary database of Emmy and Oscar-nominated Atlanta productions, an interactive studio directory, and a job board for open calls and industry positions.

**Live:** `https://cinetrac-atl.vercel.app` &nbsp;|&nbsp; **API:** `https://cinetrac-atl-api.onrender.com`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Vercel)                       │
│   React 18 · Vite · Tailwind CSS · Framer Motion           │
│   React Router v6 · Axios · JWT (localStorage)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST /api/*
┌──────────────────────────▼──────────────────────────────────┐
│                      SERVER (Render)                         │
│   Node.js 18 · Express · Helmet · Rate Limiting             │
│   JWT Auth · Bcrypt · TMDB Proxy · Google Maps Proxy        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────┐
│                   MongoDB Atlas (M0)                         │
│   Collections: users · productions · studios                │
│                jobs · reviews · watchlists                   │
│   Indexes: 2dsphere (studios) · compound (jobs, awards)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

**Atlanta Film Hub**
- Studio directory with photos, acreage, stage count, and notable productions
- Emmy & Oscar production database with embedded award sub-documents
- Award filtering by type (Emmy / Oscar / Golden Globe / SAG)
- TMDB poster auto-fetch — fetches on first request, persists to Atlas

**Job Board**
- 8 job categories: Open Call, Acting, Crew, Production, Post, Writing, Union, Internship
- Filter by category, union status, remote, and free-text search
- Paginated results with featured open calls strip
- Job detail modal with requirements, responsibilities, and apply CTA
- Filmmaker role — JWT-gated job posting

**Movie Discovery**
- TMDB proxy — trending, popular, search, genre filter, detail pages
- YouTube trailer player, cast grid, user reviews
- Authenticated watchlist with bookmark toggle

**Auth**
- JWT with 7-day expiry, bcrypt password hashing
- Three roles: `user` · `filmmaker` · `admin`
- Protected routes on frontend and middleware guards on API

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register — returns JWT |
| POST | `/api/auth/login` | Public | Login — returns JWT |
| GET | `/api/auth/me` | 🔒 | Current user |

### Movies (TMDB Proxy)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/movies/trending` | Public | Trending this week |
| GET | `/api/movies/popular` | Public | Popular · `?page=` |
| GET | `/api/movies/search` | Public | Search · `?q=` |
| GET | `/api/movies/:id` | Public | Detail + cast + trailers |

### Studios
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/studios` | Public | All studios · `?type=` |
| GET | `/api/studios/map-pins` | Public | Lightweight coords |
| GET | `/api/studios/near` | Public | `?lat=&lng=&km=` geospatial |
| GET | `/api/studios/:id` | Public | Studio detail |
| POST | `/api/studios` | 🔒 Admin | Create studio |
| PUT | `/api/studios/:id` | 🔒 Admin | Update studio |

### Productions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/productions` | Public | Filter: `?awardType=Emmy&status=Won&type=Film` |
| GET | `/api/productions/stats` | Public | Aggregate wins + noms by award type |
| GET | `/api/productions/:id` | Public | Production detail |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | Public | Filter + paginate: `?category=Crew&union=true&page=1` |
| GET | `/api/jobs/open-calls` | Public | Open Call + Acting only |
| GET | `/api/jobs/categories` | Public | Category counts |
| GET | `/api/jobs/:id` | Public | Job detail |
| POST | `/api/jobs` | 🔒 | Create listing (filmmaker+) |
| PUT | `/api/jobs/:id` | 🔒 | Update own listing |
| DELETE | `/api/jobs/:id` | 🔒 | Delete own listing |

### Map
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/map/studios` | Public | Studio pins |
| GET | `/api/map/place-details` | Public | Google Places proxy · `?placeId=` |
| GET | `/api/map/geocode` | Public | Address → coords · `?address=` |

### Watchlist & Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET/POST | `/api/watchlist` | 🔒 | Get / add |
| DELETE | `/api/watchlist/:movieId` | 🔒 | Remove |
| GET/POST | `/api/reviews/:movieId` | 🔒 | Get / post review |
| DELETE | `/api/reviews/:id` | 🔒 | Delete own review |

---

## Data Models

**Production** — embedded awards array, TMDB ID for poster auto-fetch
```js
awards: [{
  type:      'Emmy' | 'Oscar' | 'SAG' | 'BAFTA' | 'Golden Globe',
  year:      Number,
  category:  String,
  status:    'Won' | 'Nominated',
  recipient: String,
}]
```

**Studio** — GeoJSON Point for `$near` geospatial queries
```js
location: {
  type:        'Point',
  coordinates: [longitude, latitude],
}
// Index: { location: '2dsphere' }
```

**Job** — category enum, expiry, role-based posting
```js
category: 'Open Call' | 'Acting' | 'Crew' | 'Production' |
          'Post-Production' | 'Writing' | 'Directing' |
          'Internship' | 'Union' | 'Non-Union'
```

---

## Project Structure

```
cinetrack-atl/
├── backend/
│   ├── config/
│   │   └── db.js                   MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js       TMDB proxy
│   │   ├── studioController.js      geospatial $near
│   │   ├── productionController.js  TMDB poster auto-fetch
│   │   ├── jobController.js         filter + pagination
│   │   └── reviewWatchlistController.js
│   ├── middleware/
│   │   └── authMiddleware.js        protect · adminOnly · filmmakersOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Production.js            embedded awardSchema
│   │   ├── Studio.js                GeoJSON · 2dsphere index
│   │   ├── Job.js
│   │   ├── Review.js
│   │   └── Watchlist.js
│   ├── routes/                      8 route files
│   ├── scripts/
│   │   └── seedAll.js               6 studios · 12 productions · 8 jobs
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MovieCard.jsx
    │   │   ├── StudioCard.jsx
    │   │   ├── AwardBadge.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx       global JWT state · roles
    │   ├── hooks/
    │   │   └── useDebounce.js
    │   ├── pages/
    │   │   ├── Home.jsx             hero · trending · ATL strip · jobs CTA
    │   │   ├── Movies.jsx           search · genre filter · pagination
    │   │   ├── MovieDetails.jsx     detail · cast · trailer · reviews
    │   │   ├── AtlantaFilm.jsx      studios · productions · jobs tabs
    │   │   ├── Watchlist.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   ├── api.js               axios instance · error interceptor
    │   │   ├── movieAPI.js
    │   │   ├── productionAPI.js
    │   │   ├── studioAPI.js
    │   │   ├── jobAPI.js
    │   │   └── watchlistAPI.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js               /api proxy → localhost:5000
    ├── tailwind.config.js           cinema.* + accent.* palette
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

---

## Environment Variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/cinetrack_atl
JWT_SECRET=<64-char random string>
JWT_EXPIRE=7d
TMDB_API_KEY=<from themoviedb.org/settings/api>
GOOGLE_MAPS_API_KEY=<from console.cloud.google.com>
CLIENT_URL=http://localhost:5173
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=<same as backend>
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
VITE_GOOGLE_MAPS_KEY=<same as backend>
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/Kaniyakm/CineTrac-ATL.git
cd CineTrac-ATL

# Install
cd backend  && npm install
cd ../frontend && npm install

# Configure
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
# edit both .env files with your keys

# Seed Atlas
cd backend && npm run seed

# Run (two terminals)
cd backend  && npm run dev   # :5000
cd frontend && npm run dev   # :5173
```

---

## Deployment

### Backend → Render

1. [render.com](https://cinetrac-atl.onrender.com) → New Web Service → connect this repo


### Frontend → Vercel

1. [vercel.com](https://cine-trac-atl.vercel.app/) → New Project → import this repo




| Studios | 6 | Tyler Perry, Trilith, Assembly, EUE/Screen Gems, Atlanta Metro, Third Rail |
| Productions | 12 | 6 TV series + 6 films with full Emmy/Oscar award arrays |
| Jobs | 8 | Open calls, acting, crew, writing, VFX, union, internship |

Safe to re-run — clears collections before inserting.

---

## Key Technical Decisions

**TMDB poster auto-fetch** — `productionController` fetches missing posters from TMDB on first request using each production's `tmdbId`, then persists the path to Atlas. Subsequent requests read from the database — no redundant API calls.

**Google Maps proxy** — `/api/map/*` routes proxy Places API and Geocoding through Express so the API key is never exposed in the browser bundle.

**GeoJSON 2dsphere** — Studio coordinates stored as GeoJSON Points with a `2dsphere` index enabling native MongoDB `$near` queries for distance-based studio lookups.

**Role-based middleware** — `protect`, `adminOnly`, and `filmmakersOnly` are composable Express middleware applied per route, keeping authorization logic out of controllers.

---

## License

MIT

---

*Built in Atlanta, GA*
