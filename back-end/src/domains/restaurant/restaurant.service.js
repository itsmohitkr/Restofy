const prisma = require('../../infrastructure/database/prisma/client');

const createRestaurant = async (restaurantData) => {
    
    return await prisma.restaurant.create({
      data: restaurantData,
    });
}

const getRestaurant = async (restaurantId,userId) => {
    
    return await prisma.restaurant.findUnique({
        where: {
            restaurantId: Number(restaurantId),
            userId: Number(userId),
        },
    });
};

const updateRestaurant = async (restaurantId, restaurantData,userId) => {
    return await prisma.restaurant.update({
        where: {
            restaurantId: Number(restaurantId),
            userId: Number(userId),
         },
        data: restaurantData,
    });
}

const deleteRestaurant = async (restaurantId,userId) => {
    return await prisma.restaurant.delete({
        where: {
            restaurantId: Number(restaurantId),
            userId: Number(userId),
         },
    });
}

const getAllRestaurants = async (userId) => {
    return await prisma.restaurant.findMany({
        where: {
            userId: Number(userId),
        },
        orderBy: {
            restaurantName: 'asc',
        },
    });
};


module.exports = {
    createRestaurant,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurants
};