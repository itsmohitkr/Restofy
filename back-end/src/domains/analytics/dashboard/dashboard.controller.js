const asyncErrorBoundary = require("../../../shared/error/asyncErrorBoundary");
const service = require("./dashboard.service");
const { StatusCodes } = require("http-status-codes");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../../utils/helper/responseHelpers");

/**
 * Get comprehensive dashboard analytics
 */
const getDashboardAnalytics = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = 'weekly', start, end, includeComparisons = true, includeTrends = true } = req.query;
  
  const dashboardData = await service.getDashboardAnalytics(
    Number(restaurantId), 
    { period, start, end, includeComparisons, includeTrends }
  );
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Dashboard analytics retrieved successfully",
    dashboardData
  );
};

/**
 * Get dashboard summary - quick overview metrics
 */
const getDashboardSummary = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = 'weekly', start, end } = req.query;
  
  const summaryData = await service.getDashboardSummary(
    Number(restaurantId), 
    { period, start, end }
  );
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Dashboard summary retrieved successfully",
    summaryData
  );
};

/**
 * Get dashboard KPIs - Key Performance Indicators
 */
const getDashboardKPIs = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = 'weekly', start, end } = req.query;
  
  const kpiData = await service.getDashboardKPIs(
    Number(restaurantId), 
    { period, start, end }
  );
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Dashboard KPIs retrieved successfully",
    kpiData
  );
};

/**
 * Get dashboard alerts - Important notifications
 */
const getDashboardAlerts = async (req, res) => {
  const { restaurantId } = req.params;
  
  const alertsData = await service.getDashboardAlerts(Number(restaurantId));
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Dashboard alerts retrieved successfully",
    alertsData
  );
};

module.exports = {
  getDashboardAnalytics: asyncErrorBoundary(getDashboardAnalytics),
  getDashboardSummary: asyncErrorBoundary(getDashboardSummary),
  getDashboardKPIs: asyncErrorBoundary(getDashboardKPIs),
  getDashboardAlerts: asyncErrorBoundary(getDashboardAlerts),
};
