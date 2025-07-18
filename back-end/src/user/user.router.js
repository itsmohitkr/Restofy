const router = require("express").Router({ mergeParams: true });
const controller = require("./user.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { validateParam } = require("../middleware/validateParam");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { userSchema } = require("../validation/user.validation");
const requirePermission = require("../middleware/requirePermission");
const { PERMISSIONS } = require("../constants/permissions");

router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router.route("/:userId")
  .get(controller.getUser)
  .put(validate(controller.userSchema), controller.updateUser)
  .delete(controller.deleteUser)
  .all(methodNotAllowed);


router
  .route("/")
  .post(
    requirePermission(PERMISSIONS.CAN_CREATE_USER),
    validate(userSchema),
    controller.createUser
  )
  .get(controller.getAllUsers)
  .all(methodNotAllowed);

  

module.exports = router;