// routes/jobRoutes.js
import { Router } from 'express';
import { getJobs, getOpenCalls, getJobCategories, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = Router();
r.get('/',            getJobs);
r.get('/open-calls',  getOpenCalls);
r.get('/categories',  getJobCategories);
r.get('/:id',         getJobById);
r.post('/',           protect, createJob);
r.put('/:id',         protect, updateJob);
r.delete('/:id',      protect, deleteJob);
export default r;
