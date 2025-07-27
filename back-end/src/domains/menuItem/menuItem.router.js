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
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router
  .route("/:menuItemId")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_MENU_ITEM),
    controller.getMenuItem)
  .put(
    requirePermission(PERMISSIONS.CAN_UPDATE_MENU_ITEM),
    requireBody,
    validate(menuItemSchema),
    controller.updateMenuItem
  )
  .patch(
    requirePermission(PERMISSIONS.CAN_UPDATE_MENU_ITEM),
    requireBody,
    controller.updateField
  )
  .delete(
    requirePermission(PERMISSIONS.CAN_DELETE_MENU_ITEM),
    controller.deleteMenuItem
  )
  .all(methodNotAllowed);

router
  .route("/")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_MENU_ITEM),
    validate(menuItemQuerySchema),
    controller.getAllMenuItems
  )
  .post(
    requirePermission(PERMISSIONS.CAN_CREATE_MENU_ITEM),
    requireBody,
    validate(menuItemSchema),
    controller.createMenuItem
  )
  .all(methodNotAllowed);

module.exports = router;
