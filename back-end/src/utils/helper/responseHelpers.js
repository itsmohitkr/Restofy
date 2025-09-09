const { successResponse, errorResponse } = require("./responseBody");

const sendSuccessResponse = (res, status, message, data) => {
  return res.status(status).json(successResponse(message, data));
};

const sendErrorResponse = (res, status, message, error) => {
  return res.status(status).json(errorResponse(message, error));
}

module.exports = { sendSuccessResponse, sendErrorResponse };
