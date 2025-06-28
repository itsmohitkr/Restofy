const service = require("./menu.service");
const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/responseBody");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");

const createMenu = async (req, res) => {
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message:
        "You do not have permission to create a menu for this restaurant",
      error: "Permission Denied",
    });
  }
  const { restaurantId } = restaurantData;
  const menuData = {
    restaurantId: restaurantId,
  };

  const newMenu = await service.createMenu(menuData);
  const response = successResponse(
    StatusCodes.CREATED,
    "Menu created successfully",
    newMenu
  );
  res.status(StatusCodes.CREATED).json(response);
};

const getMenu = async (req, res) => {
  const menu = res.locals.menu;
  const response = successResponse(
    StatusCodes.OK,
    "Menu retrieved successfully",
    menu
  );
  res.status(StatusCodes.OK).json(response);
};

const deleteMenu = async (req, res) => {
  const menu = res.locals.menu;
  await service.deleteMenu(menu.id);
  const response = successResponse(
    StatusCodes.NO_CONTENT,
    "Menu deleted successfully"
  );
  res.status(StatusCodes.NO_CONTENT).json(response);
};
const isMenuExists = async (req, res, next) => {
  const { menuId } = req.params;
  const menu = await service.getMenu(menuId);
  if (!menu) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      message: "Menu not found with the given ID",
      error: "Not Found",
    });
  }
  res.locals.menu = menu;
  next();
};
module.exports = {
  createMenu: asyncErrorBoundary(createMenu),
  getMenu: [isMenuExists, asyncErrorBoundary(getMenu)],
  deleteMenu: [isMenuExists, asyncErrorBoundary(deleteMenu)],
  isMenuExists: asyncErrorBoundary(isMenuExists),
};
