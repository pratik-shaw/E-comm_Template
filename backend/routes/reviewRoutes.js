const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  canReviewProduct,
  getReviewStats
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (user)
router.post('/product/:productId', verifyToken, createReview);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);
router.get('/user', verifyToken, getUserReviews);
router.get('/can-review/:productId', verifyToken, canReviewProduct);

// Admin routes
router.get('/stats', verifyToken, verifyAdmin, getReviewStats);

module.exports = router;