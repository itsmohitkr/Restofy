const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./menu.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");

router
  .route("/:menuId")
  .get(controller.getMenu)
  .delete(controller.deleteMenu)
  .all(methodNotAllowed);

router.route("/").post(controller.createMenu).all(methodNotAllowed);

module.exports = router;
