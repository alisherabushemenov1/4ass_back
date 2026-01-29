const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true
    },

    author: {
      type: String,
      trim: true,
      minlength: [2, 'Author must be at least 2 characters'],
      maxlength: [60, 'Author cannot exceed 60 characters'],
      default: 'Anonymous'
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
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true
    },

    recommended: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    }
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
