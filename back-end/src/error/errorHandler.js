const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/responseBody");

function errorHandler(err, req, res, next) {
    const { status = StatusCodes.INTERNAL_SERVER_ERROR, message = "Internal Server Error" } = err;

    const response = errorResponse(status, message, err.error || null);
    res.status(status).json(response);

}

module.exports = errorHandler;