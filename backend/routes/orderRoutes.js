const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  cancelOrder,
  getAllOrders,
  updateOrderStatus 
} = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(verifyToken);

// Admin order routes - these need to come BEFORE the /:id route to avoid conflicts
router.get('/all', verifyAdmin, getAllOrders);  // Get all orders (admin only)
router.put('/:id/status', verifyAdmin, updateOrderStatus);  // Update order status (admin only)

// Customer order routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;