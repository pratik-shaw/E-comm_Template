const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOrderStatusEmail } = require('../utils/emailService');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode ||
        !shippingAddress.phoneNumber) {
      return res.status(400).json({ message: 'Shipping address information is incomplete' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.name || item.product.name,
      price: item.price || item.product.price,
      quantity: item.quantity,
      image: item.image || (item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0].url : '')
    }));

    // Create a new order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalAmount: cart.total
    });

    // Save the order
    await order.save();

    // Clear the user's cart after order is placed
    cart.items = [];
    cart.total = 0;
    await cart.save();

    // Get user details for email notification
    const user = await User.findById(userId);
    
    // Send initial order confirmation email
    if (user && user.email) {
      await sendOrderStatusEmail(order, user);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Store previous status to check if it changed
    const previousStatus = order.status;
    
    // Update order status
    order.status = status;
    await order.save();
    
    // If status has changed, send email notification
    if (previousStatus !== status) {
      // Find the user associated with this order
      const user = await User.findById(order.user);
      
      if (user && user.email) {
        // Send email notification about status change
        const emailSent = await sendOrderStatusEmail(order, user);
        
        if (!emailSent) {
          console.warn(`Failed to send email notification for order ${order.orderNumber}`);
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled (only Pending or Processing orders)
    if (!['Pending', 'Processing'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Order cannot be cancelled as it is already ${order.status.toLowerCase()}` 
      });
    }
    
    // Store previous status
    const previousStatus = order.status;
    
    // Update order status to Cancelled
    order.status = 'Cancelled';
    await order.save();
    
    // Since the status changed, send email notification
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendOrderStatusEmail(order, user);
    }
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};