// ============================================================
// controllers/jobController.js
// ============================================================
import asyncHandler from 'express-async-handler';
import Job          from '../models/Job.js';

export const getJobs = asyncHandler(async (req, res) => {
  const { category, type, union, remote, search, page = 1, limit = 12 } = req.query;
  const f = { status: 'Active' };
  if (category) f.category = category;
  if (type)     f.type     = type;
  if (union  !== undefined) f.union  = union  === 'true';
  if (remote !== undefined) f.remote = remote === 'true';
  if (search) f.$or = [
    { title:      { $regex: search, $options: 'i' } },
    { company:    { $regex: search, $options: 'i' } },
    { production: { $regex: search, $options: 'i' } },
  ];
  const skip  = (page - 1) * limit;
  const total = await Job.countDocuments(f);
  const jobs  = await Job.find(f).populate('studioId','name image address').sort({ featured: -1, createdAt: -1 }).skip(skip).limit(+limit);
  res.json({ jobs, total, page: +page, pages: Math.ceil(total / limit) });
});

export const getOpenCalls     = asyncHandler(async (req, res) => {
  res.json(await Job.find({ category: { $in: ['Open Call','Acting'] }, status: 'Active' }).sort({ featured: -1, createdAt: -1 }).limit(20));
});
export const getJobCategories = asyncHandler(async (req, res) => {
  res.json(await Job.aggregate([{ $match: { status: 'Active' } }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]));
});
export const getJobById       = asyncHandler(async (req, res) => {
  const j = await Job.findById(req.params.id).populate('studioId postedBy','-password');
  if (!j) { res.status(404); throw new Error('Not found'); }
  res.json(j);
});
export const createJob        = asyncHandler(async (req, res) => {
  res.status(201).json(await Job.create({ ...req.body, postedBy: req.user._id }));
});
export const updateJob        = asyncHandler(async (req, res) => {
  const j = await Job.findById(req.params.id);
  if (!j) { res.status(404); throw new Error('Not found'); }
  if (j.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') { res.status(403); throw new Error('Not authorized'); }
  res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
export const deleteJob        = asyncHandler(async (req, res) => {
  const j = await Job.findById(req.params.id);
  if (!j) { res.status(404); throw new Error('Not found'); }
  await j.deleteOne();
  res.json({ message: 'Deleted' });
});
