const router = require("express").Router({ mergeParams: true });
const controller = require("./order.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const { orderSchema } = require("../validation/order.validation");
const validate = require("../middleware/validate");
const { validateParam } = require("../middleware/validateParam");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { isReservationExists } = require("../reservation/reservation.controller");
const billRoutes = require("../bill/bill.router");

router.use(validateParam("reservationId"));
router.use(isReservationExists);

router.use("/:orderId/bill", billRoutes); 

// url: /:reservationId/order
router
  .route("/")
  .post(validate(orderSchema),controller.createOrder)
  .all(methodNotAllowed);

// url: /:reservationId/order/:orderId
router
  .route("/:orderId")
  .get(controller.getOrder)
  .put(validate(orderSchema),controller.updateOrder)
  .all(methodNotAllowed);

  router.route("/:orderId/complete")
  .put(controller.completeOrder)
  .all(methodNotAllowed);



module.exports = router;
