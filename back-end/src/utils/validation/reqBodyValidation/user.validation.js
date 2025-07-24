const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string().min(2).max(100).required().messages({
    "string.base": "Street must be a string.",
    "string.empty": "Street is required.",
    "any.required": "Street is required."
  }),
  city: Joi.string().min(2).max(50).required().messages({
    "string.base": "City must be a string.",
    "string.empty": "City is required.",
    "any.required": "City is required."
  }),
  state: Joi.string().min(2).max(50).required().messages({
    "string.base": "State must be a string.",
    "string.empty": "State is required.",
    "any.required": "State is required."
  }),
  country: Joi.string().min(2).max(50).required().messages({
    "string.base": "Country must be a string.",
    "string.empty": "Country is required.",
    "any.required": "Country is required."
  }),
  pinCode: Joi.string().min(4).max(10).required().messages({
    "string.base": "Pin code must be a string.",
    "string.empty": "Pin code is required.",
    "any.required": "Pin code is required."
  }),
  landmark: Joi.string().max(100).allow(null, '').optional(),
});

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.base": "First name must be a string.",
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name must be at most 30 characters.",
    "any.required": "First name is required."
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.base": "Last name must be a string.",
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 2 characters.",
    "string.max": "Last name must be at most 30 characters.",
    "any.required": "Last name is required."
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required."
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.pattern.base": "Phone number must be exactly 10 digits.",
    "string.empty": "Phone number is required.",
    "any.required": "Phone number is required."
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must be at most 30 characters.",
    "any.required": "Password is required."
  }),
  address: addressSchema.optional(),
});

module.exports = { userSchema };
