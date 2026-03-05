// ============================================================
// models/Review.js
// ============================================================
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId:    { type: Number, required: true },
  movieTitle: { type: String },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
