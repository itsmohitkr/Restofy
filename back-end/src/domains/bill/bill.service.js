
const prisma = require("../../infrastructure/database/prisma/client");

// Fetch a menu item by ID and restaurantId
const getMenuItemById = async (menuItemId, restaurantId) => {
  return prisma.menuItem.findFirst({
    where: {
      id: Number(menuItemId),
      menu: { restaurantId: parseInt(restaurantId) },
    },
  });
};


const createBill = async (billData, billItems) => {
  return prisma.$transaction(async (prisma) => {
    // Create the bill
    const bill = await prisma.bill.create({
      data: {
        ...billData,
      },
    });

    // Create the bill items
    const billItemsData = billItems.map((item) => ({
      ...item,
      billId: bill.id,
    }));

    await prisma.billItem.createMany({
      data: billItemsData,
    });

    // Return the created bill with its items
    bill.items = await prisma.billItem.findMany({
      where: { billId: bill.id },
    });
   
    return bill;
  });
}
const getBillById = async (billId, orderId) => {
  return prisma.bill.findFirst({
    where: {
      id: Number(billId),
      orderId: Number(orderId),
    },
    include: {
      billItems: true, // Include bill items
    },
  });
}
const getBillByOrderIdAndReservationId = async (reservationId, orderId) => {
  return prisma.bill.findFirst({
    where: {
      orderId: Number(orderId),
      reservationId: Number(reservationId),
    },
    include: {
      billItems: true, // Include bill items
    },
  });
};

module.exports = {
  getMenuItemById,
  createBill,
  getBillById,
  getBillByOrderIdAndReservationId
};