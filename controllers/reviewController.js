const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create review for product
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // check productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid productId' });
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Берём userId правильно (id или _id)
  const userId = req.user?.id || req.user?._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: user not found in token' });
  }

  // Берём только нужные поля, чтобы юзер не мог подделать createdBy/productId
  const { rating, comment } = req.body;

  const review = await Review.create({
    productId,
    createdBy: userId,
    rating,
    comment
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review
  });
});

// @desc    Get all reviews for product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid productId' });
  }

  const reviews = await Review.find({ productId })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email')
    .populate('productId', 'name price');

  // Calculate average rating
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } }, // ✅ FIX
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    stats: stats.length > 0 ? stats[0] : { averageRating: 0, totalReviews: 0 },
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid review id' });
  }

  const review = await Review.findById(id)
    .populate('productId', 'name price category')
    .populate('createdBy', 'name email');

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
exports.updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid review id' });
  }

  let review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  review = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid review id' });
  }

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});
