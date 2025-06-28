const router = require("express").Router();
const controller = require("./auth.controller");
const methodNotAllowed = require("../error/methodNotAllowed");
const validate = require("../middleware/validate");
const { restaurantOwnerSchema } = require("../validation/owner.validation");

router.route("/login").post(controller.login).all(methodNotAllowed);
router
  .route("/signup")
  .post(validate(restaurantOwnerSchema), controller.signup)
  .all(methodNotAllowed);
// router.route("/logout").post(controller.logout).all(methodNotAllowed);
router.route("/verifyToken").get(controller.verifyToken).all(methodNotAllowed);
// router
//   .route("/forgot-password")
//   .post(controller.forgotPassword)
//   .all(methodNotAllowed);
// router
//   .route("/reset-password")
//   .post(controller.resetPassword)
//   .all(methodNotAllowed);

module.exports = router;
