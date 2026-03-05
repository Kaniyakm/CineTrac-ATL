// src/services/movieAPI.js
import api from './api.js';
const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
export const tmdbImg    = (path, size='w500') => path ? `${IMG}/${size}${path}` : '/placeholder.jpg';
export const getTrending  = ()          => api.get('/movies/trending').then(r => r.data);
export const getPopular   = (page=1)    => api.get('/movies/popular',  { params:{page} }).then(r => r.data);
export const searchMovies = (q, page=1) => api.get('/movies/search',   { params:{q,page} }).then(r => r.data);
export const getGenres    = ()          => api.get('/movies/genres').then(r => r.data);
export const getMovieById = (id)        => api.get(`/movies/${id}`).then(r => r.data);
export const getMovieVideos = (id)      => api.get(`/movies/${id}/videos`).then(r => r.data);