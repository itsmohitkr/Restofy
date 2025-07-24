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

router
  .route("/")
  .get(validate(tableQuerySchema), controller.getAllTables)
  .post(validate(tableSchema), controller.createTable)
  .all(methodNotAllowed);

router
  .route("/search")
  .get(controller.searchTablesByKeyword)
  .all(methodNotAllowed);

router
  .route("/:tableId")
  .get(controller.getTable)
  .put(validate(tableSchema), controller.updateTable)
  .delete(controller.deleteTable)
  .all(methodNotAllowed);

module.exports = router;
