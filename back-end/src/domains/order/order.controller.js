const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const prisma = require("../../infrastructure/database/prisma/client");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/helper/responseHelpers");
const { StatusCodes } = require("http-status-codes");
const service = require("./order.service");
const { all } = require("./order.router");
const { validateParam } = require("../../shared/middleware/validateParam");

// url : /api/restaurants/:restaurantId/reservations/:reservationId/orders

const createOrder = async (req, res) => {
  const { reservationId, restaurantId } = req.params;
  const { orderItems } = req.body;
  const { reservation } = res.locals;
  const { tableId, status } = reservation;

  if (status !== "Seated") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order can only be created for seated reservations",
      "Invalid Reservation Status"
    );
  }
  if (!orderItems || orderItems.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order items are required",
      "Missing Order Items"
    );
  }

  let totalAmount = 0;
  const menuItemsMap = {};

  for (const order of orderItems) {
    const menuItem = await service.getMenuItemById(
      order.menuItemId,
      restaurantId
    );
    if (!menuItem) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        `Menu item with ID ${order.menuItemId} not found`,
        "Menu Item Not Found"
      );
    }
    if (menuItem.itemStatus !== "Available") {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        `Menu item with ID ${order.menuItemId} is not available`,
        "Menu Item Not Available"
      );
    }
    totalAmount += menuItem.itemPrice * order.quantity;
    menuItemsMap[order.menuItemId] = menuItem;
  }

  const orderData = {
    totalAmount,
    tableId: tableId || null,
    reservationId: parseInt(reservationId),
    restaurantId: parseInt(restaurantId),
  };

  const orderItemsData = orderItems.map((item) => ({
    quantity: item.quantity,
    notes: item.notes || null,
    price: menuItemsMap[item.menuItemId].itemPrice,
    menuItemId: item.menuItemId,
    restaurantId: parseInt(restaurantId),
    // orderId will be attached in the service
  }));

  // Use the transactional service function
  const order = await service.createOrderWithItemsAndStatus(
    orderData,
    orderItemsData
  );

  sendSuccessResponse(res, StatusCodes.CREATED, "Order created successfully", {
    orderId: order.id,
    totalAmount,
    orderItems: orderItemsData,
  });
};


const getOrder = async (req, res) => {
  const order = res.locals.order;
  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Order retrieved successfully",
    order
  );
};
const isOrderExist = async (req, res, next) => {
  const { orderId } = req.params;
  const { restaurantId, reservationId } = req.params;

  const order = await service.getOrderById(orderId, restaurantId);
  if (!order) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Order with ID ${orderId} not found in restaurant ID ${restaurantId}`,
      "Order Not Found"
    );
  }
  if (order.reservationId !== parseInt(reservationId)) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Reservation with Id ${reservationId} does not have open order with ID ${orderId}`,
      "Order Not Found"
    );
  }
  res.locals.order = order;
  next();
};

const updateOrder = async (req, res) => {
  const { orderId, restaurantId } = req.params;
  const { orderItems } = req.body;

  const { reservation } = res.locals;
  const { status } = reservation;
  if (status !== "Seated") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order can only be updated for seated reservations",
      "Invalid Reservation Status"
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order items are required",
      "Missing Order Items"
    );
  }

  const order = res.locals.order;
  if (order.status !== "Open") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order can only be updated if it is in 'Open' status",
      "Invalid Order Status"
    );
  }

  // Validate and prepare new order items
  const menuItemsMap = {};
  for (const orderItem of orderItems) {
    const menuItem = await service.getMenuItemById(
      orderItem.menuItemId,
      restaurantId
    );
    if (!menuItem) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        `Menu item with ID ${orderItem.menuItemId} not found`,
        "Menu Item Not Found"
      );
    }
    if (menuItem.itemStatus !== "Available") {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        `Menu item with ID ${orderItem.menuItemId} is not available`,
        "Menu Item Not Available"
      );
    }
    menuItemsMap[orderItem.menuItemId] = menuItem;
  }

  const orderItemsData = orderItems.map((item) => ({
    quantity: item.quantity,
    notes: item.notes || null,
    price: menuItemsMap[item.menuItemId].itemPrice,
    menuItemId: item.menuItemId,
    orderId: parseInt(orderId),
    restaurantId: parseInt(restaurantId),
  }));

  const updatedOrder = await service.updateOrderWithItems(
    orderId,
    orderItemsData,
    restaurantId
  );

  sendSuccessResponse(res, StatusCodes.OK, "Order updated successfully", {
    orderId: updatedOrder.updated.id,
    totalAmount: updatedOrder.totalAmount,
    orderItems: updatedOrder.allOrderItems,
  });
};
const completeOrder = async (req, res) => {
  const { orderId, restaurantId } = req.params;
  const order = res.locals.order;

  if (order.status !== "Open") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order can only be completed if it is in 'Open' status",
      "Invalid Order Status"
    );
  }

  const updatedOrder = await service.completeOrder(orderId, restaurantId);

  sendSuccessResponse(
    res,
    StatusCodes.OK,
    "Order completed successfully",
    updatedOrder
  );
};

const isOpenOrder = async (req, res, next) => {
  const { reservationId, restaurantId } = req.params;
  const order = await service.getOpenOrderByReservationId(
    reservationId,
    restaurantId
  );
  if (order) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Open order already exists for reservation ID ${reservationId} in restaurant ID ${restaurantId}`,
      "Open Order Exists"
    );
  }
  next();
};

const getAllOrders = async (req, res) => {
  const { reservationId, restaurantId } = req.params;
  const orders = await service.getOrderByReservationId(
    reservationId,
    restaurantId
  );
  if (!orders || orders.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `No orders found for reservation ID ${reservationId} in restaurant ID ${restaurantId}`,
      "Orders Not Found"
    );
  }
  sendSuccessResponse(res, StatusCodes.OK, "Orders retrieved successfully", orders);
};

module.exports = {
  createOrder: [isOpenOrder, asyncErrorBoundary(createOrder)],
  getOrder: [
    validateParam("orderId"),
    isOrderExist,
    asyncErrorBoundary(getOrder),
  ],
  updateOrder: [
    validateParam("orderId"),
    isOrderExist,
    asyncErrorBoundary(updateOrder),
  ],
  completeOrder: [
    validateParam("orderId"),
    isOrderExist,
    asyncErrorBoundary(completeOrder),
  ],

  isOrderExist: [validateParam("orderId"), isOrderExist],
  getAllOrders: [validateParam("reservationId"), getAllOrders]
};
