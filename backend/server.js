const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // For CORS handling

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // Product routes
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes'); // New order routes

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Use CORS middleware to allow frontend and backend communication
app.use(
  cors({
    origin: 'http://localhost:3000', // Update with your frontend URL if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use routes for different paths
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Product route
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); // New order route

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message); // Debug log for database errors
    process.exit(1);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));