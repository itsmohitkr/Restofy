const Joi = require('joi');



const reservationQuerySchema = Joi.object({
  firstName: Joi.string().min(3).max(50).disallow("").optional().messages({
    "string.empty": "First name is required",
    "string.base": "First name must be a string",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
  }),
  lastName: Joi.string().min(3).max(50).disallow("").optional().messages({
    "string.empty": "Last name is required",
    "string.base": "Last name must be a string",
    "string.min": "Last name must be at least 3 characters long",
    "string.max": "Last name must be at most 50 characters long",
  }),
  email: Joi.string().email().disallow("").optional().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email address",
  }),
  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .disallow("")
    .optional()
    .messages({
      "string.empty": "Contact is required",
      "string.base": "Contact must be a string",
      "string.pattern.base": "Contact must be a 10 digit number",
    }),
  status: Joi.string()
    .valid("Booked", "Cancelled", "Completed", "Seated", "Order Placed")
    .disallow("")
    .optional()
    .messages({
      "any.only":
        "Status must be one of the following: 'Booked', 'Cancelled', 'Completed', 'Seated', or 'Order Placed'",
      "string.base": "Status must be a string",
    }),
  reservationTime: Joi.date().iso().disallow("").optional().messages({
    "date.base": "Reservation time must be a valid date",
    "date.iso": "Reservation time must be in ISO format (YYYY-MM-DDTHH:mm:ssZ)",
  }),
});

module.exports = { reservationQuerySchema };
