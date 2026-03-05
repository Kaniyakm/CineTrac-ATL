// ═══════════════════════════════════════════════════════════════════
// routes/studioRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import { getStudios, getMapPins, getStudioById, getStudiosNear, createStudio, updateStudio } from '../controllers/studioController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/',          getStudios);          // All studios
router.get('/map-pins',  getMapPins);          // Lightweight map marker data
router.get('/near',      getStudiosNear);       // Geospatial — studios near me
router.get('/:id',       getStudioById);
router.post('/',         protect, adminOnly, createStudio);   // 🔒 Admin
router.put('/:id',       protect, adminOnly, updateStudio);   // 🔒 Admin

export default router;


// ═══════════════════════════════════════════════════════════════════
// routes/jobRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router as JobRouter } from 'express';
import { getJobs, getOpenCalls, getJobCategories, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect as jobProtect } from '../middleware/authMiddleware.js';

const jobRouter = JobRouter();
jobRouter.get('/',            getJobs);           // All jobs (filterable)
jobRouter.get('/open-calls',  getOpenCalls);      // Casting open calls only
jobRouter.get('/categories',  getJobCategories);  // Category counts for filter
jobRouter.get('/:id',         getJobById);
jobRouter.post('/',           jobProtect, createJob);           // 🔒 Filmmaker+
jobRouter.put('/:id',         jobProtect, updateJob);           // 🔒 Owner
jobRouter.delete('/:id',      jobProtect, deleteJob);           // 🔒 Owner

export { jobRouter as jobRoutes };


// ═══════════════════════════════════════════════════════════════════
// routes/productionRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router as ProdRouter } from 'express';
import { getProductions, getAwardStats, getProductionById, createProduction } from '../controllers/productionController.js';
import { protect as prodProtect, adminOnly as prodAdmin } from '../middleware/authMiddleware.js';

const prodRouter = ProdRouter();
prodRouter.get('/',        getProductions);
prodRouter.get('/stats',   getAwardStats);   // Award summary counts
prodRouter.get('/:id',     getProductionById);
prodRouter.post('/',       prodProtect, prodAdmin, createProduction);  // 🔒 Admin

export { prodRouter as productionRoutes };


// ═══════════════════════════════════════════════════════════════════
// routes/movieRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router as MovieRouter } from 'express';
import { getTrending, getPopular, searchMovies, getGenres, getMovieById } from '../controllers/movieController.js';

const movieRouter = MovieRouter();
movieRouter.get('/trending', getTrending);
movieRouter.get('/popular',  getPopular);
movieRouter.get('/search',   searchMovies);
movieRouter.get('/genres',   getGenres);
movieRouter.get('/:id',      getMovieById);

export { movieRouter as movieRoutes };


// ═══════════════════════════════════════════════════════════════════
// routes/watchlistRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router as WLRouter } from 'express';
import { Watchlist } from '../models/ReviewWatchlist.js';
import asyncHandler  from 'express-async-handler';
import { protect as wlProtect } from '../middleware/authMiddleware.js';

const wlRouter = WLRouter();

// All watchlist routes require auth
wlRouter.use(wlProtect);

wlRouter.get('/', asyncHandler(async (req, res) => {
  const list = await Watchlist.find({ userId: req.user._id }).sort({ addedAt: -1 });
  res.json(list);
}));

wlRouter.post('/', asyncHandler(async (req, res) => {
  const entry = await Watchlist.create({ userId: req.user._id, ...req.body });
  res.status(201).json(entry);
}));

wlRouter.delete('/:movieId', asyncHandler(async (req, res) => {
  await Watchlist.deleteOne({ userId: req.user._id, movieId: req.params.movieId });
  res.json({ message: 'Removed from watchlist' });
}));

export { wlRouter as watchlistRoutes };


// ═══════════════════════════════════════════════════════════════════
// routes/mapRoutes.js
// Google Maps integration — studio pins + Places proxy
// ═══════════════════════════════════════════════════════════════════
import { Router as MapRouter } from 'express';
import asyncHandler  from 'express-async-handler';
import axios         from 'axios';
import Studio        from '../models/Studio.js';

const mapRouter = MapRouter();

// Return all studio coordinates for initial map load
mapRouter.get('/studios', asyncHandler(async (req, res) => {
  const pins = await Studio.find(
    { 'location.coordinates.0': { $ne: 0 } },
    'name slug address location type image acres stages website'
  );
  res.json(pins);
}));

// Proxy Google Places API (hides key, controls costs)
// Usage: GET /api/map/place-details?placeId=ChIJ...
mapRouter.get('/place-details', asyncHandler(async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) { res.status(400); throw new Error('placeId required'); }

  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields:   'name,rating,opening_hours,formatted_phone_number,website,photos',
      key:      process.env.GOOGLE_MAPS_API_KEY,
    },
  });
  res.json(data.result);
}));

// Geocode an address → coordinates (for admin use when adding studios)
mapRouter.get('/geocode', asyncHandler(async (req, res) => {
  const { address } = req.query;
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address, key: process.env.GOOGLE_MAPS_API_KEY },
  });
  const location = data.results[0]?.geometry?.location;
  res.json(location || { error: 'Not found' });
}));

export { mapRouter as mapRoutes };


// ═══════════════════════════════════════════════════════════════════
// routes/reviewRoutes.js
// ═══════════════════════════════════════════════════════════════════
import { Router as ReviewRouter } from 'express';
import { Review } from '../models/ReviewWatchlist.js';
import asyncHandler from 'express-async-handler';
import { protect as reviewProtect } from '../middleware/authMiddleware.js';

const reviewRouter = ReviewRouter();

// Get all reviews for a movie
reviewRouter.get('/:movieId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
}));

// Post a review (auth required)
reviewRouter.post('/:movieId', reviewProtect, asyncHandler(async (req, res) => {
  const review = await Review.create({
    userId:     req.user._id,
    movieId:    req.params.movieId,
    movieTitle: req.body.movieTitle,
    rating:     req.body.rating,
    comment:    req.body.comment,
  });
  const populated = await review.populate('userId', 'name avatar');
  res.status(201).json(populated);
}));

// Delete own review
reviewRouter.delete('/:id', reviewProtect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.userId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not your review');
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
}));

export { reviewRouter as reviewRoutes };
