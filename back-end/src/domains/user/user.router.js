const router = require("express").Router({ mergeParams: true });
const controller = require("./user.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const validate = require("../../shared/middleware/validate");
const {
  userSchema,
} = require("../../utils/validation/reqBodyValidation/user.validation");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");


router
  .route("/:userId")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_USER),
    controller.getUser
  )
  .put(
    requirePermission(PERMISSIONS.CAN_UPDATE_USER),
    validate(controller.userSchema),
    controller.updateUser
  )
  .delete(
    requirePermission(PERMISSIONS.CAN_DELETE_USER),
    controller.deleteUser
  )
  .all(methodNotAllowed);

router
  .route("/")
  .post(
    requirePermission(PERMISSIONS.CAN_CREATE_USER),
    validate(userSchema),
    controller.createUser
  )
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_USERS),
    controller.getAllUsers
  )
  .all(methodNotAllowed);

module.exports = router;
