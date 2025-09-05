const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const { sendErrorResponse, sendSuccessResponse } = require("../../utils/helper/responseHelpers");
const analyticsService = require("./analytics.service");
const { StatusCodes } = require("http-status-codes");

const getAnalytics = async (req, res) => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
      return sendErrorResponse(res, StatusCodes.BAD_REQUEST, "restaurantId is required", "Params required");
  }

  const data = await analyticsService.getAnalytics(restaurantId);

  sendSuccessResponse(res, StatusCodes.OK, "Analytics fetched successfully", data);
};

module.exports = {
  getAnalytics: asyncErrorBoundary(getAnalytics),
};