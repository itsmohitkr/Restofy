const prisma = require("../../infrastructure/database/prisma/client");

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

// await service.update(user.email, hashedPassword);
const update = async (user, hashedPassword) => {
  const updatedUser = await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  });
  return updatedUser;
};

const resetPassword = async (user, hashedPassword) => {
  // should be done in a transaction
  await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });
    
    await prisma.token.deleteMany({
      where: { userId: user.id },
    });
  });
};

module.exports = {
  read,
  createUser,
  update,
  resetPassword
};
