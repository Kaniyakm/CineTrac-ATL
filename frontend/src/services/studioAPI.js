// src/services/studioAPI.js
import api from './api';
export const getStudios    = (p={}) => api.get('/studios',          {params:p}).then(r=>r.data);
export const getMapPins    = ()     => api.get('/studios/map-pins').then(r=>r.data);
export const getStudioById = (id)   => api.get(`/studios/${id}`).then(r=>r.data);
