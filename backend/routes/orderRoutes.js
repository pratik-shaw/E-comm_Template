const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  cancelOrder 
} = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(verifyToken);

// Create a new order
router.post('/', createOrder);

// Get all orders for the current user
router.get('/', getUserOrders);

// Get a specific order by ID
router.get('/:id', getOrderById);

// Cancel an order
router.put('/:id/cancel', cancelOrder);

module.exports = router;