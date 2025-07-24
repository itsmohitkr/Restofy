const router = require("express").Router({ mergeParams: true });
const controller = require("./order.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const { orderSchema } = require("../../utils/validation/reqBodyValidation/order.validation");
const validate = require("../../shared/middleware/validate");
const { validateParam } = require("../../shared/middleware/validateParam");
const { isReservationExists } = require("../reservation/reservation.controller");

// Middleware
router.use(validateParam("reservationId"));
router.use(isReservationExists);

// Routes
router
  .route("/")
  .post(validate(orderSchema), controller.createOrder)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .get(controller.getOrder)
  .put(validate(orderSchema), controller.updateOrder)
  .all(methodNotAllowed);

router
  .route("/:orderId/complete")
  .put(controller.completeOrder)
  .all(methodNotAllowed);

module.exports = router;
