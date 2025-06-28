const Joi = require("joi");

const restaurantSchema = Joi.object({
  restaurantName: Joi.string().min(3).max(100).required().messages({
    "string.base": "Restaurant name must be a string.",
    "string.empty": "Restaurant name is required.",
    "string.min": "Restaurant name must be at least 3 characters.",
    "string.max": "Restaurant name must be at most 100 characters.",
    "any.required": "Restaurant name is required.",
  }),
  restaurantLocation: Joi.string().min(2).max(100).required().messages({
    "string.base": "Location must be a string.",
    "string.empty": "Location is required.",
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be at most 100 characters.",
    "any.required": "Location is required.",
  }),
  restaurantEmail: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  restaurantPhoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),
  restaurantDescription: Joi.string().min(5).max(500).required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 5 characters.",
    "string.max": "Description must be at most 500 characters.",
    "any.required": "Description is required.",
  }),
  restaurantAddress: Joi.string().min(5).max(200).required().messages({
    "string.base": "Address must be a string.",
    "string.empty": "Address is required.",
    "string.min": "Address must be at least 5 characters.",
    "string.max": "Address must be at most 200 characters.",
    "any.required": "Address is required.",
  }),
//   ownerId: Joi.number().integer().required().messages({
//       "number.base": "Owner ID must be a number.",
//       "number.empty": "Owner ID is required.",
//     "number.integer": "Owner ID must be an integer.",
//     "any.required": "Owner ID is required.",
//   }),
});

module.exports = { restaurantSchema };
