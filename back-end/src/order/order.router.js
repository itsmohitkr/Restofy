const router = require("express").Router({ mergeParams: true });
const controller = require("./order.controller");
const methodNotAllowed = require("../error/methodNotAllowed");

