const router = require("express").Router({ mergeParams: true });
const controller = require("./user.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");



router.route("/:userId")
  .get(controller.getUser)
  .put(validate(controller.userSchema), controller.updateUser)
  .delete(controller.deleteUser)
  .all(methodNotAllowed);


router.route("/")
  .post(controller.createUser)
  .get(controller.getAllUsers)
  .all(methodNotAllowed);

  

module.exports = router;