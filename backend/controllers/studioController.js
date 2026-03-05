// ============================================================
// controllers/studioController.js
// ============================================================
import asyncHandler from 'express-async-handler';
import Studio       from '../models/Studio.js';

export const getStudios     = asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  res.json(await Studio.find(filter).sort({ name: 1 }));
});

export const getMapPins     = asyncHandler(async (req, res) => {
  res.json(await Studio.find({ 'location.coordinates.0': { $ne: 0 } },
    'name slug address location type image acres stages notableFilms website'));
});

export const getStudioById  = asyncHandler(async (req, res) => {
  const s = await Studio.findById(req.params.id);
  if (!s) { res.status(404); throw new Error('Studio not found'); }
  res.json(s);
});

export const getStudiosNear = asyncHandler(async (req, res) => {
  const { lat, lng, km = 50 } = req.query;
  if (!lat || !lng) { res.status(400); throw new Error('lat and lng required'); }
  res.json(await Studio.find({ location: { $near: { $geometry: { type: 'Point', coordinates: [+lng, +lat] }, $maxDistance: km * 1000 } } }));
});

export const createStudio   = asyncHandler(async (req, res) => { res.status(201).json(await Studio.create(req.body)); });
export const updateStudio   = asyncHandler(async (req, res) => {
  const s = await Studio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) { res.status(404); throw new Error('Studio not found'); }
  res.json(s);
});
