const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./menuItem.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { menuItemSchema } = require("../validation/menuItem.validation");

router
  .route("/:menuItemId")
  .get(controller.getMenuItem)
  .put(validate(menuItemSchema), controller.updateMenuItem)
  .delete(controller.deleteMenuItem)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.getAllMenuItems)
  .post(validate(menuItemSchema), controller.createMenuItem)
  .all(methodNotAllowed);

module.exports = router;


