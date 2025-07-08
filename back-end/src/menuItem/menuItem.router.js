const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./menuItem.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { menuItemSchema } = require("../validation/menuItem.validation");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { validateParam } = require("../middleware/validateParam");
const { menuItemQuerySchema } = require("../validation/menuItemQuerySchema");
const { requireBody } = require("../middleware/requireBody");

router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router
  .route("/:menuItemId")
  .get(controller.getMenuItem)
  .put(requireBody, validate(menuItemSchema), controller.updateMenuItem)
  .patch(requireBody, controller.updateField)
  .delete(controller.deleteMenuItem)
  .all(methodNotAllowed);

router
  .route("/")
  .get(validate(menuItemQuerySchema), controller.getAllMenuItems)
  .post(requireBody,validate(menuItemSchema), controller.createMenuItem)
  .all(methodNotAllowed);

module.exports = router;


