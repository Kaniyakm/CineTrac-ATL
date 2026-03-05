// ============================================================
// server.js — CineTrack ATL Express Entry Point
// ============================================================
import express      from 'express';
import cors         from 'cors';
import helmet       from 'helmet';
import morgan       from 'morgan';
import dotenv       from 'dotenv';
import rateLimit    from 'express-rate-limit';
import { connectDB } from './config/db.js';

import authRoutes        from './routes/authRoutes.js';
import movieRoutes       from './routes/movieRoutes.js';
import reviewRoutes      from './routes/reviewRoutes.js';
import watchlistRoutes   from './routes/watchlistRoutes.js';
import studioRoutes      from './routes/studioRoutes.js';
import productionRoutes  from './routes/productionRoutes.js';
import jobRoutes         from './routes/jobRoutes.js';
import mapRoutes         from './routes/mapRoutes.js';

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Rate limiting — 100 requests per 15 min per IP
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',        authRoutes);
app.use('/api/movies',      movieRoutes);
app.use('/api/reviews',     reviewRoutes);
app.use('/api/watchlist',   watchlistRoutes);
app.use('/api/studios',     studioRoutes);
app.use('/api/productions', productionRoutes);
app.use('/api/jobs',        jobRoutes);
app.use('/api/map',         mapRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', version: '2.0', timestamp: new Date() })
);

// Global error handler
app.use((err, req, res, next) => {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`\n🎬  CineTrack ATL running on http://localhost:${PORT}\n`);
});
