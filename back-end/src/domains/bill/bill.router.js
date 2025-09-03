const router = require("express").Router({ mergeParams: true });
const controller = require("./bill.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router
  .route("/:billId")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_BILL), controller.getBill)
  .all(methodNotAllowed);

router
  .route("/")
  .post(requirePermission(PERMISSIONS.CAN_CREATE_BILL), controller.createBill)
  .get(
    requirePermission(PERMISSIONS.CAN_VIEW_BILL),
    controller.getBillByOrderId
  )
  .all(methodNotAllowed);

module.exports = router;
