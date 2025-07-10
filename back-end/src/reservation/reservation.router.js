

const router = require('express').Router({ mergeParams: true }); 
const controller = require('./reservation.controller');
const validate = require('../middleware/validate');
const { reservationSchema } = require('../validation/reservation.validation');
const methodNotAllowed = require('../error/methodNotAllowed');
const { isRestaurantExist } = require('../restaurant/restaurant.controller');
const { validateParam } = require('../middleware/validateParam');
const { checkRestaurantOwnership } = require('../middleware/checkRestaurantOwnership');
const { reservationQuerySchema } = require('../validation/reservationQuerySchema');
const { requireBody } = require('../middleware/requireBody');
const orderRoutes = require("../order/order.router");


router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router.use("/:reservationId/order", orderRoutes);

router
    .route('/')
    .get(validate(reservationQuerySchema),controller.getAllReservations)
    .post(requireBody,validate(reservationSchema), controller.createReservation)
    .all(methodNotAllowed);

    router
      .route("/search")
      .get(controller.getResevationByKeyword)
      .all(methodNotAllowed);
router
  .route("/:reservationId")
  .get(controller.getReservation)
  .put(requireBody,validate(reservationSchema), controller.updateReservation)
  .delete(controller.deleteReservation)
  .all(methodNotAllowed);

router
  .route("/:reservationId/assign-table")
  .put(controller.assignReservationToTable)
  .all(methodNotAllowed);
  
router
  .route("/:reservationId/completed")
  .put(controller.markReservationAsCompleted)
  .all(methodNotAllowed);

router
  .route("/:reservationId/cancel")
  .put(controller.cancelReservation)
  .all(methodNotAllowed);

module.exports = router;
