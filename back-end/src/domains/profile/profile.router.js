const router = require("express").Router({ mergeParams: true });
const requirePermission = require("../../shared/middleware/requirePermission");
const controller = require("./profile.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router
  .route("/")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_PROFILE), controller.getProfile)
  .put(
    requirePermission(PERMISSIONS.CAN_EDIT_PROFILE),
    controller.updateProfile
  )
  .all(methodNotAllowed);

module.exports = router;
