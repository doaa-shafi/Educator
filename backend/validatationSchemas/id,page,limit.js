const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const idSchema = Joi.object({
  id: Joi.objectId()
    .required(),
 
})

const page_limitSchema= Joi.object({
  page:Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.base': `Page number should be a 'number'`,
      'number.positive': `Page number should be a positive integer`,
      'number.integer': `Page number should be a positive integer`,
      'any.required': `Page number is required`
    }),

  limit:Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.base': `Limit should be a 'number'`,
      'number.positive': `Limit should be a positive integer`,
      'number.integer': `Limit should be a positive integer`,
      'any.required': `Limit is required`
    }),
})

module.exports={
  idSchema,
  page_limitSchema
}