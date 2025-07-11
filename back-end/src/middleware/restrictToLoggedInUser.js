const { StatusCodes } = require("http-status-codes");
const { getUserFromToken } = require("./tokenService");
const prisma = require("../../prisma/client"); 

const restrictToAuthenticatedUser = async (req, res, next) => {
    const token = req.cookies?.token;
    
  if (!token) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: "You must be logged in to access this resource",
      error: "Unauthorized",
    });
  }
  try {
    const userPayload = getUserFromToken(token);
    if (!userPayload) {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid token",
        error: "Unauthorized",
      });
    }

    // Check if user exists in DB
    const user = await prisma.restaurantOwner.findUnique({
      where: { ownerId: Number(userPayload.ownerId) },
    });

    if (!user) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        
      }); // Optional: clear the cookie
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: "User no longer exists. Please log in again.",
        error: "Unauthorized",
      });
    }

    req.user = user; // Attach the full user object
    next();
  } catch (error) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: "Invalid token",
      error: error.message || "Unauthorized",
    });
  }
};

module.exports = { restrictToAuthenticatedUser };
