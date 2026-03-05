// src/services/api.js — shared Axios instance
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 10000 });
api.interceptors.response.use(r => r, err => Promise.reject(new Error(err.response?.data?.message || err.message)));
export default api;
