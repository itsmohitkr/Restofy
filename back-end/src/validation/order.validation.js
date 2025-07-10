const Joi = require("joi");


const orderSchema = Joi.object({


  orderItems: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.number().integer().positive().required().messages({
          "number.base": "Menu item ID must be a valid integer.",
          "any.required": "Menu item ID is required.",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a valid integer.",
          "number.min": "Quantity must be at least 1.",
          "any.required": "Quantity is required.",
        }),
        notes: Joi.string().max(500).optional().messages({
          "string.base": "Notes must be a string.",
          "string.max": "Notes must not exceed 500 characters.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Order items must be an array.",
      "array.min": "Order must have at least one item.",
      "any.required": "Order items are required.",
    }),
});


module.exports = { orderSchema };
