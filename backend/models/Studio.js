// ============================================================
// models/Studio.js — ATL studios with map coordinates
// ============================================================
import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  slug:         { type: String, unique: true },
  description:  { type: String },
  image:        { type: String },
  website:      { type: String },
  phone:        { type: String },
  address:      { type: String },
  city:         { type: String, default: 'Atlanta' },
  state:        { type: String, default: 'GA' },
  zip:          { type: String },
  // GeoJSON Point — enables $near geospatial queries
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
  googlePlaceId: { type: String },
  founded:      { type: Number },
  acres:        { type: Number },
  stages:       { type: Number },
  owner:        { type: String },
  type:         { type: String, enum: ['Major','Independent','Post-Production','Animation'], default: 'Major' },
  notableFilms: [{ type: String }],
  notableShows: [{ type: String }],
  offersTours:  { type: Boolean, default: false },
  tourUrl:      { type: String },
}, { timestamps: true });

// 2dsphere index required for $near geospatial queries
studioSchema.index({ location: '2dsphere' });

export default mongoose.model('Studio', studioSchema);
