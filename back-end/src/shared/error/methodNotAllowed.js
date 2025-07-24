const { StatusCodes } = require("http-status-codes");

const methodNotAllowed = (req, res,next) => {
    const { method } = req.method;
    next({
        status: StatusCodes.METHOD_NOT_ALLOWED,
        message: `Method ${method} not allowed on ${req.originalUrl}`,
        error: "Method Not Allowed"
    })
}

module.exports = methodNotAllowed;