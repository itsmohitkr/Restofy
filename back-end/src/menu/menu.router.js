const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./menu.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { menuSchema } = require("../validation/menu.validation");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { validateParam } = require("../middleware/validateParam");

router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

// url: /restaurant/:restaurantId/menu
router
  .route("/:menuId")
  .get(controller.getMenu)
  .delete(controller.deleteMenu)
  .all(methodNotAllowed);

router.route("/").post(controller.createMenu).all(methodNotAllowed);

module.exports = router;
