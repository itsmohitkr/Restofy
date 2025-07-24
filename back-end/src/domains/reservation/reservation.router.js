const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('./reservation.controller');
const validate = require('../../shared/middleware/validate');
const { reservationSchema } = require('../../utils/validation/reqBodyValidation/reservation.validation');
const { reservationQuerySchema } = require('../../utils/validation/reqQueryValidation/reservationQuerySchema');
const { requireBody } = require('../../shared/middleware/requireBody');
const methodNotAllowed = require('../../shared/error/methodNotAllowed');

// Main reservations route
router.route('/')
  .get(validate(reservationQuerySchema), controller.getAllReservations)
  .post(requireBody, validate(reservationSchema), controller.createReservation)
  .all(methodNotAllowed);

// Search reservations
router.route('/search')
  .get(controller.getReservationByKeyword)
  .all(methodNotAllowed);

// Reservation by ID
router.route('/:reservationId')
  .get(controller.getReservation)
  .put(requireBody, validate(reservationSchema), controller.updateReservation)
  .delete(controller.deleteReservation)
  .all(methodNotAllowed);

// Assign table to reservation
router.route('/:reservationId/assign-table')
  .put(controller.assignReservationToTable)
  .all(methodNotAllowed);

// Mark reservation as completed
router.route('/:reservationId/completed')
  .put(controller.markReservationAsCompleted)
  .all(methodNotAllowed);

// Cancel reservation
router.route('/:reservationId/cancel')
  .put(controller.cancelReservation)
  .all(methodNotAllowed);

module.exports = router;
