const asyncErrorBoundary = require('../../../shared/error/asyncErrorBoundary');
const service = require('./dashboard-analytics.service');
const { StatusCodes } = require('http-status-codes');
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require('../../../utils/helper/responseHelpers');

// Dashboard Analytics - Overview of all key metrics
// url with query params: /restaurants/:restaurantId/analytics/dashboard?period=weekly&start=2023-01-01&end=2023-01-31
const getDashboardAnalytics = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = 'weekly', start, end } = req.query;
  
  const dashboardData = await service.getDashboardAnalytics(
    Number(restaurantId), 
    { period, start, end }
  );
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Dashboard analytics retrieved successfully",
    {
      data: dashboardData,
      metadata: {
        generatedAt: new Date().toISOString(),
        type: 'dashboard',
        period,
        restaurantId: Number(restaurantId)
      }
    }
  );
};

module.exports = {
  getDashboardAnalytics: asyncErrorBoundary(getDashboardAnalytics)
};
