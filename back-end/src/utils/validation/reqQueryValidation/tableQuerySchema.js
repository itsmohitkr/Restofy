
const Joi = require("joi");

const tableQuerySchema = Joi.object({
  tableName: Joi.string().min(3).max(50).disallow("").optional().messages({
    "string.base": "Table name must be a string.",
    "string.empty": "Table name cannot be empty.",
    "string.min": "Table name must be at least 3 characters.",
    "string.max": "Table name must be at most 50 characters.",
  }),
  tableCapacity: Joi.number()
    .integer()
    .positive()
    .min(1)
    .disallow("")
    .optional()
    .messages({
      "number.base": "Table capacity must be a number.",
      "number.integer": "Table capacity must be an integer.",
      "number.min": "Table capacity must be at least 1.",
    }),
  tableType: Joi.string()
    .valid("Regular", "VIP", "Outdoor")
    .disallow("")
    .optional()
    .messages({
      "any.only":
        'Table type must be one of the following: "Regular", "VIP", or "Outdoor".',
    }),
  tableStatus: Joi.string()
    .valid("Available", "Reserved", "Occupied")
    .disallow("")
    .optional()
    .messages({
      "any.only":
        'Table status must be one of the following: "Available", "Reserved", or "Occupied".',
    }),
}); 

module.exports = { tableQuerySchema };