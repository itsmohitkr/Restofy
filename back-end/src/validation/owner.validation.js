const Joi = require("joi");

const restaurantOwnerSchema = Joi.object({
  ownerName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Owner name must be a string.",
    "string.empty": "Owner name is required.",
    "string.min": "Owner name must be at least 3 characters.",
    "string.max": "Owner name must be at most 30 characters.",
    "any.required": "Owner name is required.",
  }),
  ownerEmail: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  ownerPhoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),
  ownerPassword: Joi.string().min(4).max(30).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must be at most 30 characters.",
    "any.required": "Password is required.",
  }),
});

module.exports = { restaurantOwnerSchema };
