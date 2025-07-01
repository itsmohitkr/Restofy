const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { StatusCodes } = require("http-status-codes");
const service = require("./reservation.service");
const { successResponse } = require("../utils/responseBody");
const { requireBody } = require("../middleware/requireBody");
const { sendSuccessResponse } = require("../utils/responseHelpers");

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
};
const getAllReservations = async (req, res) => {
  
    const reservations = await service.getAllReservations(req.restaurantId);
    sendSuccessResponse(res, StatusCodes.OK, "Reservations retrieved successfully", reservations);
};

const getReservation = async (req, res) => {
  const reservation = res.locals.reservation;
    sendSuccessResponse(res, StatusCodes.OK, "Reservation retrieved successfully", reservation);
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
      message: "Reservation not found",
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

    sendSuccessResponse(res, StatusCodes.OK, "Reservation updated successfully", updatedReservation);
};


module.exports = {
  createReservation: [requireBody, asyncErrorBoundary(createReservation)],
  getAllReservations: asyncErrorBoundary(getAllReservations),
  getReservation: [isReservationExists, asyncErrorBoundary(getReservation)],
  updateReservation: [
    isReservationExists,
    asyncErrorBoundary(updateReservation),
  ],
  // assignReservationToTable: asyncErrorBoundary(assignReservationToTable),
};