const { Router } = require("express");
const router = Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router
const controller = require("./restaurant.controller");
const menuController = require("../menu/menu.controller");

const { restaurantSchema } = require("../validation/restaurant.validation");

const tableRoutes = require("../tables/table.router");
const reservationRoutes = require("../reservation/reservation.router");
const menuRoutes = require("../menu/menu.router");
const menuItemRoutes = require("../menuItem/menuItem.router");

const validate = require("../middleware/validate");
const methodNotAllowed = require("../error/methodNotAllowed");
const { attachUserId } = require("../middleware/attachOwnerId");

router.use(attachUserId); 

router.use("/:restaurantId/table", tableRoutes);

router.use(
  "/:restaurantId/reservations",
  controller.isRestaurantExist,
  reservationRoutes
);
router.use(
  "/:restaurantId/menu/:menuId/menuItem",
  controller.isRestaurantExist,
  menuController.isMenuExists,
  menuItemRoutes
);
router.use("/:restaurantId/menu", controller.isRestaurantExist, menuRoutes);

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
