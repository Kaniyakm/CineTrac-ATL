// ============================================================
// controllers/authController.js
// ============================================================
import jwt          from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User         from '../models/User.js';

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid credentials'); }
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(await User.findById(req.user._id).select('-password'));
});
