const Joi = require('joi');

// model MenuItem {
//   id                Int         @id @default(autoincrement())
//   itemName          String
//   itemDescription   String?
//   itemPrice         Float
//   itemImage         String?

//   menuId            Int
//   menu              Menu        @relation(fields: [menuId], references: [id])

//   createdAt         DateTime    @default(now())
//   updatedAt         DateTime    @updatedAt
// }

const menuItemSchema = Joi.object({
    itemName: Joi.string().min(1).max(255).required().messages({
        'string.base': 'Item name must be a string.',
        'string.empty': 'Item name is required.',
        'string.min': 'Item name must be at least 1 character long.',
        'string.max': 'Item name must not exceed 255 characters.',
        'any.required': 'Item name is required.',
    }),
    
    itemDescription: Joi.string().max(500).allow(null).messages({
        'string.base': 'Item description must be a string.',
        'string.max': 'Item description must not exceed 500 characters.',
    }),
    
    itemPrice: Joi.number().positive().required().messages({
        'number.base': 'Item price must be a number.',
        'number.positive': 'Item price must be a positive number.',
        'any.required': 'Item price is required.',
    }),
    
    itemImage: Joi.string().uri().allow(null).messages({
        'string.base': 'Item image must be a string.',
        'string.uri': 'Item image must be a valid URL.',
    }),
    
});

module.exports = { menuItemSchema }; 