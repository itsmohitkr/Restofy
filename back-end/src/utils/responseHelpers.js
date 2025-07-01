const { successResponse, errorResponse } = require("./responseBody");

const sendSuccessResponse = (res, status, message, data) => {
  return res.status(status).json(successResponse(status, message, data));
};

const sendErrorResponse = (res, status, message, error) => {
  return res.status(status).json(errorResponse(status, message, error));
}

module.exports = { sendSuccessResponse, sendErrorResponse };
