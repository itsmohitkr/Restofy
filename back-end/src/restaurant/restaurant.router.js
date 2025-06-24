const { Router } = require("express");
const router = Router();
const controller = require("./restaurant.controller");
const { restaurantSchema } = require("../validation/restaurant.validation");
const validate = require("../middleware/validate");
const methodNotAllowed = require("../error/methodNotAllowed");

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