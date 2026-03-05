// ═══════════════════════════════════════════════════════════════════
// models/Review.js
// ═══════════════════════════════════════════════════════════════════
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId:   { type: Number, required: true },  // TMDB movie ID
  movieTitle:{ type: String },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

// One review per user per movie
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);

// ═══════════════════════════════════════════════════════════════════
// models/Watchlist.js
// ═══════════════════════════════════════════════════════════════════
const watchlistSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Number, required: true },   // TMDB ID
  title:   { type: String, required: true },
  poster:  { type: String },                   // TMDB poster path
  rating:  { type: Number },                   // TMDB rating snapshot
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
