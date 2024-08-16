const Joi=require('joi')

const instructorSchema = Joi.object({
    miniBiography: Joi.string()
        .alphanum()
        .min(30)
        .max(300)
        .required()
        .messages({
            'string.base': `Category name should be a type of 'text'`,
            'string.empty': `Category name cannot be empty`,
            'string.min': `Category name should have a minimum length of {#limit}`,
            'string.max': `Category name should have a maximum length of {#limit}`,
            'any.required': `Category name is required`
        }),

})

module.exports={
    instructorSchema,
}