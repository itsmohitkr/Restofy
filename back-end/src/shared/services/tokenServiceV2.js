const prisma = require("../../infrastructure/database/prisma/client");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateTokenv2 = async (
  user,
  type = "ACCESS_TOKEN",
  expiresIn = "1h",
  metadata = {}
) => {
  try {
    const tokenId = crypto.randomUUID();

    // Parse expiresIn to milliseconds
    const expiryTime = parseExpiresIn(expiresIn);
    const now = Date.now();

    const expiresAtDate = new Date(now + expiryTime);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenId,
      type,
      iat: Math.floor(now / 1000), // Current time in seconds
      exp: Math.floor((now + expiryTime) / 1000), // Expiration time in seconds
      purpose: type.toLowerCase(),
    };
    if (user.role === "Staff") {
      payload.restaurantId = user.restaurantId;
      payload.addedByUserId = user.addedByUserId;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || "Restofy",
      audience: process.env.JWT_AUDIENCE || "RestofyUsers",
    });

    const data = {
      userId: user.id,
      tokenId,
      type,
      token: hashToken(token), // Store the actual token
      expiresAt: expiresAtDate, // Store as Date object
      createdAt: new Date(now), // Current timestamp as Date object
      ipAddress: metadata.ipAddress || "unknown",
      userAgent: metadata.userAgent || "unknown",
      deviceInfo: metadata.deviceInfo || "unknown",
    };

    await prisma.token.create({
      data: data,
    });
    return {
      token,
      tokenId,
      expiresAt: expiresAtDate,
      issuedAt: payload.iat,
    };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

const parseExpiresIn = (expiresIn) => {
  if (typeof expiresIn === "number") {
    return expiresIn * 1000; // Convert seconds to milliseconds
  } else if (typeof expiresIn === "string") {
    const match = expiresIn.match(/(\d+)([smhd])/);
    console.log("match", match);

    if (!match) throw new Error("Invalid expiresIn format");
    const value = parseInt(match[1], 10);
    console.log("value", value);

    const unit = match[2];
    console.log("unit", unit);

    switch (unit) {
      case "s":
        return value * 1000; // seconds
      case "m":
        return value * 60 * 1000; // minutes
      case "h":
        return value * 60 * 60 * 1000; // hours
      case "d":
        return value * 24 * 60 * 60 * 1000; // days
      default:
        throw new Error("Invalid time unit in expiresIn");
    }
  } else {
    throw new Error("Invalid expiresIn type");
  }
};

const verifyTokenv2 = async (token, type) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (jwtError) {
    if (jwtError.name === "TokenExpiredError") {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Reset link has expired. Please request a new password reset.",
        "Token expired"
      );
    } else if (jwtError.name === "JsonWebTokenError") {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid reset link. Please request a new password reset.",
        "Invalid token"
      );
    } else {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid reset link",
        "Token error"
      );
    }
  }
  if (decoded.purpose !== type.toLowerCase()) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Invalid token type",
      "Token type mismatch"
    );
  }

  return decoded;
};

module.exports = {
  generateTokenv2,
  verifyTokenv2,
};
