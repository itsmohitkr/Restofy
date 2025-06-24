const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const {successResponse} = require("../utils/responseBody");
const service = require("./restaurant.service");
const {StatusCodes} = require("http-status-codes");

const createRestaurant = async (req, res) => {
    const newRestaurant = await service.createRestaurant(req.body);
    const response = successResponse(StatusCodes.CREATED, "Restaurant created successfully", newRestaurant);
    res.status(201).json(response);
};

const getRestaurant = async (req, res) => {
    const restaurant =   res.locals.restaurant;
    const response = successResponse(StatusCodes.OK, "Restaurant retrieved successfully", restaurant);
    res.status(StatusCodes.OK).json(response);
}

const updateRestaurant = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const restaurantData = req.body;
     const updatedDate = {
       ...res.locals.restaurant,
       ...restaurantData,
     };
    const updatedRestaurant = await service.updateRestaurant(
      restaurantId,
      updatedDate
    );
    
    const response = successResponse(StatusCodes.OK, "Restaurant updated successfully", updatedRestaurant);
    res.status(StatusCodes.OK).json(response);
};

const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    await service.deleteRestaurant(restaurantId);
    const response = successResponse(StatusCodes.NO_CONTENT, "Restaurant deleted successfully");
    res.status(StatusCodes.NO_CONTENT).json(response);
};

const getAllRestaurants = async (req, res) => {
    const restaurants = await service.getAllRestaurants();
    const response = successResponse(StatusCodes.OK, "Restaurants retrieved successfully", restaurants);
    res.status(StatusCodes.OK).json(response);
};


const hasValidRestaurantId = (req, res, next) => {
  const { restaurantId } = req.params;
  if (!restaurantId || isNaN(restaurantId)) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid restaurant ID",
      error: "Validation Error",
    });
  }
  next();
};

const isRestaurantExist = async (req, res, next) => {
  const { restaurantId } = req.params;
  const restaurant = await service.getRestaurant(restaurantId);
  if (!restaurant) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: `Restaurant with ID ${restaurantId} not found`,
      error: "Resource Not Found",
    });
  }
  res.locals.restaurant = restaurant;
  next();
};

module.exports = {
  createRestaurant:asyncErrorBoundary(createRestaurant),
  getRestaurant: [hasValidRestaurantId, isRestaurantExist, asyncErrorBoundary(getRestaurant)],
  updateRestaurant: [hasValidRestaurantId, isRestaurantExist, asyncErrorBoundary(updateRestaurant)],
  deleteRestaurant: [hasValidRestaurantId, isRestaurantExist, asyncErrorBoundary(deleteRestaurant)],
  getAllRestaurants:asyncErrorBoundary(getAllRestaurants),
};

