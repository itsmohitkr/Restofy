const router = require("express").Router({ mergeParams: true
}); // mergeParams allows access to restaurantId from parent router
const controller = require("./table.controller");
const validate = require("../middleware/validate");
const { tableSchema } = require("../validation/table.validation");
const methodNotAllowed = require("../error/methodNotAllowed");
const { isRestaurantExist } = require("../restaurant/restaurant.controller");
const { validateParam } = require("../middleware/validateParam");
const { checkRestaurantOwnership } = require("../middleware/checkRestaurantOwnership");
const { tableQuerySchema } = require("../validation/tableQuerySchema");

// Middleware to check if the restaurant exists
router.use(validateParam("restaurantId"));
router.use(isRestaurantExist);
router.use(checkRestaurantOwnership);

router
  .route("/")
  .get(validate(tableQuerySchema), controller.getAllTables)
  .post(validate(tableSchema), controller.createTable)
    .all(methodNotAllowed);
  
router.route("/search").get(controller.searchTablesByKeyword).all(methodNotAllowed);

router.route("/:tableId")
    .get(controller.getTable)
    .put(validate(tableSchema), controller.updateTable)
    .delete(controller.deleteTable)
    .all(methodNotAllowed);

// router
//     .route("/:tableId/assign")
//     .put(controller.assignReservationToTable)
//     .all(methodNotAllowed);

module.exports = router;


