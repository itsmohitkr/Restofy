const prisma = require('../../infrastructure/database/prisma/client');

const createMenu = async (menuData) => {
  return await prisma.menu.create(
    {
      data: menuData 
    }
  );
};

const getMenu = async (menuId) => {
  return await prisma.menu.findUnique({
    where: {
      id: Number(menuId)
    }
  });
};
const getMenuByRestaurantId = async (restaurantId) => {
  return await prisma.menu.findFirst({
    where: {
      restaurantId: Number(restaurantId)
    }
  });
}

const deleteMenu = async (menuId) => {
  return await prisma.menu.delete({ where: { id: Number(menuId) } });
};

module.exports = {
  createMenu,
  getMenu,
  deleteMenu,
  getMenuByRestaurantId
}; 