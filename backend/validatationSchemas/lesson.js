const Joi = require("joi");
const { isValidVideoLink } = require("../helpers/videoHelpers");

const createLessonSchema = Joi.object({
  title: Joi.string().max(30).required().messages({
    "string.base": `Course title should be a type of 'text'`,
    "string.empty": `Course title cannot be empty`,
    "string.min": `Course title should have a minimum length of {#limit}`,
    "string.max": `Course title should have a maximum length of {#limit}`,
    "any.required": `Course title is required`,
  }),
});

const quizSchema = Joi.object({
  question: Joi.string().required().messages({
    "string.base": `Question should be a type of 'text'`,
    "string.empty": `Question cannot be empty`,
    "string.min": `Question should have a minimum length of {#limit}`,
    "string.max": `Question should have a maximum length of {#limit}`,
    "any.required": `Question is required`,
  }),
  choiceA: Joi.string().required().messages({
    "string.base": `Choice should be a type of 'text'`,
    "string.empty": `Choice cannot be empty`,
    "string.min": `Choice should have a minimum length of {#limit}`,
    "string.max": `Choice should have a maximum length of {#limit}`,
    "any.required": `Choice is required`,
  }),
  choiceB: Joi.string().required().messages({
    "string.base": `Choice should be a type of 'text'`,
    "string.empty": `Choice cannot be empty`,
    "string.min": `Choice should have a minimum length of {#limit}`,
    "string.max": `Choice should have a maximum length of {#limit}`,
    "any.required": `Choice is required`,
  }),
  choiceC: Joi.string().required().messages({
    "string.base": `Choice should be a type of 'text'`,
    "string.empty": `Choice cannot be empty`,
    "string.min": `Choice should have a minimum length of {#limit}`,
    "string.max": `Choice should have a maximum length of {#limit}`,
    "any.required": `Choice is required`,
  }),
  choiceD: Joi.string().required().messages({
    "string.base": `Choice should be a type of 'text'`,
    "string.empty": `Choice cannot be empty`,
    "string.min": `Choice should have a minimum length of {#limit}`,
    "string.max": `Choice should have a maximum length of {#limit}`,
    "any.required": `Choice is required`,
  }),
  answer: Joi.string().valid("A", "B", "C", "D").required().messages({
    "string.base": `answer should be a type of 'text'`,
    "string.empty": `answer cannot be empty`,
    "any.invalid": `There is no choice like this`,
    "any.required": `answer is required`,
  }),
  comment: Joi.string().required().messages({
    "string.base": `Answer explanation should be a type of 'text'`,
    "string.empty": `Answer explanation cannot be empty`,
    "string.min": `Answer explanation should have a minimum length of {#limit}`,
    "string.max": `Answer explanation should have a maximum length of {#limit}`,
    "any.required": `Answer explanation is required`,
  }),
});


const videoSchema = Joi.object({
  link: Joi.string()
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
  title: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": `Video Title should be a type of 'text'`,
    "string.empty": `Video Title cannot be empty`,
    "string.min": `Video Title should have a minimum length of {#limit}`,
    "string.max": `Video Title should have a maximum length of {#limit}`,
    "any.required": `Video Title is required`,
  }),
});

const lectureSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": `Lecture Title should be a type of 'text'`,
    "string.empty": `Lecture Title cannot be empty`,
    "string.min": `Lecture Title should have a minimum length of {#limit}`,
    "string.max": `Lecture Title should have a maximum length of {#limit}`,
    "any.required": `Lecture Title is required`,
  }),

  duration: Joi.number().positive().required().messages({}),
});

module.exports = {
  createLessonSchema,
  quizSchema,
  videoSchema,
  lectureSchema,
};
