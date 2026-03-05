// src/services/productionAPI.js
import api from './api.js';
export const getProductions    = (p={}) => api.get('/productions',       {params:p}).then(r=>r.data);
export const getFeatured       = ()     => getProductions({featured:true});
export const getEmmyShows      = ()     => getProductions({awardType:'Emmy'});
export const getOscarFilms     = ()     => getProductions({awardType:'Oscar',type:'Film'});
export const getIndieFilms     = ()     => getProductions({independent:true});
export const getProductionById = (id)   => api.get(`/productions/${id}`).then(r=>r.data);
export const getAwardStats     = ()     => api.get('/productions/stats').then(r=>r.data);
export const getProductionTypes = ()    => api.get('/productions/types').then(r=>r.data);