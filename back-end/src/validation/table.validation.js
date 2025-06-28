
const Joi = require("joi");

const tableSchema = Joi.object({
    tableName: Joi.string().min(3).max(50).required().messages({
        "string.base": "Table name must be a string.",
        "string.empty": "Table name is required.",
        "string.min": "Table name must be at least 3 characters.",
        "string.max": "Table name must be at most 50 characters.",
        "any.required": "Table name is required.",
    }),
    tableCapacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Table capacity must be a number.",
        "number.integer": "Table capacity must be an integer.",
        "number.min": "Table capacity must be at least 1.",
        "any.required": "Table capacity is required.",
    }),
    
    tableType: Joi.string().valid("Regular", "VIP", "Outdoor").default("Regular").messages({
        "any.only": 'Table type must be one of the following: "Regular", "VIP", or "Outdoor".',
    }),
    // not required
    isAvailable: Joi.boolean().default(true).messages({
        "boolean.base": "Availability must be a boolean value.",

    }),
    
    tableStatus: Joi.string().valid("Available", "Reserved", "Occupied").default("Available").messages({
        "any.only": 'Table status must be one of the following: "Available", "Reserved", or "Occupied".',
    }),
});

module.exports = { tableSchema };
