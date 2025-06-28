const router = require("express").Router({ mergeParams: true
}); // mergeParams allows access to restaurantId from parent router
const controller = require("./table.controller");
const validate = require("../middleware/validate");
const { tableSchema } = require("../validation/table.validation");
const methodNotAllowed = require("../error/methodNotAllowed");

router
    .route("/")
    .get(controller.getAllTables)
    .post(validate(tableSchema), controller.createTable)
    .all(methodNotAllowed);

router.route("/:tableId")
    .get(controller.getTable)
    .put(validate(tableSchema), controller.updateTable)
    .delete(controller.deleteTable)
    .all(methodNotAllowed);

module.exports = router;


