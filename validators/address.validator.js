const Joi = require('joi');

const createAddressSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  addressLine1: Joi.string().required().min(5).max(100),
  addressLine2: Joi.string().optional().max(100),
  city: Joi.string().required().min(2).max(50),
  state: Joi.string().required().min(2).max(50),
  postalCode: Joi.string().required().pattern(/^[0-9]{6}$/),
  country: Joi.string().required().min(2).max(50),
  isDefault: Joi.boolean().optional().default(false)
});

const updateAddressSchema = Joi.object({
  firstName: Joi.string().optional().min(2).max(50),
  lastName: Joi.string().optional().min(2).max(50),
  phone: Joi.string().optional().pattern(/^[0-9]{10}$/),
  addressLine1: Joi.string().optional().min(5).max(100),
  addressLine2: Joi.string().optional().max(100),
  city: Joi.string().optional().min(2).max(50),
  state: Joi.string().optional().min(2).max(50),
  postalCode: Joi.string().optional().pattern(/^[0-9]{6}$/),
  country: Joi.string().optional().min(2).max(50),
  isDefault: Joi.boolean().optional()
});

module.exports = {
  createAddressSchema,
  updateAddressSchema
};
