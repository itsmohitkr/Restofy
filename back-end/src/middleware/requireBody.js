const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse } = require("../utils/responseHelpers");

const requireBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Request body is required",
        "Request Body Missing"
      );
    }
    next();
}

module.exports = {requireBody};