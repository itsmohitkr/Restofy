const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/responseHelpers");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const service = require("./user.service");
const { successResponse } = require("../utils/responseBody");
const { validateParam } = require("../middleware/validateParam");

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role = "Staff",
    address,
  } = req.body;
  const { street, city, state, country, pinCode, landmark } = address || {};
  const { restaurantId } = req.params;

  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new owner
  const newUser = {
    ...req.body,
    password: hashedPassword,
    role,
    restaurantId: Number(restaurantId),
    addedByUserId: req.userId,
    ...(address && {
      address: {
        create: {
          street,
          city,
          state,
          country,
          pinCode,
          landmark,
        },
      },
    }),
  };

  const createdUser = await service.create(newUser);

  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "User created successfully",
    createdUser
  );
};
const getUser = async (req, res) => {
  const user = res.locals.user;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "User retrieved successfully",
    user
  );
};
const updateUser = async (req, res) => {
  // Logic to update a user by ID
  const userId = req.params.userId;
  res
    .status(200)
    .json({ message: `User with ID ${userId} updated successfully` });
};
const deleteUser = async (req, res) => {
  // Logic to delete a user by ID
  const userId = req.params.userId;
  res
    .status(200)
    .json({ message: `User with ID ${userId} deleted successfully` });
};
const getAllUsers = async (req, res) => {
  console.log("Fetching all users for restaurant:", req.params.restaurantId);
  
  const restaurant = res.locals.restaurant;
  const users = await service.getAllUsers(restaurant.restaurantId, req.userId);
  if (!users) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "No users found for this restaurant"
    );
  }
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Users retrieved successfully",
    users
  );
};
const isUserExists = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await service.read(userId, res.locals.restaurant.restaurantId);
  if (!user) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "User not found"
    );
  }
  res.locals.user = user;
  next();
};

module.exports = {
  createUser: [asyncErrorBoundary(createUser)],
  getUser: [validateParam("userId"), isUserExists, asyncErrorBoundary(getUser)],
  updateUser: [validateParam("userId"), isUserExists, asyncErrorBoundary(updateUser)],
  deleteUser: [validateParam("userId"), isUserExists, asyncErrorBoundary(deleteUser)],
  getAllUsers: [asyncErrorBoundary(getAllUsers)],
};
