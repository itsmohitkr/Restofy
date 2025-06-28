const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { StatusCodes } = require("http-status-codes");
const service = require("./reservation.service");
const { successResponse } = require("../utils/responseBody");

const createReservation = async (req, res) => {
    const tokenData = req.user;
    const ownerId = tokenData.ownerId;
    const restaurantData = res.locals.restaurant;
    if (restaurantData.ownerId !== ownerId) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "You do not have permission to create a reservation for this restaurant",
            error: "Permission Denied"
        });
    }
    const { restaurantId } = restaurantData;

    
    const reservationData = {
        ...req.body,
        restaurantId: restaurantId,
        
    };
    const newReservation = await service.createReservation(reservationData);
    const response = successResponse(StatusCodes.CREATED, "Reservation created successfully", newReservation);
    res.status(StatusCodes.CREATED).json(response);
};
const getAllReservations = async (req, res) => {
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message:
        "You do not have permission to view reservations for this restaurant",
      error: "Permission Denied",
    });
  }
  const { restaurantId } = restaurantData;
  const reservations = await service.getAllReservations(restaurantId);
  const response = successResponse(
    StatusCodes.OK,
    "Reservations retrieved successfully",
    reservations
  );
  res.status(StatusCodes.OK).json(response);
};
const getReservation = async (req, res) => {
  const reservation = res.locals.reservation;
  const response = successResponse(
    StatusCodes.OK,
    "Reservation retrieved successfully",
    reservation
  );
  res.status(StatusCodes.OK).json(response);
};
const isReservationExists = async (req, res, next) => {
  const { reservationId } = req.params;
  const restaurantData = res.locals.restaurant;
  const reservation = await service.getReservation(
    restaurantData.restaurantId,
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
  const tokenData = req.user;
  const ownerId = tokenData.ownerId;
  const restaurantData = res.locals.restaurant;
  if (restaurantData.ownerId !== ownerId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: "You do not have permission to update this reservation",
      error: "Permission Denied",
    });
  }
  const { reservationId } = req.params;
  const reservationData = {
    ...req.body,
    restaurantId: restaurantData.restaurantId,
  };
  const updatedReservation = await service.updateReservation(
      reservationId,
      reservationData,
        restaurantData.restaurantId
  );
  const response = successResponse(
    StatusCodes.OK,
    "Reservation updated successfully",
    updatedReservation
  );
  res.status(StatusCodes.OK).json(response);
};


module.exports = {
  createReservation: asyncErrorBoundary(createReservation),
  getAllReservations: asyncErrorBoundary(getAllReservations),
  getReservation: [isReservationExists, asyncErrorBoundary(getReservation)],
  updateReservation: [
    isReservationExists,
    asyncErrorBoundary(updateReservation),
  ],
};