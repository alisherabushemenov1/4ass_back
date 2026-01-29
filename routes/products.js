const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes (GET - Read access for everyone)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes (Admin only for Create, Update, Delete)
router.post('/', 
  authenticate, 
  authorize('admin'), 
  productController.createProduct
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  productController.updateProduct
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  productController.deleteProduct
);

module.exports = router;