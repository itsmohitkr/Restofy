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

const updateRestaurant = async (restaurantId, restaurantData) => {
    return await prisma.restaurant.update({
        where: { restaurantId: Number(restaurantId) },
        data: restaurantData,
    });
}

const deleteRestaurant = async (restaurantId) => {
    return await prisma.restaurant.delete({
        where: { restaurantId: Number(restaurantId) },
    });

}

const getAllRestaurants = async () => {
    return await prisma.restaurant.findMany();
};


module.exports = {
    createRestaurant,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurants
};