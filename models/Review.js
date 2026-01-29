const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters long'],
    maxlength: [50, 'Author name cannot exceed 50 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    minlength: [5, 'Comment must be at least 5 characters long'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  recommended: {
    type: Boolean,
    default: true
  },
  // Reference to user who created the review
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ productId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdBy: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;