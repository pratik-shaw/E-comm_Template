// controllers/analyticsController.js
const Analytics = require('../models/Analytics');

// Helper function to handle errors
const handleError = (res, error) => {
  console.error('Error:', error);
  return res.status(500).json({ success: false, message: 'Server error', error: error.message });
};

const analyticsController = {
  // Get analytics for a specific date
  getDaily: async (req, res) => {
    try {
      const { date } = req.query;
      const queryDate = date ? new Date(date) : new Date();
      
      // Set time to beginning of the day
      queryDate.setHours(0, 0, 0, 0);
      
      const analytics = await Analytics.findOne({ 
        date: {
          $gte: queryDate,
          $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!analytics) {
        return res.status(404).json({ success: false, message: 'No analytics found for the specified date' });
      }

      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get analytics for a date range
  getRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Both startDate and endDate are required' });
      }

      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const analytics = await Analytics.find({
        date: {
          $gte: start,
          $lte: end
        }
      }).sort({ date: 1 });

      if (analytics.length === 0) {
        return res.status(404).json({ success: false, message: 'No analytics found for the specified date range' });
      }

      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get summary analytics (e.g., for dashboard)
  getSummary: async (req, res) => {
    try {
      const { period } = req.query; // 'daily', 'weekly', 'monthly'
      
      let startDate = new Date();
      
      switch (period) {
        case 'weekly':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default: // daily
          startDate.setDate(startDate.getDate() - 1);
      }
      
      startDate.setHours(0, 0, 0, 0);
      
      const analytics = await Analytics.find({
        date: { $gte: startDate }
      }).sort({ date: 1 });
      
      // Prepare summary data
      const summary = {
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        bestSellingProducts: [],
        lowStockProducts: [],
        topLocations: [],
        paymentMethodBreakdown: []
      };
      
      // Aggregate data from all analytics documents
      analytics.forEach(doc => {
        summary.totalSales += doc.sales.daily;
        summary.totalOrders += doc.orders.total;
        summary.totalCustomers += doc.customers.new;
        
        // Add best sellers if not already in the list
        doc.bestSellers.forEach(product => {
          const existingProduct = summary.bestSellingProducts.find(p => p.productId.toString() === product.productId.toString());
          if (existingProduct) {
            existingProduct.unitsSold += product.unitsSold;
            existingProduct.revenue += product.revenue;
          } else {
            summary.bestSellingProducts.push({
              productId: product.productId,
              name: product.name,
              unitsSold: product.unitsSold,
              revenue: product.revenue
            });
          }
        });
        
        // Add low stock products
        doc.lowStock.forEach(product => {
          if (!summary.lowStockProducts.some(p => p.productId.toString() === product.productId.toString())) {
            summary.lowStockProducts.push(product);
          }
        });
        
        // Aggregate top locations
        doc.topLocations.forEach(location => {
          const existingLocation = summary.topLocations.find(l => l.location === location.location);
          if (existingLocation) {
            existingLocation.orderCount += location.orderCount;
          } else {
            summary.topLocations.push({
              location: location.location,
              orderCount: location.orderCount
            });
          }
        });
        
        // Aggregate payment methods
        doc.paymentMethods.forEach(method => {
          const existingMethod = summary.paymentMethodBreakdown.find(m => m.method === method.method);
          if (existingMethod) {
            existingMethod.count += method.count;
            existingMethod.amount += method.amount;
          } else {
            summary.paymentMethodBreakdown.push({
              method: method.method,
              count: method.count,
              amount: method.amount
            });
          }
        });
      });
      
      // Calculate averages if there are orders
      if (summary.totalOrders > 0) {
        summary.averageOrderValue = summary.totalSales / summary.totalOrders;
      }
      
      // Sort best selling products by units sold
      summary.bestSellingProducts.sort((a, b) => b.unitsSold - a.unitsSold);
      
      // Only keep top 5 best sellers
      summary.bestSellingProducts = summary.bestSellingProducts.slice(0, 5);
      
      // Sort top locations by order count
      summary.topLocations.sort((a, b) => b.orderCount - a.orderCount);
      
      // Only keep top 5 locations
      summary.topLocations = summary.topLocations.slice(0, 5);
      
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Create or update analytics for a specific date
  createOrUpdate: async (req, res) => {
    try {
      const { date, ...analyticsData } = req.body;
      
      const queryDate = date ? new Date(date) : new Date();
      queryDate.setHours(0, 0, 0, 0);
      
      // Find and update or create new analytics entry
      const analytics = await Analytics.findOneAndUpdate(
        { 
          date: {
            $gte: queryDate,
            $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        { ...analyticsData },
        { new: true, upsert: true }
      );
      
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Update specific fields in analytics data
  updateField: async (req, res) => {
    try {
      const { date, field, value } = req.body;
      
      if (!date || !field) {
        return res.status(400).json({ success: false, message: 'Date and field are required' });
      }
      
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      
      // Create update object with nested fields
      const updateObj = {};
      updateObj[field] = value;
      
      const analytics = await Analytics.findOneAndUpdate(
        { 
          date: {
            $gte: queryDate,
            $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        { $set: updateObj },
        { new: true, upsert: true }
      );
      
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get product performance metrics
  getProductMetrics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      const analytics = await Analytics.find({
        date: {
          $gte: start,
          $lte: end
        }
      });
      
      // Aggregate product views and sales
      const productMetrics = {
        views: {},
        sales: {},
        returnRates: {}
      };
      
      analytics.forEach(doc => {
        // Product views
        doc.productViews.forEach(product => {
          const productId = product.productId.toString();
          if (!productMetrics.views[productId]) {
            productMetrics.views[productId] = {
              productId,
              name: product.name,
              totalViews: 0
            };
          }
          productMetrics.views[productId].totalViews += product.views;
        });
        
        // Product sales
        doc.bestSellers.forEach(product => {
          const productId = product.productId.toString();
          if (!productMetrics.sales[productId]) {
            productMetrics.sales[productId] = {
              productId,
              name: product.name,
              unitsSold: 0,
              revenue: 0
            };
          }
          productMetrics.sales[productId].unitsSold += product.unitsSold;
          productMetrics.sales[productId].revenue += product.revenue;
        });
      });
      
      // Convert objects to arrays
      const result = {
        productViews: Object.values(productMetrics.views),
        productSales: Object.values(productMetrics.sales)
      };
      
      // Sort by views and sales
      result.productViews.sort((a, b) => b.totalViews - a.totalViews);
      result.productSales.sort((a, b) => b.unitsSold - a.unitsSold);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get customer metrics
  getCustomerMetrics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      const analytics = await Analytics.find({
        date: {
          $gte: start,
          $lte: end
        }
      }).sort({ date: 1 });
      
      // Aggregate customer data over time
      const customerMetrics = {
        newCustomers: 0,
        returningCustomers: 0,
        totalCustomers: 0,
        dailyData: []
      };
      
      analytics.forEach(doc => {
        customerMetrics.newCustomers += doc.customers.new;
        customerMetrics.returningCustomers += doc.customers.returning;
        
        customerMetrics.dailyData.push({
          date: doc.date,
          new: doc.customers.new,
          returning: doc.customers.returning,
          total: doc.customers.total
        });
      });
      
      customerMetrics.totalCustomers = customerMetrics.newCustomers + customerMetrics.returningCustomers;
      
      res.status(200).json({ success: true, data: customerMetrics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get sales metrics
  getSalesMetrics: async (req, res) => {
    try {
      const { startDate, endDate, groupBy } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      const analytics = await Analytics.find({
        date: {
          $gte: start,
          $lte: end
        }
      }).sort({ date: 1 });
      
      // Initialize metrics
      const salesMetrics = {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        salesByTime: []
      };
      
      // Group data
      if (groupBy === 'hour' && analytics.length > 0) {
        // Get hourly sales distribution
        const hourlyData = Array(24).fill().map((_, i) => ({
          hour: i,
          orders: 0,
          revenue: 0
        }));
        
        analytics.forEach(doc => {
          doc.hourlyActivity.forEach(activity => {
            hourlyData[activity.hour].orders += activity.orders;
            hourlyData[activity.hour].revenue += activity.revenue;
          });
        });
        
        salesMetrics.salesByTime = hourlyData;
      } else {
        // Group by day (default)
        analytics.forEach(doc => {
          salesMetrics.salesByTime.push({
            date: doc.date,
            sales: doc.sales.daily,
            orders: doc.orders.total
          });
        });
      }
      
      // Calculate totals
      analytics.forEach(doc => {
        salesMetrics.totalSales += doc.sales.daily;
        salesMetrics.totalOrders += doc.orders.total;
      });
      
      // Calculate average order value
      if (salesMetrics.totalOrders > 0) {
        salesMetrics.averageOrderValue = salesMetrics.totalSales / salesMetrics.totalOrders;
      }
      
      // Calculate average conversion rate
      if (analytics.length > 0) {
        let totalConversionRate = 0;
        let dataPointsWithConversion = 0;
        
        analytics.forEach(doc => {
          if (doc.conversionRate > 0) {
            totalConversionRate += doc.conversionRate;
            dataPointsWithConversion++;
          }
        });
        
        if (dataPointsWithConversion > .0) {
          salesMetrics.conversionRate = totalConversionRate / dataPointsWithConversion;
        }
      }
      
      res.status(200).json({ success: true, data: salesMetrics });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get unread alerts
  getAlerts: async (req, res) => {
    try {
      const { read } = req.query;
      let filter = {};
      
      if (read === 'false') {
        filter = { 'alerts.isRead': false };
      } else if (read === 'true') {
        filter = { 'alerts.isRead': true };
      }
      
      // Get the latest analytics document with unread alerts
      const latestAnalytics = await Analytics.find(filter)
        .sort({ date: -1 })
        .limit(5);
      
      if (!latestAnalytics || latestAnalytics.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }
      
      // Extract all alerts
      const allAlerts = [];
      latestAnalytics.forEach(doc => {
        doc.alerts.forEach(alert => {
          allAlerts.push({
            ...alert.toObject(),
            analyticsId: doc._id,
            date: doc.date
          });
        });
      });
      
      // Sort by creation date and read status
      allAlerts.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      });
      
      res.status(200).json({ success: true, data: allAlerts });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Mark alert as read
  markAlertRead: async (req, res) => {
    try {
      const { analyticsId, alertId } = req.params;
      
      const analytics = await Analytics.findById(analyticsId);
      
      if (!analytics) {
        return res.status(404).json({ success: false, message: 'Analytics data not found' });
      }
      
      const alertIndex = analytics.alerts.findIndex(alert => alert._id.toString() === alertId);
      
      if (alertIndex === -1) {
        return res.status(404).json({ success: false, message: 'Alert not found' });
      }
      
      analytics.alerts[alertIndex].isRead = true;
      await analytics.save();
      
      res.status(200).json({ success: true, message: 'Alert marked as read' });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Add a new alert
  addAlert: async (req, res) => {
    try {
      const { date, type, message, severity } = req.body;
      
      if (!type || !message || !severity) {
        return res.status(400).json({ success: false, message: 'Type, message, and severity are required' });
      }
      
      const queryDate = date ? new Date(date) : new Date();
      queryDate.setHours(0, 0, 0, 0);
      
      // Find the analytics document for the date
      let analytics = await Analytics.findOne({ 
        date: {
          $gte: queryDate,
          $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });
      
      // If no document exists, create one
      if (!analytics) {
        analytics = new Analytics({ date: queryDate });
      }
      
      // Add the alert
      analytics.alerts.push({
        type,
        message,
        severity,
        isRead: false,
        createdAt: new Date()
      });
      
      await analytics.save();
      
      res.status(201).json({ success: true, message: 'Alert added', data: analytics.alerts[analytics.alerts.length - 1] });
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get traffic insights
  getTrafficInsights: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      const analytics = await Analytics.find({
        date: {
          $gte: start,
          $lte: end
        }
      }).sort({ date: 1 });
      
      // Initialize traffic metrics
      const trafficInsights = {
        totalVisits: 0,
        sourceBreakdown: {
          direct: 0,
          social: 0,
          organic: 0,
          referral: 0,
          email: 0,
          other: 0
        },
        dailyVisits: []
      };
      
      // Aggregate data
      analytics.forEach(doc => {
        trafficInsights.totalVisits += doc.traffic.totalVisits;
        
        // Add daily visits
        trafficInsights.dailyVisits.push({
          date: doc.date,
          visits: doc.traffic.totalVisits
        });
        
        // Aggregate traffic sources
        doc.traffic.sources.forEach(source => {
          trafficInsights.sourceBreakdown[source.source] += source.count;
        });
      });
      
      res.status(200).json({ success: true, data: trafficInsights });
    } catch (error) {
      handleError(res, error);
    }
  }
};

module.exports = analyticsController;