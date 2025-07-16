const prisma = require("../../prisma/client");

const create = async (ownerData) => {
  return await prisma.restaurantOwner.create({
    data: ownerData,
  });
};
const read = async (ownerEmail) => {
  return await prisma.restaurantOwner.findUnique({
    where: {
      ownerEmail: ownerEmail,
    },
  });
};

module.exports = {
  create,
  read,
};
