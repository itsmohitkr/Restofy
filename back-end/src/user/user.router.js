const router = require("express").Router({ mergeParams: true });
const controller = require("./user.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { validateParam } = require("../middleware/validateParam");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const {
  checkRestaurantOwnership,
} = require("../middleware/checkRestaurantOwnership");
const { userSchema } = require("../validation/user.validation");
const requirePermission = require("../middleware/requirePermission");
const { PERMISSIONS } = require("../constants/permissions");

router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router
  .route("/:userId")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_USER), controller.getUser)
  .put(
    requirePermission(PERMISSIONS.CAN_UPDATE_USER),
    validate(controller.userSchema),
    controller.updateUser
  )
  .delete(requirePermission(PERMISSIONS.CAN_DELETE_USER), controller.deleteUser)
  .all(methodNotAllowed);

router
  .route("/")
  .post(
    requirePermission(PERMISSIONS.CAN_CREATE_USER),
    validate(userSchema),
    controller.createUser
  )
  .get(requirePermission(PERMISSIONS.CAN_VIEW_USERS), controller.getAllUsers)
  .all(methodNotAllowed);

module.exports = router;
