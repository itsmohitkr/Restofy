const { StatusCodes } = require("http-status-codes");

const checkRestaurantOwnership = (req, res, next) => {
  const restaurantData = res.locals.restaurant;
  let userId= req.user.id;
  if (req.user.role === "Staff") {
      userId = req.user.addedByUserId;
  }
  
  if (!restaurantData || restaurantData.userId !== userId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: "You do not have permission to access this restaurant",
      error: "Permission Denied",
    });
  }
    // Attach restaurant data to the request object for further processing
    req.restaurantId = restaurantData.restaurantId;
  next();
};

module.exports = { checkRestaurantOwnership };
