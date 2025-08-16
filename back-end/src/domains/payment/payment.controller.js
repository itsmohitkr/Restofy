const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");

const { StatusCodes } = require("http-status-codes");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/helper/responseHelpers");
const service = require("./payment.service");
const { isOrderExist } = require("../order/order.controller");
const { isBillExist } = require("../bill/bill.controller");
const { sendEmailJob } = require("../../shared/services/emailProducer");
const emailTemplates = require("../../utils/constants/emailTemplates");

const makePayment = async (req, res) => {
  const { billId, reservationId, orderId, restaurantId } = req.params;
  const { paymentMethod } = req.body;

  const { bill } = res.locals;
  const { order } = res.locals;

  if (!order || order.status !== "Finalized") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Payment can only be made for finalized orders",
      "Invalid Order Status"
    );
  }
  if (!bill || bill.status !== "Unpaid") {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Bill not found or already paid",
      "Invalid Bill"
    );
  }
  if (!paymentMethod) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Payment method is required",
      "Missing Payment Method"
    );
  }
  const paymentData = {
    amount: bill.totalAmount,
    status: "Completed",
    method: paymentMethod,
    billId: Number(billId),
  };

  const payment = await service.createPayment(
    paymentData,
    billId,
    reservationId,
    orderId,
    restaurantId
  );
  if (!payment) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Payment processing failed",
      "Payment Error"
    );
  }
  sendSuccessResponse(res, StatusCodes.CREATED, payment);
  // Send confirmation email
  const emailTemplate = emailTemplates.PAYMENT_CONFIRMATION(bill);

  sendEmailJob(emailTemplate, "notification.send");
};

module.exports = {
  makePayment: [isOrderExist, isBillExist, asyncErrorBoundary(makePayment)],
};
