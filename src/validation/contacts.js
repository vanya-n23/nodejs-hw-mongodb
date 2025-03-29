import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    'string.base': 'Name should be a string.',
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name should have at least {#limit} characters.',
    'string.max': 'Name should have at most {#limit} characters.',
    'any.required': 'Name is required.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{13}$/)
    .required()
    .messages({
      'string.base': 'Phone number should be a string.',
      'string.empty': 'Phone number cannot be empty.',
      'string.pattern.base':
        'Phone number must be exactly 13 digits, including the country code.',
      'any.required': 'Phone number is required.',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email cannot be empty.',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be a boolean (true/false).',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact type should be a string.',
      'any.only': 'Contact type must be one of [work, home, personal].',
      'any.required': 'Contact type is required.',
    }),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).messages({
    'string.base': 'Name should be a string.',
    'string.min': 'Name should have at least {#limit} characters.',
    'string.max': 'Name should have at most {#limit} characters.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{13}$/)
    .messages({
      'string.pattern.base':
        'Phone number must be exactly 13 digits, including the country code.',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email address.',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be a boolean (true/false).',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of [work, home, personal].',
  }),
}).min(1);
