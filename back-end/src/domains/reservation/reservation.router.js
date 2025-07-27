const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("./reservation.controller");
const validate = require("../../shared/middleware/validate");
const {
  reservationSchema,
} = require("../../utils/validation/reqBodyValidation/reservation.validation");
const {
  reservationQuerySchema,
} = require("../../utils/validation/reqQueryValidation/reservationQuerySchema");
const { requireBody } = require("../../shared/middleware/requireBody");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

// Main reservations route
router
  .route("/")
  .get(
    validate(reservationQuerySchema),
    requirePermission(PERMISSIONS.CAN_VIEW_RESERVATION),
    controller.getAllReservations
  )
  .post(
    requireBody,
    validate(reservationSchema),
    requirePermission(PERMISSIONS.CAN_CREATE_RESERVATION),
    controller.createReservation
  )
  .all(methodNotAllowed);

// Search reservations
router
  .route("/search")
  .get(
    requirePermission(PERMISSIONS.CAN_SEARCH_RESERVATION),
    controller.getReservationByKeyword
  )
  .all(methodNotAllowed);

// Reservation by ID
router
  .route("/:reservationId")
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_RESERVATION),
    controller.getReservation
  )
  .put(
    requireBody,
    validate(reservationSchema),
    requirePermission(PERMISSIONS.CAN_UPDATE_RESERVATION),
    controller.updateReservation
  )
  .delete(
    requirePermission(PERMISSIONS.CAN_DELETE_RESERVATION),
    controller.deleteReservation
  )
  .all(methodNotAllowed);

// Assign table to reservation
router
  .route("/:reservationId/assign-table")
  .put(
    requirePermission(PERMISSIONS.CAN_ASSIGN_RESERVATION_TO_TABLE),
    controller.assignReservationToTable
  )
  .all(methodNotAllowed);

// Mark reservation as completed
router
  .route("/:reservationId/completed")
  .put(
    requirePermission(PERMISSIONS.CAN_MARK_RESERVATION_COMPLETED),
    controller.markReservationAsCompleted
  )
  .all(methodNotAllowed);

// Cancel reservation
router
  .route("/:reservationId/cancel")
  .put(
    requirePermission(PERMISSIONS.CAN_CANCEL_RESERVATION),
    controller.cancelReservation
  )
  .all(methodNotAllowed);

module.exports = router;
