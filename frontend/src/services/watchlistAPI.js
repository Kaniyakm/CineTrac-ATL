// src/services/watchlistAPI.js
import api from './api';
export const getWatchlist    = ()      => api.get('/watchlist').then(r=>r.data);
export const addToWatchlist  = (movie) => api.post('/watchlist',movie).then(r=>r.data);
export const removeWatchlist = (mId)   => api.delete(`/watchlist/${mId}`).then(r=>r.data);

// src/services/reviewAPI.js  (same file for simplicity)
export const getReviews   = (mId)      => api.get(`/reviews/${mId}`).then(r=>r.data);
export const postReview   = (mId,data) => api.post(`/reviews/${mId}`,data).then(r=>r.data);
export const deleteReview = (id)       => api.delete(`/reviews/${id}`).then(r=>r.data);
