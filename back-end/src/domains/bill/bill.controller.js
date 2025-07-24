const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");

const service = require("./bill.service");
const { StatusCodes } = require("http-status-codes");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/helper/responseHelpers");
const { validateParam } = require("../../shared/middleware/validateParam");
const { isOrderExist } = require("../order/order.controller");

const createBill = async (req, res) => {
  const { restaurantId, reservationId, orderId } = req.params;
  const { reservation } = res.locals;
  const {
    restaurantName,
    restaurantPhoneNumber,
    restaurantAddress,
    restaurantEmail,
  } = res.locals.restaurant;
  const { firstName } = res.locals.reservation;
  const { order } = res.locals;
  const { status, orderItems } = order;
  if (status !== "Finalized") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Bill can only be created for Finalized orders",
      "Invalid Order Status"
    );
  }
  if (!orderItems || orderItems.length === 0) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Order items are required to create a bill",
      "Missing Order Items"
    );
  }
  let totalAmount = 0;

  const itemVsQuantity = new Map();
  orderItems.forEach((orderItem) => {
    const { menuItemId, quantity } = orderItem;
    if (itemVsQuantity.has(menuItemId)) {
      itemVsQuantity.set(menuItemId, itemVsQuantity.get(menuItemId) + quantity);
    } else {
      itemVsQuantity.set(menuItemId, quantity);
    }
  });

  // iterate over this map
  const billData = {
    restaurantName,
    restaurantEmail,
    restaurantPhoneNumber,
    restaurantAddress,
    customerName: firstName,
    customerPhoneNumber: reservation.contact,

    restaurantId: Number(restaurantId),
    reservationId: Number(reservationId),
    orderId: Number(orderId),
    totalAmount,
  };
  const billItems = [];
  for (const obj of itemVsQuantity) {
    const [menuItemId, quantity] = obj;
    const menuItem = await service.getMenuItemById(menuItemId, restaurantId);

    const { itemName, itemPrice } = menuItem;
    billItems.push({
      menuItemId,
      itemName,
      quantity,
      price: itemPrice,
      totalPrice: itemPrice * quantity,
    });

    totalAmount += Number(menuItem.itemPrice) * Number(quantity);
  }
  billData.totalAmount = totalAmount;

  // make transaction to create bill and bill items
  const bill = await service.createBill(billData, billItems);

  sendSuccessResponse(
    res,
    StatusCodes.CREATED,
    "Bill created successfully",
    bill
  );
};

const getBill = async (req, res) => {
  const { bill } = res.locals;
  sendSuccessResponse(res, StatusCodes.OK, "Bill retrieved successfully", bill);
};

const isBillExist = async (req, res, next) => {
  const { billId } = req.params;
  const { order } = res.locals;

  const bill = await service.getBillById(billId, order.id);
  if (!bill) {
    return sendErrorResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Bill with ID ${billId} not found for order ID ${order.id}`,
      "Bill Not Found"
    );
  }
  res.locals.bill = bill;
  next();
};
const isBillAlreatExist = async (req, res, next) => {
  const { reservationId, orderId } = req.params;
  const bill = await service.getBillByOrderIdAndReservationId(
    reservationId,
    orderId
  );
  if (bill) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      `Bill already exists for reservation ID ${reservationId} and order ID ${orderId}`,
      "Bill Already Exists"
    );
  }
  next();
};

module.exports = {
  createBill: [isOrderExist, isBillAlreatExist, asyncErrorBoundary(createBill)],
  getBill: [
    isOrderExist,
    validateParam("billId"),
    isBillExist,
    asyncErrorBoundary(getBill),
  ],
  isBillExist: [isOrderExist, validateParam("billId"), isBillExist],
};
