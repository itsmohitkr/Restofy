const router = require("express").Router({ mergeParams: true });
const controller = require("./payment.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router.route("/").post(
    requirePermission(PERMISSIONS.CAN_MAKE_PAYMENT),
    controller.makePayment).all(methodNotAllowed);

module.exports = router;
