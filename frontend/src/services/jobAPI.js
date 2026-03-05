// src/services/jobAPI.js
import api from './api.js';
export const getJobs          = (p={}) => api.get('/jobs',            {params:p}).then(r=>r.data);
export const getOpenCalls     = ()     => api.get('/jobs/open-calls').then(r=>r.data);
export const getJobCategories = ()     => api.get('/jobs/categories').then(r=>r.data);
export const getJobById       = (id)   => api.get(`/jobs/${id}`).then(r=>r.data);
export const createJob        = (d)    => api.post('/jobs',d).then(r=>r.data);
