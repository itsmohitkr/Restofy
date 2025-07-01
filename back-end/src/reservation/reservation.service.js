const prisma = require('../../prisma/client');

const createReservation = async (reservationData) => {
    return await prisma.reservation.create({
        data: reservationData,
    });
}
const getAllReservations = async (restaurantId) => {
    return await prisma.reservation.findMany({
        where: {
            restaurantId: Number(restaurantId),
        },
        orderBy: {
            reservationTime: 'asc',
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

const updateReservation = async (reservationId, reservationData, restaurantId) => {
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



module.exports = {
  createReservation,
  getAllReservations,
  getReservation,
    updateReservation,
    assignReservationToTable,
};