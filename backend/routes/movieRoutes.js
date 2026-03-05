// routes/movieRoutes.js
import { Router } from 'express';
import { getTrending, getPopular, searchMovies, getGenres, getMovieById } from '../controllers/movieController.js';
const r = Router();
r.get('/trending', getTrending);
r.get('/popular',  getPopular);
r.get('/search',   searchMovies);
r.get('/genres',   getGenres);
r.get('/:id',      getMovieById);
export default r;
