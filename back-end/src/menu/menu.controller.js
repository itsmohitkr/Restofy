const service = require("./menu.service");
const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/responseBody");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/responseHelpers");
const { validateParam } = require("../middleware/validateParam");

// url: /restaurant/:restaurantId/menu
const createMenu = async (req, res) => {
  
  const menuData = {
    restaurantId: req.restaurantId,
  };  
  const isMenuExists = await service.getMenuByRestaurantId(req.restaurantId);
  if (isMenuExists) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Menu already exists for this restaurant, start adding items to the menu",
      "Bad Request"
    );
  }
  const newMenu = await service.createMenu(menuData);
  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "Menu created successfully",
    newMenu
  );
};

const getMenu = async (req, res) => {
  const menu = res.locals.menu;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Menu retrieved successfully",
    menu
  );
};

const deleteMenu = async (req, res) => {
  const menu = res.locals.menu;
  await service.deleteMenu(menu.id);
  sendSuccessResponse(
    res,
    StatusCodes.NO_CONTENT,
    "Menu deleted successfully"
  );
};
const isMenuExists = async (req, res, next) => {
  const { menuId } = req.params;
  const menu = await service.getMenu(menuId);
  if (!menu) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Menu not found with the given ID: ${menuId}`,
      "Not Found"
    );
  }
  res.locals.menu = menu;
  next();
};
module.exports = {
  createMenu: asyncErrorBoundary(createMenu),
  getMenu: [validateParam("menuId"),isMenuExists, asyncErrorBoundary(getMenu)],
  deleteMenu: [validateParam("menuId"), isMenuExists, asyncErrorBoundary(deleteMenu)],
  isMenuExists: asyncErrorBoundary(isMenuExists),
};
