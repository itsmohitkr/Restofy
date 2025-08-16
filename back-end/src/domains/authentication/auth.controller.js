const { StatusCodes } = require("http-status-codes");
const service = require("./auth.service");
const bcrypt = require("bcrypt");
const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const jwt = require("jsonwebtoken");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/helper/responseHelpers");
const {
  generateTokenv2,
  verifyTokenv2,
} = require("../../shared/services/tokenServiceV2");
const prisma = require("../../infrastructure/database/prisma/client");
const { sendEmailJob } = require("../../shared/services/emailProducer");
const emailTemplates = require("../../utils/constants/emailTemplates");

const signup = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, address } =
    req.body;

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
        landmark,
      },
    };
  }
  const createdUser = await service.createUser(newUser);
  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "User created successfully",
    createdUser
  );
  const emailTemplate = emailTemplates.SIGNUP_SUCCESS({
    recipients: createdUser.email,
  });

  sendEmailJob(emailTemplate, "notification.send");
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
  const { token } = await generateTokenv2(user, "ACCESS_TOKEN", "15d", {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

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
      if (err.name === "TokenExpiredError") {
        return next({
          status: StatusCodes.UNAUTHORIZED,
          message: "Token expired",
          error: "Authentication Error",
        });
      } else if (err.name === "JsonWebTokenError") {
        return next({
          status: StatusCodes.UNAUTHORIZED,
          message: "Invalid token",
          error: "Authentication Error",
        });
      } else {
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
  });
};

const logout = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: "No token provided",
      error: "Authentication Error",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { tokenId } = decoded;
  // Revoke the token in the database
  await prisma.token.updateMany({
    where: { tokenId },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
    },
  });

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  sendSuccessResponse(res, StatusCodes.OK, "Logout successful");
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await service.read(email);
  if (!user) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "User not found with this email",
      "Authentication Error"
    );
  }

  const resetTokenv2 = await generateTokenv2(user, "RESET_TOKEN", "5m", {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Send email
  const emailTemplate = emailTemplates.FORGOT_PASSWORD({
    recipients: user.email,
    resetToken: resetTokenv2.token,
  });

  sendEmailJob(emailTemplate, "notification.send");

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Password reset link sent to your email"
  );
};

const resetPassword = async (req, res, next) => {
  try {
    const token = req.query?.token;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Reset token is required",
        "Missing reset token"
      );
    }

    if (!newPassword) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "New password is required",
        "Missing password"
      );
    }

    if (!confirmPassword) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Password confirmation is required",
        "Missing password"
      );
    }

    if (newPassword !== confirmPassword) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Password confirmation is required",
        "Missing confirmation"
      );
    }

    // Verify the JWT token
    const decoded = await verifyTokenv2(token, "RESET_TOKEN");

    const tokenRecord = await prisma.token.findUnique({
      where: { tokenId: decoded.tokenId },
    });

    if (!tokenRecord) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired reset token",
        "Authentication Error"
      );
    }

    const user = await service.read(decoded.email);

    if (!user) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "User not found",
        "Invalid user"
      );
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "New password must be different from your current password",
        "Same password"
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await service.resetPassword(user, hashedPassword);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    sendSuccessResponse(
      res,
      StatusCodes.OK,
      "Password successfully reset. Please log in with your new password."
    );
    // Send success email
    const emailTemplate = emailTemplates.RESET_PASSWORD_SUCCESS({
      recipients: user.email,
    });
    sendEmailJob(emailTemplate, "notification.send");
  } catch (error) {
    sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to reset password. Please try again.",
      "Server error"
    );
  }
};

module.exports = {
  signup: asyncErrorBoundary(signup),
  login: asyncErrorBoundary(login),
  forgotPassword: asyncErrorBoundary(forgotPassword),
  resetPassword: asyncErrorBoundary(resetPassword),
  logout: asyncErrorBoundary(logout),
  verifyToken: asyncErrorBoundary(verifyToken),
};
