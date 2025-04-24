const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      product: productId, 
      user: userId 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Check if user has purchased this product
    const userOrders = await Order.find({ 
      user: userId,
      'items.product': productId,
      status: 'delivered' // Only count completed orders
    });
    
    const isCertifiedBuyer = userOrders.length > 0;
    
    // Get user's name from the User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create the review
    const review = new Review({
      product: productId,
      user: userId,
      name: user.name || (user.firstName + ' ' + (user.lastName || '')).trim(),
      rating,
      comment,
      isCertifiedBuyer
    });
    
    await review.save();
    
    // Update product's ratings
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get all reviews for this product
    const allProductReviews = await Review.find({ product: productId });
    
    // Calculate average rating
    const totalRating = allProductReviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allProductReviews.length;
    
    // Update product with new average rating
    product.ratings = averageRating;
    product.numReviews = allProductReviews.length;
    
    await product.save();
    
    res.status(201).json({ 
      message: 'Review added successfully',
      review
    });
    
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    
    // Find review and check ownership
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    await review.save();
    
    // Update product's ratings
    const product = await Product.findById(review.product);
    const allProductReviews = await Review.find({ product: review.product });
    const totalRating = allProductReviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allProductReviews.length;
    
    product.ratings = averageRating;
    await product.save();
    
    res.json({ 
      message: 'Review updated successfully',
      review
    });
    
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    // Find review and check ownership
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    const productId = review.product;
    
    // Delete the review
    await Review.deleteOne({ _id: reviewId });
    
    // Update product's ratings
    const product = await Product.findById(productId);
    
    if (product) {
      const allProductReviews = await Review.find({ product: productId });
      
      if (allProductReviews.length === 0) {
        // No reviews left
        product.ratings = 0;
        product.numReviews = 0;
      } else {
        // Recalculate average
        const totalRating = allProductReviews.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = totalRating / allProductReviews.length;
        
        product.ratings = averageRating;
        product.numReviews = allProductReviews.length;
      }
      
      await product.save();
    }
    
    res.json({ message: 'Review deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;