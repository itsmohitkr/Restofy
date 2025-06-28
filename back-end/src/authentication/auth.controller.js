
const { StatusCodes } = require("http-status-codes");
const service = require("./auth.service");
const { successResponse } = require("../utils/responseBody");
const bcrypt = require("bcrypt");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { generateToken } = require("../middleware/tokenService");

const signup = async (req, res, next) => {
  const { ownerName, ownerEmail, ownerPhoneNumber, ownerPassword } =
    req.body;
  // Check if the user already exists

    const isOwnerExist = await service.read(ownerEmail);
  if (isOwnerExist) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "Owner already exists",
      error: "Validation Error",
    });
  }
    // Hash the password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    // Create a new owner
    const newOwner = {
        ...req.body,
        ownerPassword: hashedPassword,
    }
    const createdOwner = await service.create(newOwner);

    const response = successResponse(StatusCodes.CREATED, "Owner created successfully", createdOwner);
    res.status(StatusCodes.CREATED).json(response);   

};

const login = async (req, res, next) => {
    const { ownerEmail, ownerPassword } = req.body;
    // Check if the owner exists    
    const owner = await service.read(ownerEmail);
    if (!owner) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: "Invalid email, Please resgister.",
            error: "Authentication Error",
        });
    }
    if (owner && (!await bcrypt.compare(ownerPassword, owner.ownerPassword))) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: "Invalid password",
            error: "Authentication Error",
        });
    }
    // Generate a token 
    const token = generateToken(owner);
    console.log(res);
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    const response = successResponse(StatusCodes.OK, "Login successful", owner);
    res.status(StatusCodes.OK).json(response);

}
const verifyToken = async (req, res, next) => {
    // Implementation for verifying the token
    const token = req.cookies?.token;
    if (!token) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: "No token provided",
            error: "Authentication Error",
        });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if( err.name === 'TokenExpiredError') {
                return next({
                    status: StatusCodes.UNAUTHORIZED,
                    message: "Token expired",
                    error: "Authentication Error",
                });
            }
            else if (err.name === 'JsonWebTokenError') {
                return next({
                    status: StatusCodes.UNAUTHORIZED,
                    message: "Invalid token",
                    error: "Authentication Error",
                });
            }
            else {
                return next({
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  message: "Failed to verify token",
                  error: "Authentication Error",
                });
            }
            
        }
        // If token is valid, attach user info to request
        req.user = decoded;
        next();
    }
    );
    
};

module.exports = {
    signup: asyncErrorBoundary(signup),
    login: asyncErrorBoundary(login),
    verifyToken: asyncErrorBoundary(verifyToken),
  //   forgotPassword,
  //   resetPassword,
};
