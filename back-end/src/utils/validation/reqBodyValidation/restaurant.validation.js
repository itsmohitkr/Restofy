const Joi = require("joi");

const restaurantSchema = Joi.object({
  restaurantName: Joi.string().min(3).max(100).required().messages({
    "string.base": "restaurantName must be a string.",
    "string.empty": "restaurantName is required.",
    "string.min": "restaurantName must be at least 3 characters.",
    "string.max": "restaurantName must be at most 100 characters.",
    "any.required": "restaurantName is required.",
  }),
    
  restaurantLocation: Joi.string().min(2).max(100).required().messages({
    "string.base": "restaurantLocation must be a string.",
    "string.empty": "restaurantLocation is required.",
    "string.min": "restaurantLocation must be at least 2 characters.",
    "string.max": "restaurantLocation must be at most 100 characters.",
    "any.required": "restaurantLocation is required.",
  }),

  restaurantEmail: Joi.string().email().required().messages({
    "string.base": "restaurantEmail must be a string.",
    "string.email": "restaurantEmail must be a valid email address.",
    "string.empty": "restaurantEmail is required.",
    "any.required": "restaurantEmail is required.",
  }),
  
  restaurantPhoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "restaurantPhoneNumber must be exactly 10 digits.",
      "string.empty": "restaurantPhoneNumber is required.",
      "any.required": "restaurantPhoneNumber is required.",
    }),
  restaurantDescription: Joi.string().min(5).max(500).required().messages({
    "string.base": "restaurantDescription must be a string.",
    "string.empty": "restaurantDescription is required.",
    "string.min": "restaurantDescription must be at least 5 characters.",
    "string.max": "restaurantDescription must be at most 500 characters.",
    "any.required": "restaurantDescription is required.",
  }),
  restaurantAddress: Joi.string().min(5).max(200).required().messages({
    "string.base": "restaurantAddress must be a string.",
    "string.empty": "restaurantAddress is required.",
    "string.min": "restaurantAddress must be at least 5 characters.",
    "string.max": "restaurantAddress must be at most 200 characters.",
    "any.required": "restaurantAddress is required.",
  }),
})

module.exports = { restaurantSchema };
