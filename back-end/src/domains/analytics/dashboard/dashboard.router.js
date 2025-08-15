const router = require("express").Router();
const methodNotAllowed = require("../../../shared/error/methodNotAllowed");
const requirePermission = require("../../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../../utils/constants/permissions");
const { validateQuery } = require("../../../shared/middleware/validateQuery");
const { dashboardQuerySchema } = require("../shared/analytics.validation");
const controller = require("./dashboard.controller");

// url: /restaurants/:restaurantId/analytics/dashboard

/**
 * Dashboard Analytics Routes
 * GET /restaurants/:restaurantId/analytics/dashboard
 * 
 * Query Parameters:
 * - period: daily, weekly, monthly, quarterly, yearly, custom
 * - start: Start date (required if period is custom)
 * - end: End date (required if period is custom)
 * - includeComparisons: Include comparison with previous period
 * - includeTrends: Include trend analysis
 * 
 * Example: GET /restaurants/1/analytics/dashboard?period=monthly&includeComparisons=true
 */
router
  .route("/")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),
    validateQuery(dashboardQuerySchema),
    controller.getDashboardAnalytics
  )
  .all(methodNotAllowed);

/**
 * Dashboard Summary - Quick overview metrics
 * GET /restaurants/:restaurantId/analytics/dashboard/summary
 */
router
  .route("/summary")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),
    validateQuery(dashboardQuerySchema),
    controller.getDashboardSummary
  )
  .all(methodNotAllowed);

/**
 * Dashboard KPIs - Key Performance Indicators
 * GET /restaurants/:restaurantId/analytics/dashboard/kpis
 */
router
  .route("/kpis")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),
    validateQuery(dashboardQuerySchema),
    controller.getDashboardKPIs
  )
  .all(methodNotAllowed);

/**
 * Dashboard Alerts - Important notifications and alerts
 * GET /restaurants/:restaurantId/analytics/dashboard/alerts
 */
router
  .route("/alerts")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),
    controller.getDashboardAlerts
  )
  .all(methodNotAllowed);

module.exports = router;
