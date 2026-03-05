// ============================================================
// config/db.js — MongoDB Atlas connection
// ============================================================
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅  MongoDB Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB failed: ${err.message}`);
    process.exit(1);
  }
};
