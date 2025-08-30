const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./menu.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router
  .route("/:menuId")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_MENU), controller.getMenu)
  .delete(requirePermission(PERMISSIONS.CAN_DELETE_MENU), controller.deleteMenu)
  .all(methodNotAllowed);

router
  .route("/")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_MENU), controller.getMenuForRestaurant)
  .post(requirePermission(PERMISSIONS.CAN_CREATE_MENU), controller.createMenu)
  .all(methodNotAllowed);

module.exports = router;
