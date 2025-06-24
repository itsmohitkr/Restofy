
const { StatusCodes } = require("http-status-codes");
const service = require("./auth.service");
const { successResponse } = require("../utils/responseBody");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  const { ownerName, ownerEmail, ownerPhoneNumber, ownerPassword } =
    req.body;
  // Check if the user already exists

  const isOwnerExist = await service.read(ownerEmail);
  if (isOwnerExist) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "Owner already exists",
      error: "Validation Error",
    });
  }
    // Hash the password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    // Create a new owner
    const newOwner = {
        ...req.body,
        ownerPassword: hashedPassword,
    }
    const createdOwner = await service.create(newOwner);

    const response = successResponse(StatusCodes.CREATED, "Owner created successfully", createdOwner);
    res.status(StatusCodes.CREATED).json(response);   

};


module.exports = {
  signup,

//   login,
//   logout,
//   verify,
//   forgotPassword,
//   resetPassword,
};
