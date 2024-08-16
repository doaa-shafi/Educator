const Joi = require('joi')
const {isValidVideoLink}=require('../helpers/videoHelpers')

const createCourseSchema= Joi.object({
    title: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
          'string.base': `Course title should be a type of 'text'`,
          'string.empty': `Course title cannot be empty`,
          'string.min': `Course title should have a minimum length of {#limit}`,
          'string.max': `Course title should have a maximum length of {#limit}`,
          'any.required': `Course title is required`
    }),

    description: Joi.string()
    .alphanum()
    .min(30)
    .max(300)
    .required()
    .messages({
        'string.base': `Course description should be a type of 'text'`,
        'string.empty': `Course description cannot be empty`,
        'string.min': `Course description should have a minimum length of {#limit}`,
        'string.max': `Course description should have a maximum length of {#limit}`,
        'any.required': `Course description is required`
    }),

    subject: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
          'string.base': `Course subject should be a type of 'text'`,
          'string.empty': `Course subject cannot be empty`,
          'string.min': `Course subject should have a minimum length of {#limit}`,
          'string.max': `Course subject should have a maximum length of {#limit}`,
          'any.required': `Course subject is required`
    }),
})

const courseTitleSchema= Joi.object({
  title: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
        'string.base': `Course title should be a type of 'text'`,
        'string.empty': `Course title cannot be empty`,
        'string.min': `Course title should have a minimum length of {#limit}`,
        'string.max': `Course title should have a maximum length of {#limit}`,
        'any.required': `Course title is required`
  }),
})


const videoURLSchema = Joi.object({
  previewVideo: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!isValidVideoLink(value)) {
        return helper.message("Please enter a valid youtube link");
      }
      return true;
    })
    .messages({
      "string.base": `Preview video URL should be a type of 'text'`,
      "string.empty": `Preview video URL cannot be empty`,
      "any.required": `Preview video URL is required`,
    }),
});

const coursePricingSchema= Joi.object({
  price: Joi.number()
    .positive()
    .messages({
      'number.base': `Course price should be a 'number'`,
      'number.positive': `Course price should be greater than Zero`,
  }),

  quantity: Joi.number()
    .positive()
    .max(100)
    .messages({
      'number.base': `Discount percentage should be a 'number'`,
      'number.positive': `Discount percentage should be greater than Zero`,
      'number.max':`Discount percentage cannot be greater than {#limit}`
  }),

  discountStart:Joi.date()
    .when('quantity', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.forbidden() })
    .messages({
        'date.base': `Please add a valid discount start date`,
        'any.unknown': `Cannot add discount start date since there is no discount added`,
        'any.required': `Discount start date is required`
    }),

  discountEnd:Joi.date()
    .when('quantity', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.forbidden() })
    .messages({
      'date.base': `Please add a valid discount end date`,
      'date.greater':`Discount end date should be after discount start date`,
      'any.unknown': `Cannot add discount end date since there is no discount added`,
      'any.required': `Discount end date is required`
    }),
})

const courseLearningSchema= Joi.object({
  level: Joi.string()
    .valid('Beginner', 'Intermediate','Advanced')
    .messages({
      'any.invalid': `Course level should be one of these values ('Beginner', 'Intermediate','Advanced')`,
  }),


  learnings: Joi.array().items(Joi.string())
    .messages({
      'array.base': `Learnings should be an array of strings`,
  }),

  requirements: Joi.array().items(Joi.string())
    .messages({
      'array.base': `Requirements should be an array of strings`,
  }),
})

module.exports={
  createCourseSchema,
  courseTitleSchema,
  videoURLSchema,
  coursePricingSchema,
  courseLearningSchema
}