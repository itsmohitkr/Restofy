const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const { StatusCodes } = require("http-status-codes");
const service = require("./reservation.service");
const { successResponse, errorResponse } = require("../../utils/helper/responseBody");
const { requireBody } = require("../../shared/middleware/requireBody");
const { sendSuccessResponse, sendErrorResponse } = require("../../utils/helper/responseHelpers");
const { validateParam } = require("../../shared/middleware/validateParam");
const { isTableExist } = require("../tables/table.controller");
const { sendEmailJob } = require("../../shared/services/emailProducer");
// const emailTemplatesHelper = require("../../utils/helper/emailTemplatesHelper");

const createReservation = async (req, res) => {
  const reservationData = {
    ...req.body,
    restaurantId: Number(req.restaurantId),
  };

  const newReservation = await service.createReservation(reservationData);
  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "Reservation created successfully",
    newReservation
  );

  // const emailTemplate = emailTemplatesHelper("RESERVATION_CONFIRMATION", newReservation);

  sendEmailJob(
    {
      to: newReservation.email,
      subject: `Reservation Confirmation: ${newReservation.id}`,
      body: `Hi ${newReservation.firstName},\n\nYour reservation has been successfully created with ID: ${newReservation.id}.\nDetails:\n- Date & Time: ${newReservation.reservationTime}\n- Number of Guests: ${newReservation.numberOfGuests}\n- Special Requests: ${newReservation.specialRequests || "None"}\n\nThank you for choosing us!`,
    },
    "notification.send"
  );

};
const getAllReservations = async (req, res, next) => {
  const { firstName, lastName, email, contact, status, reservationTime } = req.query;
  const filetr = {
    restaurantId: Number(req.restaurantId),
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(email && { email }),
    ...(contact && { contact }),
    ...(status && { status }),
    ...(reservationTime && { reservationTime }),
  };

  const reservations = await service.getAllReservations(filetr);
  
  if (reservations.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "No reservations found",
      "Not Found"
    );
  }
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservations retrieved successfully",
    reservations
  );
};

const getReservation = async (req, res) => {
  const reservation = res.locals.reservation;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservation retrieved successfully",
    reservation
  );
};
const isReservationExists = async (req, res, next) => {
  const { reservationId } = req.params;
  const reservation = await service.getReservation(
    req.restaurantId,
    reservationId
  );
  if (!reservation) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: `Reservation with id ${reservationId} not found`,
      error: "Not Found",
    });
  }
  res.locals.reservation = reservation;
  next();
};
const updateReservation = async (req, res) => {
  const { reservationId } = req.params;
  const reservationData = {
    ...req.body,
    restaurantId: req.restaurantId,
  };
  const updatedReservation = await service.updateReservation(
    reservationId,
    reservationData,
    req.restaurantId
  );
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservation updated successfully",
    updatedReservation
  );
};
const deleteReservation = async (req, res) => {
  const { reservationId } = req.params;
  await service.deleteReservation(reservationId, req.restaurantId);
  sendSuccessResponse(
    res,
    StatusCodes.NO_CONTENT,
    "Reservation deleted successfully",
    null
  );
  
};
const getReservationByKeyword = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Keyword query parameter is required",
      "Missing Keyword"
    );
  }

  const reservations = await service.getReservationByKeyword(keyword, req.restaurantId);

  if (reservations.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "No reservations found matching the keyword",
      "No Reservations Found"
    );
  }

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservations retrieved successfully",
    reservations
  );
};

