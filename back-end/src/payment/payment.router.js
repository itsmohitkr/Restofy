const router = require("express").Router({ mergeParams: true });
const controller = require("./payment.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");

// url: /:reservationId/order/:orderId/bill/:billId/payment
router.route("/").post(controller.makePayment).all(methodNotAllowed);

module.exports = router;
