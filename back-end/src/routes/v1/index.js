const express = require('express');
const router = express.Router();

const restaurantRoutes = require('../../domains/restaurant/restaurant.router');
const tableRoutes = require('../../domains/tables/table.router');
const menuRoutes = require('../../domains/menu/menu.router');
const menuItemRoutes = require('../../domains/menuItem/menuItem.router');
const reservationRoutes = require('../../domains/reservation/reservation.router');
const orderRoutes = require('../../domains/order/order.router');
const billRoutes = require('../../domains/bill/bill.router');
const paymentRoutes = require('../../domains/payment/payment.router');
const { validateParam } = require('../../shared/middleware/validateParam');
const { isRestaurantExist } = require('../../domains/restaurant/restaurant.controller');
const { checkRestaurantOwnership } = require('../../shared/middleware/checkRestaurantOwnership');

// Restaurant routes
router.use("/restaurants", restaurantRoutes);

// Apply middleware to specific pattern
router.use("/restaurants/:restaurantId", validateParam("restaurantId"));
router.use("/restaurants/:restaurantId", isRestaurantExist);
router.use("/restaurants/:restaurantId", checkRestaurantOwnership);

// Table routes
router.use("/restaurants/:restaurantId/table", tableRoutes);

// Menu routes
router.use("/restaurants/:restaurantId/menu", menuRoutes);
router.use("/restaurants/:restaurantId/menu/:menuId/menuItem", menuItemRoutes);

// Reservation routes
router.use("/restaurants/:restaurantId/reservations", reservationRoutes);

// Order routes
router.use("/restaurants/:restaurantId/reservations/:reservationId/order", orderRoutes);

// Bill routes
router.use("/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill", billRoutes);

// Payment routes
router.use("/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill/:billId/payment", paymentRoutes);

module.exports = router;