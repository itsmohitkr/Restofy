const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const { sendErrorResponse } = require("../utils/responseHelpers");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const service = require("./user.service");
const fgaClient = require("../utils/fgaClient");
const { successResponse } = require("../utils/responseBody");


const createUser = async (req, res) => {
    const { ownerName, ownerEmail, ownerPassword, ownerPhoneNumber, role } = req.body;    
    
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    // Create a new owner
    const newUser = {
      ...req.body,
      ownerPassword: hashedPassword,
    };
    const createdUser = await service.create(newUser);

    const response = successResponse(
      StatusCodes.CREATED,
      "User created successfully",
      createdUser
    );
    console.log("User created successfully:", response);
    
    res.status(StatusCodes.CREATED).json(response);   

}
const getUser=async(req, res) => {
    // Logic to get a user by ID
    const userId = req.params.userId;
    res.status(200).json({ message: `User with ID ${userId} retrieved successfully` });
}
const updateUser=async(req, res) => {
    // Logic to update a user by ID
    const userId = req.params.userId;
    res.status(200).json({ message: `User with ID ${userId} updated successfully` });
}
const deleteUser=async(req, res) => {
    // Logic to delete a user by ID
    const userId = req.params.userId;
    res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
}
const getAllUsers=async(req, res) => {
    // Logic to get all users
    res.status(200).json({ message: "All users retrieved successfully" });
}


module.exports = {
    createUser: [asyncErrorBoundary(createUser)],
    getUser: [asyncErrorBoundary(getUser)],
    updateUser: [asyncErrorBoundary(updateUser)],
    deleteUser: [asyncErrorBoundary(deleteUser)],
    getAllUsers: [asyncErrorBoundary(getAllUsers)],
}