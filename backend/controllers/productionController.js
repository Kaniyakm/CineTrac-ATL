// controllers/productionController.js
import asyncHandler from 'express-async-handler';
import axios        from 'axios';
import Production   from '../models/Production.js';

// Auto-fetch poster from TMDB for any production missing one
const enrichWithTMDB = async (productions) => {
  const KEY = process.env.TMDB_API_KEY;
  if (!KEY) return productions;

  return Promise.all(productions.map(async (prod) => {
    const doc = prod.toObject();
    if (doc.poster || !doc.tmdbId) return doc;

    try {
      const isTV = ['TV Series', 'Mini-Series'].includes(doc.type);
      const url  = `https://api.themoviedb.org/3/${isTV ? 'tv' : 'movie'}/${doc.tmdbId}`;
      const { data } = await axios.get(url, { params: { api_key: KEY }, timeout: 4000 });
      doc.poster   = data.poster_path   || null;
      doc.backdrop = data.backdrop_path || null;
      // Persist so next request skips TMDB entirely
      Production.findByIdAndUpdate(doc._id, { poster: doc.poster, backdrop: doc.backdrop }).catch(() => {});
    } catch { /* TMDB unavailable — return without poster */ }

    return doc;
  }));
};

export const getProductions = asyncHandler(async (req, res) => {
  const { type, awardType, status, featured, independent } = req.query;
  const f = {};
  if (type)        f.type               = type;
  if (featured)    f.featured           = featured === 'true';
  if (independent) f.independent        = independent === 'true';
  if (awardType)   f['awards.type']     = awardType;
  if (status)      f['awards.status']   = status;

  const prods = await Production.find(f)
    .populate('studioId', 'name address location')
    .sort({ featured: -1 });

  res.json(await enrichWithTMDB(prods));
});

export const getAwardStats = asyncHandler(async (req, res) => {
  res.json(await Production.aggregate([
    { $unwind: '$awards' },
    { $group: { _id: '$awards.type', total: { $sum: 1 }, wins: { $sum: { $cond: [{ $eq: ['$awards.status', 'Won'] }, 1, 0] } } } },
    { $sort: { total: -1 } },
  ]));
});

export const getProductionById = asyncHandler(async (req, res) => {
  const p = await Production.findById(req.params.id).populate('studioId');
  if (!p) { res.status(404); throw new Error('Not found'); }
  res.json(p);
});

export const createProduction = asyncHandler(async (req, res) => {
  res.status(201).json(await Production.create(req.body));
});

