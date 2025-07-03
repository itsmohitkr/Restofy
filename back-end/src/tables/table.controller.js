const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const service = require("./table.service");
const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/responseBody");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/responseHelpers");
const { validateParam } = require("../middleware/validateParam");
const { boolean } = require("joi");

const createTable = async (req, res) => {
  const tableData = {
    ...req.body,
    restaurantId: req.restaurantId,
  };

  if (tableData.tableStatus !== "Available") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table status must be 'Available' when creating a new table",
      "Invalid Table Status"
    );
  }
  const newTable = await service.createTable(tableData);
  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "Table created successfully",
    newTable
  );
};

const getAllTables = async (req, res) => {
  const { tableName, tableStatus, tableCapacity, tableType } = req.query;
  const filter = {
    restaurantId: Number(req.restaurantId),
    ...(tableName && { tableName }),
    ...(tableStatus && { tableStatus }),
    ...(tableCapacity && { tableCapacity: Number(tableCapacity) }),
    ...(tableType && { tableType }),
  };

  const tables = await service.getAllTables(filter);
  if (tables.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "No tables found matching the criteria",
      "No Tables Found"
    );
  }
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Tables retrieved successfully",
    tables
  );
};

const getTable = async (req, res) => {
  const table = res.locals.table;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Table retrieved successfully",
    table
  );
};

const updateTable = async (req, res) => {
  const { tableId } = req.params;
  const restaurantId = req.restaurantId;
  const tableData = { ...req.body, restaurantId };

  const updatedTable = await service.updateTable(tableId, tableData);

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Table updated successfully",
    updatedTable
  );
};

const deleteTable = async (req, res) => {
  const { tableId } = req.params;
  await service.deleteTable(tableId, req.restaurantId);
  sendSuccessResponse(
    res,
    StatusCodes.NO_CONTENT,
    "Table deleted successfully",
    null
  );
};
const searchTablesByKeyword = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Keyword query parameter is required",
      "Missing Keyword"
    );
  }

  const tables = await service.searchTablesByKeyword(keyword, req.restaurantId);

  if (tables.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "No tables found matching the keyword",
      "No Tables Found"
    );
  }

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Tables retrieved successfully",
    tables
  );
};



const isTableExist = async (req, res, next) => {
  const { tableId } = req.params;
  const table = await service.getTableById(tableId, req.restaurantId);

  if (!table) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: `Table not found with ID: ${tableId}`,
      error: "Resource Not Found",
    });
  }
  res.locals.table = table;
  next();
};
const hasUniqueTableName = async (req, res, next) => {
  const { tableName } = req.body;

  const existingTable = await service.getTableByName(
    tableName,
    req.restaurantId
  );
  if (existingTable) {
    return next({
      status: StatusCodes.CONFLICT,
      message: `Table with name "${tableName}" already exists in this restaurant.`,
      error: "Conflict",
    });
  }
  next();
};
module.exports = {
  createTable: [hasUniqueTableName, asyncErrorBoundary(createTable)],
  getAllTables: asyncErrorBoundary(getAllTables),
  getTable: [
    validateParam("tableId"),
    isTableExist,
    asyncErrorBoundary(getTable),
  ],
  updateTable: [
    validateParam("tableId"),
    isTableExist,
    asyncErrorBoundary(updateTable),
  ],
  deleteTable: [
    validateParam("tableId"),
    isTableExist,
    asyncErrorBoundary(deleteTable),
  ],
  searchTablesByKeyword: [asyncErrorBoundary(searchTablesByKeyword)],
  isTableExist,

};
