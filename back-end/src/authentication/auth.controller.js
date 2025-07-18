
const { StatusCodes } = require("http-status-codes");
const service = require("./auth.service");
const { successResponse } = require("../utils/responseBody");
const bcrypt = require("bcrypt");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { generateToken, generateTokenv2 } = require("../middleware/tokenService");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/responseHelpers");



const signup = async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, password, address } = req.body;

    const { street, city, state, country, pinCode, landmark } = address || {};
    
    
    const isUserExist = await service.read(email);
    if (isUserExist) {
        return sendErrorResponse(
            res,
            StatusCodes.BAD_REQUEST,
            "User already exists",
            "Validation Error"
        );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: "Owner",
       
    };
    if (address) {
        newUser.address = {
            create: {
                street,
                city,
                state,
                country,
                pinCode,
                landmark
            }
        }
    }
    const createdUser = await service.createUser(newUser);
    sendSuccessResponse(
        res,
        StatusCodes.CREATED,
        "User created successfully",
        createdUser
    );
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if the user exists
  const user = await service.read(email);
  if (!user) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Invalid email, Please register.",
      "Authentication Error"
    );
  }
  if (user && !(await bcrypt.compare(password, user.password))) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Invalid password",
      "Authentication Error"
    );
  }
  // Generate a token
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  sendSuccessResponse(res, StatusCodes.OK, "Login successful", user);
};
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
