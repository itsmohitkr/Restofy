
const express = require("express");
const router = express.Router({ mergeParams: true }); 
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");
const controller = require("./analytics.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");

router.route("/").get(requirePermission(PERMISSIONS.CAN_VIEW_ANALYTICS),controller.getAnalytics).all(methodNotAllowed);

module.exports = router;