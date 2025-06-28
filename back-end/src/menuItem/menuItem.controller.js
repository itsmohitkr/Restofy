const service = require('./menuItem.service');
const { StatusCodes } = require('http-status-codes');
const { successResponse } = require('../utils/responseBody');
const asyncErrorBoundary = require('../error/asyncErrorBoundary');

const createMenuItem = async (req, res) => {
  const menuItemData = req.body;
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: 'You do not have permission to perform operation for this restaurant',
      error: 'Permission Denied',
    });
  }
  const finalMenuItemData = {
    ...menuItemData,
    menuId: Number(req.params.menuId),
  };
  const newMenuItem = await service.createMenuItem(finalMenuItemData);
  const response = successResponse(StatusCodes.CREATED, 'Menu item created successfully', newMenuItem);
  res.status(StatusCodes.CREATED).json(response);
};

const getMenuItem = async (req, res) => {
  const menuItem = res.locals.menuItem;
  const response = successResponse(StatusCodes.OK, 'Menu item retrieved successfully', menuItem);
  res.status(StatusCodes.OK).json(response);
};

const updateMenuItem = async (req, res) => {
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: 'You do not have permission to perform operation for this restaurant',
      error: 'Permission Denied',
    });
  }
  const { menuItemId } = req.params;
  const menuItemData = req.body;
  const updatedMenuItem = await service.updateMenuItem(menuItemId, menuItemData);
  const response = successResponse(StatusCodes.OK, 'Menu item updated successfully', updatedMenuItem);
  res.status(StatusCodes.OK).json(response);
};

const deleteMenuItem = async (req, res) => {
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: 'You do not have permission to perform operation for this restaurant',
      error: 'Permission Denied',
    });
  }
  const { menuItemId } = req.params;
  await service.deleteMenuItem(menuItemId);
  const response = successResponse(StatusCodes.NO_CONTENT, 'Menu item deleted successfully');
  res.status(StatusCodes.NO_CONTENT).json(response);
};

const isValidMenuItemId = async (req, res, next) => {
  const { menuItemId } = req.params;
  const menuItem = await service.getMenuItem(menuItemId);
  if (!menuItem) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      message: 'Menu item not found',
      error: 'Not Found',
    });
  }
  res.locals.menuItem = menuItem;
  next();
};
const getAllMenuItems = async (req, res) => {
  const { menuId } = req.params;
  const menuItems = await service.getAllMenuItems(menuId);
  const response = successResponse(StatusCodes.OK, 'Menu items retrieved successfully', menuItems);
  res.status(StatusCodes.OK).json(response);
};

module.exports = {
  createMenuItem: asyncErrorBoundary(createMenuItem),
  getMenuItem: [isValidMenuItemId, asyncErrorBoundary(getMenuItem)],
  updateMenuItem: [isValidMenuItemId, asyncErrorBoundary(updateMenuItem)],
  deleteMenuItem: [isValidMenuItemId, asyncErrorBoundary(deleteMenuItem)],
  getAllMenuItems: asyncErrorBoundary(getAllMenuItems),
}; 