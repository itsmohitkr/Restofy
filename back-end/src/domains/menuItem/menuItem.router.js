const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("./menuItem.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const validate = require("../../shared/middleware/validate");
const {
  menuItemSchema,
} = require("../../utils/validation/reqBodyValidation/menuItem.validation");

const {
  menuItemQuerySchema,
} = require("../../utils/validation/reqQueryValidation/menuItemQuerySchema");
const { requireBody } = require("../../shared/middleware/requireBody");

router
  .route("/:menuItemId")
  .get(controller.getMenuItem)
  .put(requireBody, validate(menuItemSchema), controller.updateMenuItem)
  .patch(requireBody, controller.updateField)
  .delete(controller.deleteMenuItem)
  .all(methodNotAllowed);

router
  .route("/")
  .get(validate(menuItemQuerySchema), controller.getAllMenuItems)
  .post(requireBody, validate(menuItemSchema), controller.createMenuItem)
  .all(methodNotAllowed);

module.exports = router;
