const router = require("express").Router({ mergeParams: true });
const controller = require("./order.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const { orderSchema } = require("../../utils/validation/reqBodyValidation/order.validation");
const validate = require("../../shared/middleware/validate");
const { validateParam } = require("../../shared/middleware/validateParam");
const { isReservationExists } = require("../reservation/reservation.controller");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

// Middleware
router.use(validateParam("reservationId"));
router.use(isReservationExists);

// Routes
router
  .route("/")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ORDER),
    controller.getAllOrders
  )
  .post(validate(orderSchema),
    requirePermission(PERMISSIONS.CAN_CREATE_ORDER),
    controller.createOrder)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_ORDER),
    controller.getOrder)
  .put(
    validate(orderSchema),
    requirePermission(PERMISSIONS.CAN_UPDATE_ORDER),
    controller.updateOrder
  )
  .all(methodNotAllowed);

router
  .route("/:orderId/complete")
  .put(
    requirePermission(PERMISSIONS.CAN_COMPLETE_ORDER),
    controller.completeOrder
  )
  .all(methodNotAllowed);

module.exports = router;
