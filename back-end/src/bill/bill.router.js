const router = require("express").Router({ mergeParams: true });
const controller = require("./bill.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { payment } = require("../../prisma/client");
const paymentRoutes = require("../payment/payment.router");



router.use("/:billId/payment", paymentRoutes);

//  url: /:reservationId/order/:orderId/bill
router.route("/:billId").get(controller.getBill).all(methodNotAllowed);

router.route("/")
    .post(controller.createBill)
    .all(methodNotAllowed);



    module.exports = router;

  