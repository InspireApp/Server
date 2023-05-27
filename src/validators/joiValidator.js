import joi from 'joi';


export const userDataValidation = (data) => {
  const schema = joi.object({
    fullName: joi.string().min(6).trim().required(),

    email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Email is not a valid email pattern'
      }),

    phoneNumber: joi.number().integer().min(10 ** 9).max(11 ** 11 - 1).required().messages({
      'number.min': 'Mobile number should not be less than 10 digit',
      'number.max': 'Mobile number should be greater than 11 digit'
    }),

    password: joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
      })

  }).strict();

  return schema.validate(data);
}

export const loginValidator = (data) => {
  const schema = joi.object({
    email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Email is not a valid email pattern'
      }),

    password: joi.string().min(6).required()

  }).strict();

  return schema.validate(data);
}