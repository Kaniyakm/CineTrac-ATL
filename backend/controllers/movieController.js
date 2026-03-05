// ============================================================
// controllers/movieController.js — TMDB API proxy
// ============================================================
import asyncHandler from 'express-async-handler';
import axios        from 'axios';

const tmdb = (path, params = {}) =>
  axios.get(`https://api.themoviedb.org/3${path}`, { params: { api_key: process.env.TMDB_API_KEY, ...params } });

export const getTrending  = asyncHandler(async (req, res) => { const { data } = await tmdb('/trending/movie/week'); res.json(data.results); });
export const getPopular   = asyncHandler(async (req, res) => { const { data } = await tmdb('/movie/popular',  { page: req.query.page || 1 }); res.json(data); });
export const searchMovies = asyncHandler(async (req, res) => {
  if (!req.query.q) { res.status(400); throw new Error('Query required'); }
  const { data } = await tmdb('/search/movie', { query: req.query.q, page: req.query.page || 1 });
  res.json(data);
});
export const getGenres    = asyncHandler(async (req, res) => { const { data } = await tmdb('/genre/movie/list'); res.json(data.genres); });
export const getMovieById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const [detail, credits, videos] = await Promise.all([tmdb(`/movie/${id}`), tmdb(`/movie/${id}/credits`), tmdb(`/movie/${id}/videos`)]);
  res.json({ ...detail.data, cast: credits.data.cast.slice(0, 12), trailers: videos.data.results.filter(v => v.type === 'Trailer' && v.site === 'YouTube') });
});
