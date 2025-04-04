// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Basic analytics routes
router.get('/daily', analyticsController.getDaily);
router.get('/range', analyticsController.getRange);
router.get('/summary', analyticsController.getSummary);
router.post('/create-update', analyticsController.createOrUpdate);
router.patch('/update-field', analyticsController.updateField);

// Specific metrics routes
router.get('/products', analyticsController.getProductMetrics);
router.get('/customers', analyticsController.getCustomerMetrics);
router.get('/sales', analyticsController.getSalesMetrics);
router.get('/traffic', analyticsController.getTrafficInsights);

// Alerts routes
router.get('/alerts', analyticsController.getAlerts);
router.patch('/alerts/:analyticsId/:alertId/read', analyticsController.markAlertRead);
router.post('/alerts', analyticsController.addAlert);

module.exports = router;