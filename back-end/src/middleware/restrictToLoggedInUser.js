const { StatusCodes } = require("http-status-codes");
const { getUserFromToken } = require("./tokenService");

const restrictToAuthenticatedUser = (req, res, next) => {
    const token = req.cookies?.token;    

    if (!token) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: "You must be logged in to access this resource",
            error: "Unauthorized"
        });
    }
    try {
        const user = getUserFromToken(token);
        
        if (!user) {
            return next({
                status: StatusCodes.UNAUTHORIZED,
                message: "Invalid token",
                error: "Unauthorized"
            });
        }

        req.user = user;
        console.log(req.user);
        // Attach user info to the request object
        next();
        
    } catch (error) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: "Invalid token",
            error: error.message || "Unauthorized"
        });         
        
    }

}


module.exports = { restrictToAuthenticatedUser };