const router = require("express").Router({ mergeParams: true });
const controller = require("./bill.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");

router.route("/:billId").get(controller.getBill).all(methodNotAllowed);

router.route("/").post(controller.createBill).all(methodNotAllowed);

module.exports = router;
