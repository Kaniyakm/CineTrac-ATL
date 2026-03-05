// routes/productionRoutes.js
import { Router } from 'express';
import { getProductions, getAwardStats, getProductionById, createProduction } from '../controllers/productionController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
const r = Router();
r.get('/',       getProductions);
r.get('/stats',  getAwardStats);
r.get('/:id',    getProductionById);
r.post('/',      protect, adminOnly, createProduction);
export default r;
