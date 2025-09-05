
const prisma = require("../../infrastructure/database/prisma/client");
const getProfileByEmail = async (email) => {
    // Logic to get user profile by email
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            isVerified: true,
            isActive: true,
        },
    });
};

const updateProfile = async (email, profileData) => {
    // Logic to update user profile
    return await prisma.user.update({
        where: { email },
        data: profileData,
    });
};

const deleteProfile = async (email) => {
    // Logic to delete user profile
    return await prisma.user.delete({
        where: { email },
    });
};

module.exports = {
    getProfileByEmail,
    updateProfile,
    deleteProfile,
};