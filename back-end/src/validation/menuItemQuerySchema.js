const Joi = require("joi");

const menuItemQuerySchema = Joi.object({
  itemName: Joi.string().min(1).max(50).disallow("").optional().messages({
    "string.base": "Item name must be a string.",
    "string.empty": "Item name cannot be empty.",
    "string.min": "Item name must be at least 1 character long.",
    "string.max": "Item name must not exceed 50 characters.",
  }),

  itemType: Joi.string()
    .valid("Veg", "Non-Veg")
    .disallow("")
    .optional()
    .messages({
      "any.only": "Item type must be one of the following: 'Veg', 'Non-Veg'.",
    }),
  itemCategory: Joi.string()
    .valid(
      "General",
      "Main Course",
      "Dessert",
      "Beverage",
      "Breakfast",
      "Lunch",
      "Snacks",
      "Dinner"
    )
    .disallow("")
    .optional()
    .messages({
      "any.only":
        "Item category must be one of the following: 'General', 'Main Course', 'Dessert', 'Beverage', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'.",
    }),
  itemStatus: Joi.string()
    .valid("Available", "Unavailable")
    .disallow("")
    .optional()
    .messages({
      "any.only":
        "Item status must be one of the following: 'Available', 'Unavailable'.",
    }),
  itemRating: Joi.number().min(0).max(5).disallow("").optional().messages({
    "number.base": "Item rating must be a number.",
    "number.min": "Item rating must be at least 0.",
    "number.max": "Item rating must not exceed 5.",
  }),
});

module.exports = { menuItemQuerySchema };
