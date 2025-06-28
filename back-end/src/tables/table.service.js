
const prisma = require("../../prisma/client");

const createTable = async (tableData) => {
    return await prisma.table.create({
        data: tableData,
    });
}

const getAllTables = async (restaurantId) => {
    return await prisma.table.findMany({
        where: {
            restaurantId: Number(restaurantId),
        },
        orderBy: {
            tableName: 'asc',
        },
    });
}
const getTableById = async (tableId,restaurantId) => {
    return await prisma.table.findUnique({
        where: {
            id: Number(tableId),
            restaurantId: Number(restaurantId),
        },
    });
};

const updateTable = async (tableId, tableData) => {
    return await prisma.table.update({
        where: {
            id: Number(tableId),
        },
        data: tableData,
    });
}

const deleteTable = async (tableId, restaurantId) => {
    return await prisma.table.delete({
      where: {
        id: Number(tableId),
        restaurantId: Number(restaurantId),
      },
    });
}

const getTableByTableType = async (tableType, restaurantId) => {
    return await prisma.table.findMany({
        where: {
            tableType: tableType,
            restaurantId: Number(restaurantId),
        },
        orderBy: {
            tableName: 'asc',
        },
    });
};



module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
    deleteTable,
  getTableByTableType,
};  