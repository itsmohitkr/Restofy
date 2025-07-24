const router = require("express").Router({ mergeParams: true });
const controller = require("./payment.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");

router.route("/").post(controller.makePayment).all(methodNotAllowed);

module.exports = router;
