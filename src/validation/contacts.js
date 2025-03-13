import Joi from 'joi';

const baseShema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(8).max(20),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const createValidationShema = baseShema.fork(
  ['name', 'phoneNumber', 'contactType'],
  (field) => field.required(),
);

export const updateValidationShema = baseShema;
