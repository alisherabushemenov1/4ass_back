const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes (GET - Read access for everyone)
router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.get('/reviews/:id', reviewController.getReview);

// Protected routes (Authenticated users can create reviews)
router.post('/products/:productId/reviews', 
  authenticate, 
  reviewController.createReview
);

// Admin only routes (Update and Delete)
router.put('/reviews/:id', 
  authenticate, 
  authorize('admin'), 
  reviewController.updateReview
);

router.delete('/reviews/:id', 
  authenticate, 
  authorize('admin'), 
  reviewController.deleteReview
);

module.exports = router;