const express = require('express');
const router = express.Router();

const adminRoutes = require('../admin/admin.router');
const authRoutes = require('../domains/authentication/auth.router');
const v1Routes = require("./v1/index");
const { restrictToAuthenticatedUser } = require('../shared/middleware/restrictToLoggedInUser');

router.use("/auth", authRoutes);
router.use(restrictToAuthenticatedUser);

router.use("/v1", v1Routes);

router.use("/admin", adminRoutes);

module.exports = router;