const prisma = require("../../prisma/client");

const read = async (email) => {
  let user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return user;
  }
  // Try Employee table
  let employee = await prisma.restaurantEmployee.findUnique({
    where: { email },
  });
  if (employee) {
    return employee;
  }
  return null;
};

const createUser = async (userData) => {
  const createdUser = await prisma.user.create({
    data: userData,
    include: {
      address: true, // Include the restaurant owners relation
    },
  });
  if (createdUser.password) {
    delete createdUser.password; // Remove password from the response
  }
  return createdUser;
};

module.exports = {
  read,
  createUser,
};
