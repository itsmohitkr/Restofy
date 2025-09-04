const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getMonthYear(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

async function getAnalytics(restaurantId) {
  restaurantId = Number(restaurantId);

  // Orders
  const ordersCount = await prisma.order.count({
    where: { restaurantId },
  });
  const ordersTotal = await prisma.order.aggregate({
    where: { restaurantId },
    _sum: { totalAmount: true },
    _avg: { totalAmount: true },
    _max: { totalAmount: true },
    _min: { totalAmount: true },
  });
  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    where: { restaurantId },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const recentOrders = await prisma.order.findMany({
    where: { restaurantId },
    orderBy: { placedAt: "desc" },
    take: 5,
    include: { orderItems: true },
  });

  // Reservations
  const reservationsCount = await prisma.reservation.count({
    where: { restaurantId },
  });
  const reservationsStatus = await prisma.reservation.groupBy({
    by: ["status"],
    where: { restaurantId },
    _count: { id: true },
  });
  const upcomingReservations = await prisma.reservation.findMany({
    where: {
      restaurantId,
      reservationTime: { gte: new Date() },
    },
    orderBy: { reservationTime: "asc" },
    take: 5,
  });
  const reservationsByDay = await prisma.reservation.groupBy({
    by: ["reservationTime"],
    where: { restaurantId },
    _count: { id: true },
  });

  // Tables
  const tablesCount = await prisma.table.count({
    where: { restaurantId },
  });
  const tablesOccupied = await prisma.table.count({
    where: { restaurantId, tableStatus: "Occupied" },
  });
  const tablesAvailable = await prisma.table.count({
    where: { restaurantId, tableStatus: "Available" },
  });
  const tablesByType = await prisma.table.groupBy({
    by: ["tableType"],
    where: { restaurantId },
    _count: { id: true },
  });

  // Customers
  const customersCount = await prisma.user.count({
    where: {
      role: "Customer",
      restaurants: { some: { restaurantId } },
    },
  });
  const recentCustomers = await prisma.user.findMany({
    where: {
      role: "Customer",
      restaurants: { some: { restaurantId } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
    },
  });

  // Group customers by month in JS
  const customers = await prisma.user.findMany({
    where: {
      role: "Customer",
      restaurants: { some: { restaurantId } },
    },
    select: { id: true, createdAt: true },
  });
  const customersByMonth = customers.reduce((acc, curr) => {
    const key = getMonthYear(curr.createdAt);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Menu Items
  const menuItemsCount = await prisma.menuItem.count({
    where: {
      menu: { restaurantId },
    },
  });
  const menuItemsByCategory = await prisma.menuItem.groupBy({
    by: ["itemCategory"],
    where: {
      menu: { restaurantId },
    },
    _count: { id: true },
  });
  const menuItemsAggregate = await prisma.menuItem.aggregate({
    where: {
      menu: { restaurantId },
    },
    _avg: { itemPrice: true },
    _max: { itemPrice: true },
    _min: { itemPrice: true },
  });

  // Bills & Payments
  const billsCount = await prisma.bill.count({
    where: { restaurantId },
  });
  const billsByStatus = await prisma.bill.groupBy({
    by: ["status"],
    where: { restaurantId },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const paymentsByMethod = await prisma.payment.groupBy({
    by: ["method"],
    where: {
      bill: { restaurantId },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  return {
    orders: {
      count: ordersCount,
      totalAmount: ordersTotal._sum.totalAmount || 0,
      averageAmount: ordersTotal._avg.totalAmount || 0,
      maxAmount: ordersTotal._max.totalAmount || 0,
      minAmount: ordersTotal._min.totalAmount || 0,
      byStatus: ordersByStatus,
      recent: recentOrders,
    },
    reservations: {
      count: reservationsCount,
      statusStats: reservationsStatus,
      byDay: reservationsByDay,
      upcoming: upcomingReservations,
    },
    tables: {
      count: tablesCount,
      occupied: tablesOccupied,
      available: tablesAvailable,
      byType: tablesByType,
    },
    customers: {
      count: customersCount,
      recent: recentCustomers,
      byMonth: customersByMonth,
    },
    menuItems: {
      count: menuItemsCount,
      byCategory: menuItemsByCategory,
      averagePrice: menuItemsAggregate._avg.itemPrice || 0,
      maxPrice: menuItemsAggregate._max.itemPrice || 0,
      minPrice: menuItemsAggregate._min.itemPrice || 0,
    },
    bills: {
      count: billsCount,
      byStatus: billsByStatus,
    },
    payments: {
      byMethod: paymentsByMethod,
    },
  };
}

module.exports = {
  getAnalytics,
};