const prisma = require("../../infrastructure/database/prisma/client");

// Fetch a menu item by ID and restaurantId
async function getMenuItemById(menuItemId, restaurantId) {
  return prisma.menuItem.findFirst({
    where: {
      id: Number(menuItemId),
      menu: { restaurantId: parseInt(restaurantId) },
    },
  });
}

// Create a single order
async function createOrder(orderData) {
  return prisma.order.create({ data: orderData });
}

// Create multiple order items
async function createOrderItems(orderItemsData) {
  return prisma.orderItem.createMany({ data: orderItemsData });
}

// Update reservation status
async function updateReservationStatus(reservationId, status) {
  return prisma.reservation.update({
    where: { id: parseInt(reservationId) },
    data: { status },
  });
}

// Transactional order creation
async function createOrderWithItemsAndStatus(orderData, orderItemsData) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: orderData });
    // Attach orderId to each order item
    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      orderId: order.id,
    }));
    await tx.orderItem.createMany({ data: itemsWithOrderId });

    return order;
  });
}


// Transaction: add new items and update total

async function updateOrderWithItems(orderId, orderItemsData, restaurantId) {
  return prisma.$transaction(async (tx) => {
    // Add new order items
    await tx.orderItem.createMany({ data: orderItemsData });

    // Fetch all order items for this order
    const allOrderItems = await tx.orderItem.findMany({
      where: {
        orderId: parseInt(orderId),
        restaurantId: parseInt(restaurantId),
      },
    });
    const totalAmount = allOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Update order total
    const updated = await tx.order.update({
      where: { id: parseInt(orderId) },
      data: { totalAmount },
    });
    return { updated, totalAmount, allOrderItems };
  });
}

const getOrderById = async (orderId, restaurantId) => {
  return prisma.order.findUnique({
    where: {
      id: parseInt(orderId),
          restaurantId: parseInt(restaurantId),
    },
    include: {
      orderItems: true,
    },
  });
};

async function completeOrder(orderId, restaurantId) {
 // no transaction needed here
  return prisma.order.update({
    where: {
      id: parseInt(orderId),
      restaurantId: parseInt(restaurantId),
    },
    data: {
      status: "Finalized",
    },
    include: {
      orderItems: true,
    },
  });
}
async function getOpenOrderByReservationId(reservationId, restaurantId) {
  return prisma.order.findFirst({
    where: {
      reservationId: parseInt(reservationId),
      restaurantId: parseInt(restaurantId),
      status: "Open",
    },
    include: {
      orderItems: true,
    },
  });
}
async function getOrderByReservationId(reservationId, restaurantId) {
  return prisma.order.findMany({
    where: {
      reservationId: parseInt(reservationId),
      restaurantId: parseInt(restaurantId),
    },
    include: {
      orderItems: true,
    },
  });
}

module.exports = {
  getMenuItemById,
  createOrder,
  createOrderItems,
  updateReservationStatus,
  createOrderWithItemsAndStatus,
  updateOrderWithItems,
  getOrderById,
  completeOrder,
  getOpenOrderByReservationId,
  getOrderByReservationId,
};
