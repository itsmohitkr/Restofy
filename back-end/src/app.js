// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const pathNotFound = require("./error/pathNotFound");
const errorHandler = require("./error/errorHandler");


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
const restaurantRoutes = require("./restaurant/restaurant.router");
const authRoutes = require("./authentication/auth.router");

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.use(pathNotFound);
app.use(errorHandler);

module.exports = app;
