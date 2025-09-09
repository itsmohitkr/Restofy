const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse } = require("../../utils/helper/responseHelpers");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.query);
    if (error) {
      // return next({
      //   status: StatusCodes.BAD_REQUEST,
      //   message: error.details[0].message,
      //   error: "Validation Error"
      // });
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        error.details[0].message,
        "Validation Error"
      );
  }
  next();
};

module.exports = validate;
