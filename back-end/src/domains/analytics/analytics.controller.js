const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const analyticsService = require("./analytics.service");

const getAnalytics = async (req, res) => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
    return res.status(400).json({ status: 400, message: "restaurantId is required" });
  }

  const data = await analyticsService.getAnalytics(restaurantId);

  res.json({
    status: 200,
    message: "Analytics fetched successfully",
    data,
  });
};

module.exports = {
  getAnalytics: asyncErrorBoundary(getAnalytics),
};