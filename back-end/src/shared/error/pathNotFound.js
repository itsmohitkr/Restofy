
const pathNotFound = (req, res, next) => {
    next({
        status: 404,
        message: `Path ${req.originalUrl} not found`,
        error: "Not Found"
    })
}

module.exports = pathNotFound;