const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const pathNotFound = require("./shared/error/pathNotFound");
const errorHandler = require("./shared/error/errorHandler");

// Routes
const apiLimiter = require("./shared/security/apiLimiter");
const routes = require("./routes/index");

// Note: Individual route imports moved to routes/index.js for better organization

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(apiLimiter); 

// Main API routes
app.use("/api", routes);


app.use(pathNotFound);
app.use(errorHandler);

module.exports = app;