// routes/watchlistRoutes.js
import { Router } from 'express';
import { getWatchlist, addWatchlist, removeWatchlist } from '../controllers/reviewWatchlistController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = Router();
r.use(protect); // all watchlist routes require auth
r.get('/',              getWatchlist);
r.post('/',             addWatchlist);
r.delete('/:movieId',   removeWatchlist);
export default r;
