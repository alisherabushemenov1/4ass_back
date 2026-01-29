const Review = require('../models/Review');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create review for product
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  // Check if product exists
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Add product ID and user who created review
  req.body.productId = req.params.productId;
  req.body.createdBy = req.user._id;

  const review = await Review.create(req.body);

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
  const reviews = await Review.find({ productId: req.params.productId })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email')
    .populate('productId', 'name price');

  // Calculate average rating
  const stats = await Review.aggregate([
    { $match: { productId: require('mongoose').Types.ObjectId(req.params.productId) } },
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
  const review = await Review.findById(req.params.id)
    .populate('productId', 'name price category')
    .populate('createdBy', 'name email');

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
exports.updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

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
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: review
  });
});