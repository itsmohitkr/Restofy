const Joi = require("joi");


const reservationSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
        "string.base": "First name must be a string.",
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 2 characters.",
        "string.max": "First name must be at most 50 characters.",
        "any.required": "First name is required.",
    }),
    
    lastName: Joi.string().min(2).max(50).required().messages({
        "string.base": "Last name must be a string.",
        "string.empty": "Last name is required.",
        "string.min": "Last name must be at least 2 characters.",
        "string.max": "Last name must be at most 50 characters.",
        "any.required": "Last name is required.",
    }),
    
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    
    contact: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "string.pattern.base": "Contact number must be exactly 10 digits.",
        "string.empty": "Contact number is required.",
        "any.required": "Contact number is required.",
    }),
    
    numberOfGuests: Joi.number().integer().min(1).required().messages({
        "number.base": "Number of guests must be a number.",
        "number.integer": "Number of guests must be an integer.",
        "number.min": "Number of guests must be at least 1.",
        "any.required": "Number of guests is required.",
    }),
    
    specialRequests: Joi.string().max(500).optional().messages({
        "string.base": "Special requests must be a string.",
        "string.max": "Special requests must be at most 500 characters."
    }),
    
    reservationTime: Joi.date().iso().greater('now').required().custom((value, helpers) => {
        const date = new Date(value);
        const day = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 2 = Tuesday
        const hour = date.getUTCHours();
        // Check for Tuesday (2)
        if (day === 2) {
            return helpers.error('date.closedTuesday');
        }
        // Check for closed hours: 11:00 p.m. (23) to 8:59 a.m. (8)
        if (hour >= 23 || hour < 9) {
            return helpers.error('date.closedHours');
        }
        return value;
    }).messages({
        'date.base': 'Reservation time must be a valid date.',
        'date.format': 'Reservation time must be in ISO format (YYYY-MM-DDTHH:mm:ssZ).',
        'date.greater': 'Reservation time must be in the future.',
        'date.closedTuesday': 'Restaurant is closed on Tuesdays. Please select another day.',
        'date.closedHours': 'Restaurant is closed between 11:00 p.m. and 9:00 a.m. Please select a time during open hours.',
        'any.required': 'Reservation time is required.'
    }),
    
}); 

module.exports = { reservationSchema };

