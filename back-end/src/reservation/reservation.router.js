

const router = require('express').Router({ mergeParams: true }); 
const controller = require('./reservation.controller');
const validate = require('../middleware/validate');
const { reservationSchema } = require('../validation/reservation.validation');
const methodNotAllowed = require('../error/methodNotAllowed');

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



module.exports = router;
