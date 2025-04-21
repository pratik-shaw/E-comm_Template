const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // For CORS handling

// Initialize environment variables first, before any other code
dotenv.config();

// Test email configuration at startup
const { transporter } = require('./utils/emailService');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // Product routes
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Order routes
const reviewRoutes = require('./routes/reviewRoutes'); // Review routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Analytics routes

// Create Express app
const app = express();

// Use CORS middleware to allow frontend and backend communication
app.use(
  cors({
    origin: 'http://localhost:3000', // Update with your frontend URL if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Simple route to check if server is running
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Use routes for different paths
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes); // New review route
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // You might want to initialize analytics collection here
    // or create a default document for today if needed
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message); // Debug log for database errors
    process.exit(1);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email service configured with: ${process.env.EMAIL_USER}`);
  
  // Check if email credentials are present
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('WARNING: Email credentials not properly configured in environment variables');
  }
});