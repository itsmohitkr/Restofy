const express = require('express');
const router = express.Router();
const controller = require('./dashboard-analytics.controller');
const requirePermission = require('../../../shared/middleware/requirePermission');
const { PERMISSIONS } = require('../../../utils/constants/permissions');
const methodNotAllowed = require('../../../shared/error/methodNotAllowed');

// GET /restaurants/:restaurantId/analytics/dashboard
router
  .route('/')
  .get(
    controller.getDashboardAnalytics
  )
  .all(methodNotAllowed);

module.exports = router;
