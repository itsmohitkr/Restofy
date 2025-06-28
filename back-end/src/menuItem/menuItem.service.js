const prisma = require('../../prisma/client');

const createMenuItem = async (menuItemData) => {
  return await prisma.menuItem.create({ data: menuItemData });
};

const getMenuItem = async (menuItemId) => {
  return await prisma.menuItem.findUnique({ where: { id: Number(menuItemId) } });
};

const updateMenuItem = async (menuItemId, menuItemData) => {
  return await prisma.menuItem.update({ where: { id: Number(menuItemId) }, data: menuItemData });
};

const deleteMenuItem = async (menuItemId) => {
  return await prisma.menuItem.delete({ where: { id: Number(menuItemId) } });
};
const getAllMenuItems = async (menuId) => {
  return await prisma.menuItem.findMany({
    where: { menuId: Number(menuId) },
    orderBy: { itemName: "asc" },
  });
};

module.exports = {
  createMenuItem,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
}; 