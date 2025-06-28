const prisma = require('../../prisma/client');

const createRestaurant = async (restaurantData) => {
    return await prisma.restaurant.create({
      data: restaurantData,
    });
}

const getRestaurant = async (restaurantId) => {
    
    return await prisma.restaurant.findUnique({
        where: {
            restaurantId: Number(restaurantId),
        },
    });
};

const updateRestaurant = async (restaurantId, restaurantData,ownerId) => {
    return await prisma.restaurant.update({
        where: {
            restaurantId: Number(restaurantId),
            ownerId: Number(ownerId),
         },
        data: restaurantData,
    });
}

const deleteRestaurant = async (restaurantId,ownerId) => {
    return await prisma.restaurant.delete({
        where: {
            restaurantId: Number(restaurantId),
            ownerId: Number(ownerId),
         },
    });

}

const getAllRestaurants = async (ownerId) => {
    return await prisma.restaurant.findMany({
        where: {
            ownerId: Number(ownerId),
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