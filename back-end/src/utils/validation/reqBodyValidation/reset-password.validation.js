const Joi = require("joi");

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).max(30).required().messages({
        "string.base": "New Password must be a string.",
        "string.empty": "New Password is required.",
        "string.min": "New Password must be at least 6 characters.",
        "string.max": "New Password must be at most 30 characters.",
        "any.required": "New Password is required."
    }),
    confirmPassword: Joi.string().required().messages({
        "string.base": "Confirm Password must be a string.",
        "string.empty": "Confirm Password is required.",
        "any.required": "Confirm Password is required."
    })
});

module.exports = {
    resetPasswordSchema
};
