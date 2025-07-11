const prisma = require("../../prisma/client");

// Create a payment for a bill: const payment = await service.createPayment(paymentData,billId, reservationId, orderId, restaurantId); should be a transaction

const createPayment = async (
  paymentData,
  billId,
  reservationId,
  orderId,
  restaurantId
) => {
  return await prisma.$transaction(async (prisma) => {
    // Create the payment
    const payment = await prisma.payment.create({
      data: {
        ...paymentData,
      },
    });

    // update bill status to 'Paid'
    await prisma.bill.update({
      where: {
        id: Number(billId),
        orderId: Number(orderId),
        reservationId: Number(reservationId),
        restaurantId: Number(restaurantId),
      },
      data: {
        status: "Paid",
      },
    });

    // update Order status to 'Paid'
    await prisma.order.update({
      where: {
        id: Number(orderId),
        restaurantId: Number(restaurantId),
      },
      data: {
        status: "Paid",
      },
    });
    // make the table available again
    // get the tableId from the reservation
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: Number(reservationId),
        restaurantId: Number(restaurantId),
      },
      select: {
        tableId: true,
      },
    });
    // update Reservation status to 'Completed'
    await prisma.reservation.update({
      where: {
        id: Number(reservationId),
        restaurantId: Number(restaurantId),
      },
      data: {
        status: "Completed",
      },
    });

    await prisma.table.update({
      where: {
        id: Number(reservation.tableId),
        restaurantId: Number(restaurantId),
      },
      data: {
        tableStatus: "Available",
      },
    });

    return payment;
  });
};

module.exports = {
  createPayment,
};
