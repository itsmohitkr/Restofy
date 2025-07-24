const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("./restaurant.controller");

const {
  restaurantSchema,
} = require("../../utils/validation/reqBodyValidation/restaurant.validation");

const validate = require("../../shared/middleware/validate");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const { attachUserId } = require("../../shared/middleware/attachOwnerId");

router.use(attachUserId);

router
  .route("/:restaurantId")
  .get(controller.getRestaurant)
  .put(validate(restaurantSchema), controller.updateRestaurant)
  .delete(controller.deleteRestaurant)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.getAllRestaurants)
  .post(validate(restaurantSchema), controller.createRestaurant)
  .all(methodNotAllowed);

module.exports = router;
