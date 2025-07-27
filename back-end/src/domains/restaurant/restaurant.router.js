const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("./restaurant.controller");

const {
  restaurantSchema,
} = require("../../utils/validation/reqBodyValidation/restaurant.validation");

const validate = require("../../shared/middleware/validate");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const { attachUserId } = require("../../shared/middleware/attachOwnerId");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router.use(attachUserId);

router
  .route("/:restaurantId")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_RESTAURANT),
    controller.getRestaurant
  )
  .put(
    validate(restaurantSchema),
    requirePermission(PERMISSIONS.CAN_UPDATE_RESTAURANT),
    controller.updateRestaurant
  )
  .delete(
    requirePermission(PERMISSIONS.CAN_DELETE_RESTAURANT),
    controller.deleteRestaurant
  )
  .all(methodNotAllowed);

router
  .route("/")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_RESTAURANTS),
    controller.getAllRestaurants
  )
  .post(
    validate(restaurantSchema),
    requirePermission(PERMISSIONS.CAN_CREATE_RESTAURANT),
    controller.createRestaurant
  )
  .all(methodNotAllowed);

module.exports = router;
