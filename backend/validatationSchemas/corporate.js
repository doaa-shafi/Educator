const Joi = require("joi");

const corporateSchema = Joi.object({
  team_size: Joi.number().min(5).messages({
    "number.base": `Team size should be a type of 'number'`,
    "number.min": `Team size should be greater than {#limit}`,
    "any.required": `Team size is required`,
  }),

  plan: Joi.string().valid("Standard", "Premium").required().messages({
    "any.required": `Plan is require`,
    "any.only": `Plan must be Standard or Premium`,
  }),
});

module.exports = {
  corporateSchema,
};
