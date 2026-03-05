// routes/authRoutes.js
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = Router();
r.post('/register', register);
r.post('/login',    login);
r.get('/me',        protect, getMe);
export default r;
