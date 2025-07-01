const { StatusCodes } = require("http-status-codes");

/**
 * Returns middleware that checks if the given param(s) exist and are numeric.
 * @param {...string} paramNames - The names of the params to validate.
 */
const validateParam = (...paramNames) => (req, res, next) => {
  for (const param of paramNames) {
    const value = req.params[param];
    if (!value || isNaN(value)) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: `Invalid ${param}`,
        error: "Validation Error",
      });
    }
  }
  next();
};

module.exports = { validateParam };
