const prisma = require("../../infrastructure/database/prisma/client");

const create = async (userData) => {
  return await prisma.restaurantEmployee.create({
      data: userData,
  });
};
const read = async (userId, restaurantId) => {
  return await prisma.restaurantEmployee.findUnique({
    where: {
      id: Number(userId),
      restaurantId: Number(restaurantId),
    },
  });
};
const getAllUsers = async (restaurantId, userId) => {
  return await prisma.restaurantEmployee.findMany({
    where: {
      restaurantId: Number(restaurantId),
      addedByUserId: Number(userId),
    },
    include: {
      address: true,
    },
  });
};

module.exports = {
  create,
  read,
  getAllUsers,
};
