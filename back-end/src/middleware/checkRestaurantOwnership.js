const { StatusCodes } = require("http-status-codes");

const checkRestaurantOwnership = (req, res, next) => {
  const ownerId = req.user.ownerId; // coming from the jwt token
    const restaurantData = res.locals.restaurant;
    
  if (!restaurantData || restaurantData.ownerId !== ownerId) {
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
