// ============================================================
// models/Job.js — Film industry jobs & open calls
// ============================================================
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  company:     { type: String, required: true },
  studioId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
  description: { type: String, required: true },
  requirements:     [{ type: String }],
  responsibilities: [{ type: String }],
  category: {
    type: String,
    enum: ['Open Call','Acting','Crew','Production','Post-Production','Writing','Directing','Internship','Union','Non-Union'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-Time','Part-Time','Contract','Freelance','Day-Player','Seasonal'],
    required: true,
  },
  payType:     { type: String, enum: ['Paid','Deferred','Unpaid','Rate-On-Request'] },
  payRange:    { type: String },
  union:       { type: Boolean, default: false },
  postedAt:    { type: Date, default: Date.now },
  expiresAt:   { type: Date },
  shootDates:  { type: String },
  location:    { type: String, default: 'Atlanta, GA' },
  remote:      { type: Boolean, default: false },
  onLocation:  { type: Boolean, default: true },
  production:  { type: String },
  network:     { type: String },
  genre:       [{ type: String }],
  applyUrl:    { type: String },
  applyEmail:  { type: String },
  contactName: { type: String },
  status:      { type: String, enum: ['Active','Filled','Paused','Expired'], default: 'Active' },
  featured:    { type: Boolean, default: false },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ featured: 1 });
jobSchema.index({ union: 1 });

export default mongoose.model('Job', jobSchema);
