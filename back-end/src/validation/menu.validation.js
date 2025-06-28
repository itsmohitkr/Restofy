const Joi = require('joi');


const menuSchema = Joi.object({
    restaurantId: Joi.number().integer().required().messages({
        'number.base': 'Restaurant ID must be a number.',
        'number.empty': 'Restaurant ID is required.',
        'number.integer': 'Restaurant ID must be an integer.',
        'any.required': 'Restaurant ID is required.',
    }),
    
});

module.exports = { menuSchema }; 