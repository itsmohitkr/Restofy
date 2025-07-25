const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const service = require("./restaurant.service");
const { StatusCodes } = require("http-status-codes");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/helper/responseHelpers");
const { requireBody } = require("../../shared/middleware/requireBody");
const { validateParam } = require("../../shared/middleware/validateParam");

const createRestaurant = async (req, res) => {
  
  const finalRestaurantData = {
    ...req.body,
    userId: req.userId,
  };
  
  const newRestaurant = await service.createRestaurant(finalRestaurantData);
  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "Restaurant created successfully",
    newRestaurant
  );
};

const getRestaurant = async (req, res) => {
  const restaurant = res.locals.restaurant;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Restaurant retrieved successfully",
    restaurant
  );
};

const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
    const restaurantData = req.body;

  const updatedRestaurant = await service.updateRestaurant(
    restaurantId,
    restaurantData,
    req.userId
  );
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Restaurant updated successfully",
    updatedRestaurant
  );
};

const deleteRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  await service.deleteRestaurant(restaurantId, req.userId);
  sendSuccessResponse(
    res,
    StatusCodes.NO_CONTENT,
    "Restaurant deleted successfully",
    null
  );
};

const getAllRestaurants = async (req, res) => {
    const restaurants = await service.getAllRestaurants(req.userId);
    
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Restaurants retrieved successfully",
    restaurants
  );
};

const isRestaurantExist = async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await service.getRestaurant(restaurantId, req.userId);
  if (!restaurant) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: `Restaurant not found with ID: ${restaurantId}`,
      error: "Resource Not Found",
    });
  }
  res.locals.restaurant = restaurant;
  next();
};

module.exports = {
  createRestaurant: [requireBody, asyncErrorBoundary(createRestaurant)],
  getRestaurant: [
    validateParam("restaurantId"),
    isRestaurantExist,
    asyncErrorBoundary(getRestaurant),
  ],
  updateRestaurant: [
    requireBody,
    validateParam("restaurantId"),
    isRestaurantExist,
    asyncErrorBoundary(updateRestaurant),
  ],
  deleteRestaurant: [
    validateParam("restaurantId"),
    isRestaurantExist,
    asyncErrorBoundary(deleteRestaurant),
  ],
  getAllRestaurants: asyncErrorBoundary(getAllRestaurants),
  isRestaurantExist: asyncErrorBoundary(isRestaurantExist),
};
