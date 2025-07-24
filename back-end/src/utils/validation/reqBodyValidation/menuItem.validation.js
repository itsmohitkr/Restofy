const Joi = require("joi");

// model MenuItem {
//   id                Int         @id @default(autoincrement())
//   itemName          String
//   itemDescription   String?
//   itemPrice         Float
//   itemImage         String?
//   isAvailable       Boolean?    @default(true)
//   itemCategory      String      @default("General") // e.g., Appetizer, Main Course, Dessert, Beverage
//   itemType          String? // e.g., Vegetarian, Non-Vegetarian
//   itemStatus        String      @default("Available") // e.g., Available, Unavailable, Seasonal
//   itemRating        Float?     @default(0.0) // Average rating for the item

//   menuId            Int
//   menu              Menu        @relation(fields: [menuId], references: [id], onDelete: Cascade)

//   createdAt         DateTime    @default(now())
//   updatedAt         DateTime    @updatedAt
// }

const menuItemSchema = Joi.object({
  itemName: Joi.string().min(1).max(255).required().messages({
    "string.base": "Item name must be a string.",
    "string.empty": "Item name is required.",
    "string.min": "Item name must be at least 1 character long.",
    "string.max": "Item name must not exceed 255 characters.",
    "any.required": "Item name is required.",
  }),

  itemDescription: Joi.string().max(500).allow(null).messages({
    "string.base": "Item description must be a string.",
    "string.max": "Item description must not exceed 500 characters.",
  }),

  itemPrice: Joi.number().strict().min(0).precision(2).required().messages({
    "number.base": "Item price must be a valid number.",
    "number.min": "Item price must be non-negative.",
    "number.precision": "Item price can have up to 2 decimal places.",
    "any.required": "Item price is required.",
  }),

  itemImage: Joi.string().uri().allow(null).messages({
    "string.base": "Item image must be a string.",
    "string.uri": "Item image must be a valid URL.",
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
    .default("General")
    .messages({
      "string.base": "Item category must be a string.",
      "any.only":
        "Item category must be one of the following: Appetizer, Main Course, Dessert, Beverage, Breakfast, Lunch, Snacks, Dinner.",
      "any.default": "Item category defaults to 'General'.",
    }),
  itemType: Joi.string().optional().valid("Veg", "Non-Veg").messages({
    "string.base": "Item type must be a string.",
    "any.only": "Item type must be one of the following: Veg, Non-Veg.",
  }),
  itemStatus: Joi.string()
    .valid("Available", "Unavailable")
    .optional()
    .messages({
      "string.base": "Item status must be a string.",
      "any.only":
        "Item status must be one of the following: Available, Unavailable.",
    }),
});

module.exports = { menuItemSchema };
