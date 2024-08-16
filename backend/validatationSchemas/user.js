const Joi=require('joi')

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .messages({
            'string.base': `Username should be a type of 'text'`,
            'string.empty': `Username cannot be empty`,
            'string.min': `Username should have a minimum length of {#limit}`,
            'string.max': `Username should have a maximum length of {#limit}`,
            'any.required': `Username is required`
        }),

    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9#?!@$%^&*-]{8,}$'))
        .messages({
            'string.base': `Password should be a type of 'text'`,
            'string.empty': `Password cannot be empty`,
            'string.min': `Password should have a minimum length of {#limit}`,
            'string.pattern.base': `Password should have at least one uppercase letter, one lowercase letter, one digit and one special character`,
            'any.required': `Password is required`
        }),

    confirm_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .messages({
            'string.base': `Email should be a type of 'text'`,
            'string.empty': `Email cannot be empty`,
            'string.email': `Enter a valid email`,
            'any.required': `Email is required`
        }),

})
const signupSchema = userSchema.fork(['username', 'email','password', 'confirm_password'], (schema) => schema.required());
const loginSchema = userSchema.fork(['username', 'password'], (schema) => schema.required());
const addUserSchema = userSchema.fork(['username', 'email', 'password'], (schema) => schema.required());


module.exports={
    signupSchema,
    loginSchema,
    addUserSchema,
}