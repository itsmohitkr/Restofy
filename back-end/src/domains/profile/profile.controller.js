const asyncErrorBoundary = require("../../shared/error/asyncErrorBoundary");
const { sendErrorResponse, sendSuccessResponse } = require("../../utils/helper/responseHelpers");
const { StatusCodes } = require("http-status-codes");

const service = require("./profile.service");
const { verifyTokenv2 } = require("../../shared/services/tokenServiceV2");


const getProfile = async (req, res) => {
    // Logic to get user profile

    const token = req.cookies?.token;

    const decoded = await verifyTokenv2(token, "ACCESS_TOKEN");

    const profile = await service.getProfileByEmail(decoded.email);
    if (!profile) {
        return sendErrorResponse(res, StatusCodes.NOT_FOUND, "Profile not found", "Not Found");
    }
    return sendSuccessResponse(res, StatusCodes.OK, "Profile retrieved successfully", profile);
};

const updateProfile = async (req, res) => {
    // Logic to update user profile
    const token = req.cookies?.token;

    const decoded = await verifyTokenv2(token, "ACCESS_TOKEN");
    const updatedProfile = await service.updateProfile(decoded.email, req.body);    
    return sendSuccessResponse(res, StatusCodes.OK, "Profile updated successfully", updatedProfile);
};



module.exports = {
    getProfile: asyncErrorBoundary(getProfile),
    updateProfile: asyncErrorBoundary(updateProfile),
};