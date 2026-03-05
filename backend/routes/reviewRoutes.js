// routes/reviewRoutes.js
import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/reviewWatchlistController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = Router();
r.get('/:movieId',  getReviews);
r.post('/:movieId', protect, createReview);
r.delete('/:id',    protect, deleteReview);
export default r;
