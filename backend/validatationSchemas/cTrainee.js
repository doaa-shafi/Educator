const Joi=require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const productSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `Product name should be a type of 'text'`,
            'string.empty': `Product name cannot be empty`,
            'string.min': `Product name should have a minimum length of {#limit}`,
            'string.max': `Product name should have a maximum length of {#limit}`,
            'any.required': `Product name is required`
        }),
    
    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': `Product price should be a 'number'`,
            'number.positive': `Product price should be greater than Zero`,
            'any.required': `Product price is required`
        }),

    category: Joi.array().items(Joi.objectId()).unique()
        .messages({
            'array.base': `Categories should be an array of ids`,
            'array.unique': `Cannot add a category twice`,
        }),

})

module.exports={
    productSchema
}