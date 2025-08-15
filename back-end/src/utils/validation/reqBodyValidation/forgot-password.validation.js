const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
    email:Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    })
})


module.exports = {
    forgotPasswordSchema
}

