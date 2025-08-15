const router = require("express").Router();
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");
// const { validateQuery } = require("../../shared/middleware/validateQuery");

// url: /restaurants/:restaurantId/analytics

const dashboardAnalyticsRouter = require("./dashboard-analytics/dashboard-analytics.router");

router.use(
  "/dashboard",
  requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),
  dashboardAnalyticsRouter
);  

module.exports = router;