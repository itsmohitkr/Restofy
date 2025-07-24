
const prisma = require("../../infrastructure/database/prisma/client");

const createTable = async (tableData) => {
    return await prisma.table.create({
        data: tableData,
    });
}

const getAllTables = async (filter) => {
    return await prisma.table.findMany({
        where: filter,
        orderBy: {
            tableName: 'asc',
        },
    });
};
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

const searchTablesByKeyword = async (keyword, restaurantId) => {
    return await prisma.table.findMany({
        where: {
            restaurantId: Number(restaurantId),
            OR: [
                { tableName: { contains: keyword, mode: 'insensitive' } },
                { tableType: { contains: keyword, mode: 'insensitive' } },
                { tableStatus: { contains: keyword, mode: 'insensitive' } },
            ],
        },
        orderBy: {
            tableName: 'asc',
        },
    });
}

const getTableByName = async (tableName, restaurantId) => {
    return await prisma.table.findFirst({
        where: { tableName, restaurantId: Number(restaurantId) },
    });
}


module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
  searchTablesByKeyword,
  getTableByName,
};  