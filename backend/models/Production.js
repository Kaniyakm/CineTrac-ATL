// ============================================================
// models/Production.js — Emmy/Oscar ATL productions
// ============================================================
import mongoose from 'mongoose';

const awardSchema = new mongoose.Schema({
  type:      { type: String, enum: ['Emmy','Oscar','SAG','BAFTA','Golden Globe','Critics Choice'], required: true },
  year:      { type: Number, required: true },
  category:  { type: String, required: true },
  status:    { type: String, enum: ['Won','Nominated'], required: true },
  recipient: { type: String },
}, { _id: false });

const productionSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  type:       { type: String, enum: ['Film','TV Series','Mini-Series','Documentary','Short Film'], required: true },
  genre:      [{ type: String }],
  years:      { type: String },
  network:    { type: String },
  director:   { type: String },
  cast:       [{ type: String }],
  overview:   { type: String },
  awards:     [awardSchema],
  filmingLocations: [{ type: String }],
  studio:     { type: String },
  studioId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
  tmdbId:     { type: Number },
  poster:     { type: String },
  backdrop:   { type: String },
  trailerKey: { type: String },
  featured:    { type: Boolean, default: false },
  independent: { type: Boolean, default: false },
}, { timestamps: true });

productionSchema.index({ type: 1 });
productionSchema.index({ 'awards.type': 1 });
productionSchema.index({ 'awards.status': 1 });
productionSchema.index({ featured: 1 });

export default mongoose.model('Production', productionSchema);
