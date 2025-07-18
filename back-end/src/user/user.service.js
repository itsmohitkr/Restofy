const prisma = require("../../prisma/client");

const create = async (userData) => {
  return await prisma.restaurantEmployee.create({
      data: userData,
  });
};
const read = async (email) => {
  return await prisma.restaurantEmployee.findUnique({
    where: {
      email: email,
    },
  });
};

module.exports = {
  create,
  read,
};
