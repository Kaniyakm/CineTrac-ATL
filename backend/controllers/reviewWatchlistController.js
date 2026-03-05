// ============================================================
// controllers/reviewController.js
// ============================================================
import asyncHandler from 'express-async-handler';
import Review       from '../models/Review.js';

export const getReviews = asyncHandler(async (req, res) => {
  res.json(await Review.find({ movieId: req.params.movieId }).populate('userId','name avatar').sort({ createdAt: -1 }));
});
export const createReview = asyncHandler(async (req, res) => {
  const r = await Review.create({ userId: req.user._id, movieId: req.params.movieId, ...req.body });
  res.status(201).json(await r.populate('userId','name avatar'));
});
export const deleteReview = asyncHandler(async (req, res) => {
  const r = await Review.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Not found'); }
  if (r.userId.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  await r.deleteOne();
  res.json({ message: 'Deleted' });
});

// ============================================================
// controllers/watchlistController.js
// ============================================================
import Watchlist from '../models/Watchlist.js';

export const getWatchlist    = asyncHandler(async (req, res) => { res.json(await Watchlist.find({ userId: req.user._id }).sort({ addedAt: -1 })); });
export const addWatchlist    = asyncHandler(async (req, res) => { res.status(201).json(await Watchlist.create({ userId: req.user._id, ...req.body })); });
export const removeWatchlist = asyncHandler(async (req, res) => {
  await Watchlist.deleteOne({ userId: req.user._id, movieId: req.params.movieId });
  res.json({ message: 'Removed' });
});
