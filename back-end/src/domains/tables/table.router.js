const router = require("express").Router({ mergeParams: true });
const controller = require("./table.controller");
const validate = require("../../shared/middleware/validate");
const {
  tableSchema,
} = require("../../utils/validation/reqBodyValidation/table.validation");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const {
  tableQuerySchema,
} = require("../../utils/validation/reqQueryValidation/tableQuerySchema");
const requirePermission = require("../../shared/middleware/requirePermission");
const { PERMISSIONS } = require("../../utils/constants/permissions");

router
  .route("/")
  .get(
    validate(tableQuerySchema),
    requirePermission(PERMISSIONS.CAN_VIEW_TABLE),
    controller.getAllTables
  )
  .post(
    validate(tableSchema),
    requirePermission(PERMISSIONS.CAN_CREATE_TABLE),
    controller.createTable
  )
  .all(methodNotAllowed);

router
  .route("/search")
  .get(
    requirePermission(PERMISSIONS.CAN_SEARCH_TABLE),
    controller.searchTablesByKeyword
  )
  .all(methodNotAllowed);

router
  .route("/:tableId")
  .get(requirePermission(PERMISSIONS.CAN_VIEW_TABLE), controller.getTable)
  .put(
    requirePermission(PERMISSIONS.CAN_UPDATE_TABLE),
    validate(tableSchema),
    controller.updateTable
  )
  .delete(
    requirePermission(PERMISSIONS.CAN_DELETE_TABLE),
    controller.deleteTable
  )
  .all(methodNotAllowed);

module.exports = router;
