const router = require("express").Router({ mergeParams: true });
const controller = require("./order.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const { orderSchema } = require("../validation/order.validation");
const validate = require("../middleware/validate");
const { validateParam } = require("../middleware/validateParam");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { isReservationExists } = require("../reservation/reservation.controller");

router.use(validateParam("reservationId"));
router.use(isReservationExists);

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

module.exports = router;
