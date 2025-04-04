// models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Daily metrics
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },

  // Sales metrics
  sales: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 }
  },
  orders: {
    total: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    refunded: { type: Number, default: 0 }
  },
  
  // Product metrics
  productViews: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    views: { type: Number, default: 0 }
  }],
  bestSellers: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    unitsSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }],
  lowStock: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    currentStock: { type: Number, default: 0 },
    threshold: { type: Number, default: 5 }
  }],
  returnRate: { type: Number, default: 0 }, // Percentage

  // Customer metrics
  customers: {
    new: { type: Number, default: 0 },
    returning: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  // Order metrics
  averageOrderValue: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 }, // Percentage
  
  // Location data
  topLocations: [{
    location: String,
    orderCount: { type: Number, default: 0 }
  }],
  
  // Sales trends
  hourlyActivity: [{
    hour: { type: Number, min: 0, max: 23 }, // 0-23 hours
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }],
  
  // Payment metrics
  paymentMethods: [{
    method: String,
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  }],
  transactions: {
    successful: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  
  // Traffic insights
  traffic: {
    totalVisits: { type: Number, default: 0 },
    sources: [{
      source: { type: String, enum: ['direct', 'social', 'organic', 'referral', 'email', 'other'] },
      count: { type: Number, default: 0 }
    }]
  },
  
  // Alerts
  alerts: [{
    type: { type: String, enum: ['lowStock', 'highCancellations', 'paymentIssues', 'trafficSpike', 'other'] },
    message: String,
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Create index for faster querying by date ranges
analyticsSchema.index({ date: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
