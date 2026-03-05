// routes/mapRoutes.js — Google Maps API proxy (keeps keys server-side)
import { Router }   from 'express';
import asyncHandler from 'express-async-handler';
import axios        from 'axios';
import Studio       from '../models/Studio.js';

const r = Router();
const GKEY = () => process.env.GOOGLE_MAPS_API_KEY;

// Studio map pins (lightweight — only coords + basic info)
r.get('/studios', asyncHandler(async (req, res) => {
  res.json(await Studio.find({ 'location.coordinates.0': { $ne: 0 } },
    'name slug address location type image acres stages website notableFilms'));
}));

// Proxy Google Places detail (hides API key from browser)
r.get('/place-details', asyncHandler(async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) { res.status(400); throw new Error('placeId required'); }
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: { place_id: placeId, fields: 'name,rating,opening_hours,formatted_phone_number,website,photos', key: GKEY() },
  });
  res.json(data.result);
}));

// Geocode an address → {lat, lng} (used when adding studios)
r.get('/geocode', asyncHandler(async (req, res) => {
  const { address } = req.query;
  if (!address) { res.status(400); throw new Error('address required'); }
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address, key: GKEY() },
  });
  res.json(data.results[0]?.geometry?.location || { error: 'Not found' });
}));

export default r;
