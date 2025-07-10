const prisma = require("../../prisma/client");

const createReservation = async (reservationData) => {
  return await prisma.reservation.create({
    data: reservationData,
  });
};
const getAllReservations = async (filter) => {
  return await prisma.reservation.findMany({
    where: {
      ...filter,
    },
    orderBy: {
      reservationTime: "asc",
    },
  });
};
const getReservation = async (restaurantId, reservationId) => {
  return await prisma.reservation.findUnique({
    where: {
      id: Number(reservationId),
      restaurantId: Number(restaurantId),
    },
  });
};

const updateReservation = async (
  reservationId,
  reservationData,
  restaurantId
) => {
  return await prisma.reservation.update({
    where: {
      id: Number(reservationId),
      restaurantId: Number(restaurantId),
    },
    data: reservationData,
  });
};

const assignReservationToTable = async (tableId, reservationId) => {
  return await prisma.$transaction(async (prisma) => {
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: Number(reservationId),
      },
      data: {
        tableId: Number(tableId),
        status: "Seated",
      },
    });
    const updatedTable = await prisma.table.update({
      where: {
        id: Number(tableId),
      },
      data: {
        tableStatus: "Occupied",
      },
    });
    return {
      updatedReservation,
      updatedTable,
    };
  });
};

const deleteReservation = async (reservationId, restaurantId) => {
  return await prisma.reservation.delete({
    where: {
      id: Number(reservationId),
      restaurantId: Number(restaurantId),
    },
  });
};
const getReservationByKeyword = async (keyword, restaurantId) => {
  return await prisma.reservation.findMany({
    where: {
      restaurantId: Number(restaurantId),
      OR: [
        { firstName: { contains: keyword, mode: "insensitive" } },
        { lastName: { contains: keyword, mode: "insensitive" } },
        { email: { contains: keyword, mode: "insensitive" } },
        { contact: { contains: keyword, mode: "insensitive" } },
        { status: { contains: keyword, mode: "insensitive" } },
        { specialRequests: { contains: keyword, mode: "insensitive" } },
      ],
    },
    orderBy: {
      reservationTime: "asc",
    },
  });
};
const getTabelById = async (tableId, restaurantId) => {
  return await prisma.table.findUnique({
    where: {
      id: Number(tableId),
      restaurantId: Number(restaurantId),
    },
  });
};
const markReservationAsCompleted = async (reservationId, restaurantId) => {
  return await prisma.$transaction(async (prisma) => {
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: Number(reservationId),
        restaurantId: Number(restaurantId),
      },
      data: {
        status: "Completed",
      },
    });
    const updatedTable = await prisma.table.update({
      where: {
        id: updatedReservation.tableId,
      },
      data: {
        tableStatus: "Available",
      },
    });
    return {
      updatedReservation,
      updatedTable,
    };
  });
};
const cancelReservation = async (reservationId, restaurantId) => {
  return await prisma.reservation.update({
      where: {
        id: Number(reservationId),
        restaurantId: Number(restaurantId),
      },
      data: {
        status: "Cancelled",
      },
    });
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservation,
  updateReservation,
  assignReservationToTable,
  deleteReservation,
  getReservationByKeyword,
  getTabelById,
  markReservationAsCompleted,
  cancelReservation,
};
