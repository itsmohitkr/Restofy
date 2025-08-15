const router = require("express").Router();
const controller = require("./auth.controller");
const methodNotAllowed = require("../../shared/error/methodNotAllowed");
const validate = require("../../shared/middleware/validate");
const {
  userSchema,
} = require("../../utils/validation/reqBodyValidation/user.validation");
const {
  forgotPasswordSchema,
} = require("../../utils/validation/reqBodyValidation/forgot-password.validation");
const {
  resetPasswordSchema,
} = require("../../utils/validation/reqBodyValidation/reset-password.validation");
const {
  loginSchema,
} = require("../../utils/validation/reqBodyValidation/login.validation");




router
  .route("/login")
  .post(validate(loginSchema), controller.login)
  .all(methodNotAllowed);
router
  .route("/signup")
  .post(validate(userSchema), controller.signup)
  .all(methodNotAllowed);

router.route("/logout").post(controller.logout).all(methodNotAllowed);

router.route("/verifyToken").get(controller.verifyToken).all(methodNotAllowed);

router
  .route("/forgot-password")
  .post(validate(forgotPasswordSchema), controller.forgotPassword)
  .all(methodNotAllowed);

router
  .route("/reset-password")
  .post(validate(resetPasswordSchema), controller.resetPassword)
  .all(methodNotAllowed);

module.exports = router;
