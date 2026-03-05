// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default api;


// src/services/movieAPI.js

const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export const tmdbImage = (path, size = 'w500') =>
  path ? `${IMG}/${size}${path}` : '/placeholder-poster.jpg';

export const getTrending    = ()           => api.get('/movies/trending').then(r => r.data);
export const getPopular     = (page = 1)   => api.get('/movies/popular', { params: { page } }).then(r => r.data);
export const searchMovies   = (q, page=1)  => api.get('/movies/search',  { params: { q, page } }).then(r => r.data);
export const getGenres      = ()           => api.get('/movies/genres').then(r => r.data);
export const getMovieById   = (id)         => api.get(`/movies/${id}`).then(r => r.data);


// src/services/productionAPI.js

export const getProductions    = (params = {}) => api.get('/productions', { params }).then(r => r.data);
export const getFeatured       = ()             => getProductions({ featured: true });
export const getEmmyShows      = ()             => getProductions({ awardType: 'Emmy' });
export const getOscarFilms     = ()             => getProductions({ awardType: 'Oscar', type: 'Film' });
export const getIndieFilms     = ()             => getProductions({ independent: true });
export const getProductionById = (id)           => api.get(`/productions/${id}`).then(r => r.data);
export const getAwardStats     = ()             => api.get('/productions/stats').then(r => r.data);


// src/services/studioAPI.js

export const getStudios    = (params = {}) => api.get('/studios',          { params }).then(r => r.data);
export const getMapPins    = ()            => api.get('/studios/map-pins').then(r => r.data);
export const getStudioById = (id)          => api.get(`/studios/${id}`).then(r => r.data);


// src/services/jobAPI.js

export const getJobs           = (params = {}) => api.get('/jobs',            { params }).then(r => r.data);
export const getOpenCalls      = ()             => api.get('/jobs/open-calls').then(r => r.data);
export const getJobCategories  = ()             => api.get('/jobs/categories').then(r => r.data);
export const getJobById        = (id)           => api.get(`/jobs/${id}`).then(r => r.data);
export const createJob         = (data)         => api.post('/jobs', data).then(r => r.data);


// src/services/watchlistAPI.js

export const getWatchlist     = ()         => api.get('/watchlist').then(r => r.data);
export const addToWatchlist   = (movie)    => api.post('/watchlist', movie).then(r => r.data);
export const removeWatchlist  = (movieId)  => api.delete(`/watchlist/${movieId}`).then(r => r.data);


// src/services/reviewAPI.js
import api from './api.js';

export const getReviews    = (movieId)       => api.get(`/reviews/${movieId}`).then(r => r.data);
export const postReview    = (movieId, data) => api.post(`/reviews/${movieId}`, data).then(r => r.data);
export const deleteReview  = (id)            => api.delete(`/reviews/${id}`).then(r => r.data);
