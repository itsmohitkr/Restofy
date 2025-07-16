
const prisma = require("../../prisma/client");

const read = async (email) => {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
}

const createUser= async (userData) => {
  const createdUser= await prisma.user.create({
    data: userData,
    include: {
      address: true, // Include the restaurant owners relation
    },
  });
  if(createdUser.password) {
    delete createdUser.password; // Remove password from the response
  }
  return createdUser;
};
    
module.exports = {
  read,
  createUser,
};