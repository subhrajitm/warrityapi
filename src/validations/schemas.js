const Joi = require('joi');

const userSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const productSchema = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    manufacturer: Joi.string().required(),
    modelNumber: Joi.string().required()
  }),

  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    manufacturer: Joi.string(),
    modelNumber: Joi.string()
  })
};

const warrantySchema = {
  create: Joi.object({
    productId: Joi.string().required(),
    purchaseDate: Joi.date().required(),
    expirationDate: Joi.date().min(Joi.ref('purchaseDate')).required(),
    warrantyProvider: Joi.string().required(),
    warrantyNumber: Joi.string().required(),
    coverageDetails: Joi.string().required(),
    notes: Joi.string()
  }),

  update: Joi.object({
    purchaseDate: Joi.date(),
    expirationDate: Joi.date().min(Joi.ref('purchaseDate')),
    warrantyProvider: Joi.string(),
    warrantyNumber: Joi.string(),
    coverageDetails: Joi.string(),
    notes: Joi.string()
  })
};

const fileSchema = {
  upload: Joi.object({
    filename: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    createReadStream: Joi.function().required()
  })
};

module.exports = {
  userSchema,
  productSchema,
  warrantySchema,
  fileSchema
}; 