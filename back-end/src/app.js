const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const pathNotFound = require("./error/pathNotFound");
const errorHandler = require("./error/errorHandler");

// Routes
const apiLimiter = require("./rateLimiter/apiLimiter");
const restaurantRoutes = require("./restaurant/restaurant.router");
const authRoutes = require("./authentication/auth.router");
const { restrictToAuthenticatedUser } = require("./middleware/restrictToLoggedInUser");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(apiLimiter); 

app.use("/api/auth", authRoutes);

app.use(restrictToAuthenticatedUser);

app.use("/api/restaurants", restaurantRoutes);

app.use(pathNotFound);
app.use(errorHandler);

module.exports = app;