// /api/reservations/:reservationId/assign-table?tableId=1
const assignReservationToTable = async (req, res) => {
  const { reservationId } = req.params;
  const { tableId } = req.query;
  const restaurantId = req.restaurantId;
  const reservation = res.locals.reservation;
 

  if (!tableId) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table ID is required to assign a reservation to a table",
      "Missing Table ID"
    );
  }
  const table = await service.getTabelById(tableId, restaurantId);
  if (!table) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Table with ID ${tableId} not found in restaurant with ID ${restaurantId}`,
      "Table Not Found"
    );
  }
  // Check if the reservation is already assigned to a table

  if (reservation.tableId) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `this reservation is already assigned to a table with ID: ${reservation.tableId}`,
      "Conflict: Reservation Already Assigned"
    );
  }
  if( reservation.status === "Completed") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Cannot assign a completed reservation to a table",
      "Conflict: Reservation Already Completed"
    );
  }

  if (table.tableStatus !== "Available") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table is not available for reservation",
      "Table Not Available"
    );
  }
  // tableCapacity check
  if (table.tableCapacity < reservation.numberOfGuests) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table capacity is less than the number of guests in the reservation",
      "Insufficient Table Capacity"
    );
  }

  const updatedTable = await service.assignReservationToTable(
    tableId,
    reservationId,
    restaurantId
  );
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservation assigned to table and table status updated",
    updatedTable
  );
};

// url: /api/reservations/:reservationId/completed?tableId=1
const markReservationAsCompleted = async (req, res) => {
  const { reservationId } = req.params;
  const {tableId} = req.query;
  const {reservation} = res.locals;

  if (reservation.status === "Completed") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Reservation is already marked as completed",
      "Conflict: Reservation Already Completed"
    );
  }
  if (!tableId) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table ID is required to mark a reservation as completed",
      "Missing Table ID"
    );
  }
  const table = await service.getTabelById(tableId, req.restaurantId);
  if (!table) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Table with ID ${tableId} not found in restaurant with ID ${req.restaurantId}`,
      "Table Not Found"
    );
  }
  // Check if the reservation is assigned to the table
  if (reservation.tableId !== Number(tableId)) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Reservation is not assigned to table with ID ${tableId}`,
      "Conflict: Reservation Not Assigned to Table"
    );
  }
  if (table.tableStatus !== "Occupied") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Table is not in occupied status",
      "Table Not Occupied"
    );
  }
  // Mark the reservation as completed



  const updatedReservation = await service.markReservationAsCompleted(
    reservationId,
    req.restaurantId
  );
  
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservation marked as completed successfully",
    updatedReservation
  );
}

// url: /api/reservations/:reservationId/cancel
const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;
  const { reservation } = res.locals;

  const {status} = reservation;
  if (["Completed", "Cancelled","Seated"].includes(status)) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Reservation cannot be cancelled as it is already ${status.toLowerCase()}`,
      `Conflict: Reservation Already ${status}`
    );
  }

  const updatedReservation = await service.cancelReservation(
    reservationId,
    req.restaurantId
  );

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Reservation cancelled successfully",
    updatedReservation
  );
  sendEmailJob(
    {
      to: updatedReservation.email,
      subject: `Reservation Cancellation: ${updatedReservation.id}`,
      body: `Hi ${updatedReservation.firstName},\n\nYour reservation with ID: ${updatedReservation.id} has been cancelled.\n\nThank you for choosing us!`,
    },
    "notification.send"
  );
};

module.exports = {
  createReservation: [requireBody, asyncErrorBoundary(createReservation)],
  getAllReservations: asyncErrorBoundary(getAllReservations),
  getReservation: [
    validateParam("reservationId"),
    isReservationExists,
    asyncErrorBoundary(getReservation),
  ],
  updateReservation: [
    validateParam("reservationId"),
    isReservationExists,
    asyncErrorBoundary(updateReservation),
  ],
  deleteReservation: [
    validateParam("reservationId"),
    isReservationExists,
    asyncErrorBoundary(deleteReservation),
  ],
  getReservationByKeyword: asyncErrorBoundary(getReservationByKeyword),

  assignReservationToTable: [
    validateParam("reservationId"),
    isReservationExists,
    asyncErrorBoundary(assignReservationToTable),
  ],

  markReservationAsCompleted: [
    validateParam("reservationId","tableId"),
    isReservationExists,
    asyncErrorBoundary(markReservationAsCompleted),
  ],
  cancelReservation: [
    validateParam("reservationId"),
    isReservationExists,
    asyncErrorBoundary(cancelReservation),
  ],
  isReservationExists: asyncErrorBoundary(isReservationExists),
  
};
