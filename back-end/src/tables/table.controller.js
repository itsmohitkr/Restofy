const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const service = require("./table.service");
const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/responseBody");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");

const createTable = async (req, res) => {
    console.log("Creating table with data:", req.body);
    
    const tableData = req.body;
    const tokenData = req.user;
    
    const restaurantData = res.locals.restaurant;

    if (restaurantData.ownerId == tokenData.ownerId) {
        tableData.restaurantId = restaurantData.restaurantId;
    } else {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to create a table for this restaurant",
            error: "Permission Denied"
        });
    }
    
    
    const newTable = await service.createTable(tableData);
    const response = successResponse(StatusCodes.CREATED, "Table created successfully", newTable);
    res.status(StatusCodes.CREATED).json(response);
}

const getAllTables = async (req, res) => {
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const restaurantData = res.locals.restaurant;
    if (restaurantData.ownerId !== ownerId) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to view tables for this restaurant",
            error: "Permission Denied"
        });
    }

    const restaurantId = restaurantData.restaurantId;
    const tables = await service.getAllTables(restaurantId);
    const response = successResponse(StatusCodes.OK, "Tables retrieved successfully", tables);
    res.status(StatusCodes.OK).json(response);
};

const getTable = async (req, res) => {
    const table = res.locals.table;
    const response = successResponse(StatusCodes.OK, "Table retrieved successfully", table);
    res.status(StatusCodes.OK).json(response);
};

const hasValidTableId = (req, res, next) => {
  const { tableId } = req.params;
  if (!tableId || isNaN(tableId)) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid table ID",
      error: "Validation Error"
    });
  }
  next();
};
const isTableExist = async (req, res, next) => {
    const { tableId } = req.params;
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const restaurantData = res.locals.restaurant;
    const restaurantId = restaurantData.restaurantId;
    if (restaurantData.ownerId !== ownerId) {
        return next({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to access this table",
            error: "Permission Denied"
        });
    }

    const table = await service.getTableById(tableId, restaurantId);
    
  if (!table) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "Table not found",
      error: "resource not found"
    });
  }
  res.locals.table = table;
  next();
};

const updateTable = async (req, res) => {
    const tableData = req.body;
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const { tableId } = req.params;
    const restaurantData = res.locals.restaurant;
    if (restaurantData.ownerId !== ownerId) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to update this table",
            error: "Permission Denied"
        });
    }
    tableData.restaurantId = restaurantData.restaurantId;
    
    const updatedTable = await service.updateTable(tableId, tableData);
    
    const response = successResponse(StatusCodes.OK, "Table updated successfully", updatedTable);
    res.status(StatusCodes.OK).json(response);
};

const deleteTable = async (req, res) => {
    const { tableId } = req.params;
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const restaurantData = res.locals.restaurant;
    if (restaurantData.ownerId !== ownerId) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to delete this table",
            error: "Permission Denied"
        });
    }
    const restaurantId = restaurantData.restaurantId;
    
    await service.deleteTable(tableId, restaurantId);
    
    const response = successResponse(StatusCodes.NO_CONTENT, "Table deleted successfully");
    res.status(StatusCodes.NO_CONTENT).json(response);
};

const getTableByTableType = async (req, res) => {
    const { tableType } = req.params;
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const restaurantData = res.locals.restaurant;

    if (restaurantData.ownerId !== ownerId) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to view tables of this type",
            error: "Permission Denied"
        });
    }

    const restaurantId = restaurantData.restaurantId;
    const tables = await service.getTableByTableType(tableType, restaurantId);
    
    const response = successResponse(StatusCodes.OK, "Tables retrieved successfully", tables);
    res.status(StatusCodes.OK).json(response);
};

module.exports = {
  createTable: asyncErrorBoundary(createTable),
  getAllTables: asyncErrorBoundary(getAllTables),
  getTable: [hasValidTableId, isTableExist, asyncErrorBoundary(getTable)],
  updateTable: [hasValidTableId, isTableExist, asyncErrorBoundary(updateTable)],
    deleteTable: [hasValidTableId, isTableExist, asyncErrorBoundary(deleteTable)],
  getTableByTableType
};  

