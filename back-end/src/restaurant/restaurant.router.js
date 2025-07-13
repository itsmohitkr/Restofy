const { Router } = require("express");
const router = Router({ mergeParams: true }); // mergeParams allows access to restaurantId from parent router

// Controllers
const controller = require("./restaurant.controller");
const menuController = require("../menu/menu.controller");

// Middleware
const validate = require("../middleware/validate");
const methodNotAllowed = require("../error/methodNotAllowed");
const { attachOwnerId } = require("../middleware/attachOwnerId");

// Validation Schemas
const { restaurantSchema } = require("../validation/restaurant.validation");

// Sub-routes
const tableRoutes = require("../tables/table.router");
const reservationRoutes = require("../reservation/reservation.router");
const menuRoutes = require("../menu/menu.router");
const menuItemRoutes = require("../menuItem/menuItem.router");
const userRoutes = require("../user/user.router");

// Global middleware
router.use(attachOwnerId); // Attach ownerId to req object for further use

// Nested routes
router.use("/:restaurantId/table", tableRoutes);

router.use("/:restaurantId/user", controller.isRestaurantExist, userRoutes);

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

router.use(
  "/:restaurantId/menu",
  controller.isRestaurantExist,
  menuRoutes
);

// Restaurant CRUD routes
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
