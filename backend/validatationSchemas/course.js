const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { isValidVideoLink } = require("../helpers/videoHelpers");

const updateCourseSchema = Joi.object({
  _id: Joi.objectId(),

  title: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .min(3)
    .max(50)
    .messages({
      "string.base": `Course title should be a type of 'text'`,
      "string.empty": `Course title cannot be empty`,
      "string.min": `Course title should have a minimum length of {#limit}`,
      "string.max": `Course title should have a maximum length of {#limit}`,
      "any.required": `Course title is required`,
      "string.pattern.base": `Course title should contain only letters, numbers, and spaces`,
    }),

  description: Joi.string()
    .min(30)
    .max(9000)
    .messages({
      "string.base": `Course description should be a type of 'text'`,
      "string.empty": `Course description cannot be empty`,
      "string.min": `Course description should have a minimum length of {#limit}`,
      "string.max": `Course description should have a maximum length of {#limit}`,
      "any.required": `Course description is required`,
      "string.pattern.base": `Course description should contain only letters, numbers, and spaces`,
    }),

  subject: Joi.string()
    .pattern(/^[a-zA-Z0-9 &]+$/)
    .min(3)
    .max(30)
    .messages({
      "string.base": `Course subject should be a type of 'text'`,
      "string.empty": `Course subject cannot be empty`,
      "string.min": `Course subject should have a minimum length of {#limit}`,
      "string.max": `Course subject should have a maximum length of {#limit}`,
      "any.required": `Course subject is required`,
      "string.pattern.base": `Course subject should contain only letters, numbers, and spaces`,
    }),

  previewVideo: Joi.string()
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

  price: Joi.number().positive().messages({
    "number.base": `Course price should be a 'number'`,
    "number.positive": `Course price should be greater than Zero`,
  }),

  discount: Joi.object({
    quantity: Joi.number().min(0).max(100).messages({
      "number.base": `Discount percentage should be a 'number'`,
      "number.min": `Discount percentage should be greater than {#limit}`,
      "number.max": `Discount percentage cannot be greater than {#limit}`,
    }),

    discountStart: Joi.date()
      .when("quantity", {
        is: Joi.number().greater(0),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        "date.base": `Please add a valid discount start date`,
        "any.required": `Discount start date is required when discount quantity is greater than zero`,
        "any.unknown": `Cannot add discount start date since there is no discount added`,
      }),

    discountEnd: Joi.date()
      .when("quantity", {
        is: Joi.number().greater(0),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .greater(Joi.ref("discountStart"))
      .messages({
        "date.base": `Please add a valid discount end date`,
        "date.greater": `Discount end date should be after discount start date`,
        "any.required": `Discount end date is required`,
        "any.unknown": `Cannot add discount end date since there is no discount added`,
      }),
  }).optional(),

  level: Joi.string().valid("Beginner", "Intermediate", "Advanced").messages({
    "any.invalid": `Course level should be one of these values ('Beginner', 'Intermediate','Advanced')`,
  }),

  learnings: Joi.array().items(Joi.string()).messages({
    "array.base": `Learnings should be an array of strings`,
  }),

  requirements: Joi.array().items(Joi.string()).messages({
    "array.base": `Requirements should be an array of strings`,
  }),
});

const publishCourseSchema = updateCourseSchema.fork(
  ["_id", "title", "description", "subject", "previewVideo","price","level","learnings","requirements"],
  (schema) => schema.required()
);

const courseTitleSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": `Course title should be a type of 'text'`,
      "string.empty": `Course title cannot be empty`,
      "string.min": `Course title should have a minimum length of {#limit}`,
      "string.max": `Course title should have a maximum length of {#limit}`,
      "any.required": `Course title is required`,
      "string.pattern.base": `Course title should contain only letters, numbers, and spaces`,
    }),
});

module.exports = {
  updateCourseSchema,
  publishCourseSchema,
  courseTitleSchema,
};
