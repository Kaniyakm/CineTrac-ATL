// ============================================================
// middleware/authMiddleware.js — JWT protect + role guards
// ============================================================
import jwt          from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User         from '../models/User.js';

// Attach req.user from JWT — use on any protected route
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) { res.status(401); throw new Error('Not authorized — no token'); }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) { res.status(401); throw new Error('User not found'); }
  next();
});

// Admin-only routes (use after protect)
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') { res.status(403); throw new Error('Admin access required'); }
  next();
};

// Filmmakers and admins can post jobs
export const filmmakersOnly = (req, res, next) => {
  if (!['filmmaker', 'admin'].includes(req.user?.role)) {
    res.status(403); throw new Error('Filmmaker account required');
  }
  next();
};
