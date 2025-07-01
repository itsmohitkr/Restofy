

const router = require('express').Router({ mergeParams: true }); 
const controller = require('./reservation.controller');
const validate = require('../middleware/validate');
const { reservationSchema } = require('../validation/reservation.validation');
const methodNotAllowed = require('../error/methodNotAllowed');
const { isRestaurantExist } = require('../restaurant/restaurant.controller');
const { validateParam } = require('../middleware/validateParam');
const { checkRestaurantOwnership } = require('../middleware/checkRestaurantOwnership');

router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router
    .route('/')
    .get(controller.getAllReservations)
    .post(validate(reservationSchema), controller.createReservation)
    .all(methodNotAllowed);

router
    .route('/:reservationId')
    .get(controller.getReservation)
    .put(validate(reservationSchema), controller.updateReservation)
    // .delete(controller.deleteReservation)
    .all(methodNotAllowed);

// router.route('/:reservationId/assign')
//     .put(controller.assignReservationToTable)
//     .all(methodNotAllowed);


module.exports = router;
