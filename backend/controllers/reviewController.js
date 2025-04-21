const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Helper function to check if user has purchased the product
const hasUserPurchasedProduct = async (userId, productId) => {
  const orders = await Order.find({
    user: userId,
    'items.product': productId,
    status: 'Delivered' // Only count delivered orders
  });
  
  return orders.length > 0;
};

// Get all reviews for a specific product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    // Check if user has purchased the product
    const isPurchased = await hasUserPurchasedProduct(userId, productId);
    
    // Create the review
    const review = await Review.create([{
      user: userId,
      product: productId,
      name: req.user.name,
      rating,
      comment,
      certifiedBuyer: isPurchased
    }], { session });
    
    // Update product ratings
    const allProductReviews = await Review.find({ product: productId });
    const totalRatings = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / allProductReviews.length;
    
    // Update product with new rating and add review to product's reviews array
    await Product.findByIdAndUpdate(
      productId,
      {
        ratings: parseFloat(averageRating.toFixed(1)),
        $push: { reviews: {
          user: userId,
          name: req.user.name,
          rating,
          comment,
          createdAt: new Date()
        }}
      },
      { new: true, session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: review[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    
    // Check if review exists and belongs to the user
    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to update this review'
      });
    }
    
    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save({ session });
    
    // Update product's review array and recalculate average rating
    const productId = review.product;
    
    // Update the specific review in the product's reviews array
    await Product.updateOne(
      { _id: productId, 'reviews.user': userId },
      {
        $set: {
          'reviews.$.rating': rating || review.rating,
          'reviews.$.comment': comment || review.comment
        }
      },
      { session }
    );
    
    // Recalculate average rating
    const allProductReviews = await Review.find({ product: productId });
    const totalRatings = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / allProductReviews.length;
    
    await Product.findByIdAndUpdate(
      productId,
      { ratings: parseFloat(averageRating.toFixed(1)) },
      { new: true, session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    // Check if user is admin or the review owner
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is authorized to delete this review
    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review'
      });
    }
    
    const productId = review.product;
    
    // Delete the review from Review collection
    await Review.findByIdAndDelete(reviewId, { session });
    
    // Remove the review from product's reviews array
    await Product.updateOne(
      { _id: productId },
      { $pull: { reviews: { user: userId } } },
      { session }
    );
    
    // Recalculate average rating
    const allProductReviews = await Review.find({ product: productId });
    
    if (allProductReviews.length > 0) {
      const totalRatings = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / allProductReviews.length;
      
      await Product.findByIdAndUpdate(
        productId,
        { ratings: parseFloat(averageRating.toFixed(1)) },
        { new: true, session }
      );
    } else {
      // If no reviews left, reset ratings to 0
      await Product.findByIdAndUpdate(
        productId,
        { ratings: 0 },
        { new: true, session }
      );
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Get all reviews for a user
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const reviews = await Review.find({ user: userId })
      .populate('product', 'name imageUrls')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Check if user can review a product
exports.canReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });
    
    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: 'You have already reviewed this product',
        existingReview
      });
    }
    
    // Check if user has purchased the product
    const isPurchased = await hasUserPurchasedProduct(userId, productId);
    
    res.status(200).json({
      success: true,
      canReview: true,
      willBeCertified: isPurchased
    });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking review eligibility',
      error: error.message
    });
  }
};

// Get review stats for admin dashboard
exports.getReviewStats = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin only'
      });
    }
    
    const totalReviews = await Review.countDocuments();
    
    // Get average rating across all products
    const reviewAggregation = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);
    
    let ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, index 4 = 5 stars
    
    if (reviewAggregation.length > 0 && reviewAggregation[0].ratingDistribution) {
      reviewAggregation[0].ratingDistribution.forEach(rating => {
        ratingCounts[rating - 1]++;
      });
    }
    
    // Get recent reviews
    const recentReviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: reviewAggregation.length > 0 ? parseFloat(reviewAggregation[0].averageRating.toFixed(1)) : 0,
        ratingDistribution: {
          oneStar: ratingCounts[0],
          twoStar: ratingCounts[1],
          threeStar: ratingCounts[2],
          fourStar: ratingCounts[3],
          fiveStar: ratingCounts[4]
        },
        recentReviews
      }
    });
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics',
      error: error.message
    });
  }
};