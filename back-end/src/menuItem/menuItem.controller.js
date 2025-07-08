const service = require('./menuItem.service');
const { StatusCodes } = require('http-status-codes');
const { successResponse } = require('../utils/responseBody');
const asyncErrorBoundary = require('../error/asyncErrorBoundary');
const { validateParam } = require('../middleware/validateParam');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelpers');
const { requireBody } = require('../middleware/requireBody');

const createMenuItem = async (req, res) => {
  
  const menuItemData = {
    ...req.body,
    menuId: Number(req.params.menuId),
  };
  console.log('menuItemData', menuItemData);
  
  
  const item = await service.createMenuItem(menuItemData);
  return sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    'Menu item created successfully',
    item
  );
};

const getMenuItem = async (req, res) => {
  const {menuItem} = res.locals;
  return sendSuccessResponse(
    res,
    StatusCodes.OK,
    'Menu item retrieved successfully',
    menuItem
  );
};

const updateMenuItem = async (req, res) => {

  const { menuItemId } = req.params;  
  const { updatedAt, ...menuItemData } = {
    ...res.locals.menuItem,
    ...req.body
  };
  
  const updatedMenuItem = await service.updateMenuItem(menuItemId, menuItemData);

  return sendSuccessResponse(
    res,
    StatusCodes.OK,
    'Menu item updated successfully',
    updatedMenuItem
  );
};

const deleteMenuItem = async (req, res) => {
  
  const { menuItemId } = req.params;
  await service.deleteMenuItem(menuItemId);
  return sendSuccessResponse(
    res,
    StatusCodes.NO_CONTENT,
    'Menu item deleted successfully'
  );  

};

const isValidMenuItemId = async (req, res, next) => {
  const { menuItemId } = req.params;
  const menuItem = await service.getMenuItem(menuItemId);
  if (!menuItem) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Menu item not found with the given ID: ${menuItemId}`,
      'Not Found'
    );
  }
  res.locals.menuItem = menuItem;
  next();
};
const getAllMenuItems = async (req, res) => {
  const { itemName, itemType, itemCategory, itemStatus, itemRating } = req.query;

  const filter = {
    menuId: Number(req.params.menuId),
    ...(itemName && { itemName }),
    ...(itemType && { itemType }),
    ...(itemCategory && { itemCategory }),
    ...(itemStatus && { itemStatus }),
    ...(itemRating && { itemRating: Number(itemRating) })
  };
  
  const menuItems = await service.getAllMenuItems(filter);

  return sendSuccessResponse(
    res,
    StatusCodes.OK,
    'Menu items retrieved successfully',
    menuItems
  );
};

const updateField = async (req, res) => {
  const { menuItemId } = req.params;
  const updatedFields = req.body;

  const fieldNames = Object.keys(updatedFields);
  if (fieldNames.length > 1) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Only one field can be updated at a time.",
      "Bad request"
    );
  }

  const allowedFields = [
    "itemName",
    "itemDescription",
    "itemPrice",
    "itemImage",
    "itemCategory",
    "itemType",
    "itemStatus",
  ];

  const fieldName = fieldNames[0];

  if (!allowedFields.includes(fieldName)) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Field '${fieldName}' is not allowed to be updated.`
    );
  }

  const updateData = await service.updateField(
    menuItemId,
    fieldName,
    updatedFields[fieldName]
  );

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    `Field '${fieldName}' updated successfully.`,
    updateData
  );
};

module.exports = {
  createMenuItem: [validateParam("menuId"), asyncErrorBoundary(createMenuItem)],
  getMenuItem: [
    validateParam("menuId", "menuItemId"),
    isValidMenuItemId,
    asyncErrorBoundary(getMenuItem),
  ],
  updateMenuItem: [
    validateParam("menuId", "menuItemId"),
    isValidMenuItemId,
    asyncErrorBoundary(updateMenuItem),
  ],
  deleteMenuItem: [
    validateParam("menuId", "menuItemId"),
    isValidMenuItemId,
    asyncErrorBoundary(deleteMenuItem),
  ],
  getAllMenuItems: [asyncErrorBoundary(getAllMenuItems)],
  updateField: [
    validateParam("menuId", "menuItemId"),
    isValidMenuItemId,
    asyncErrorBoundary(updateField),
  ],
}; 