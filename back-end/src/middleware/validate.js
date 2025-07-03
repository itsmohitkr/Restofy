const { StatusCodes } = require("http-status-codes");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.query);
    if (error) {
      next({
        status: StatusCodes.BAD_REQUEST,
        message: error.details[0].message,
        error: "Validation Error"
      });
  }
  next();
};

module.exports = validate;
