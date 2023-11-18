import joi from "joi";

const user = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  name: joi.string().required(),
});

const createProduct = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().min(3).required(),
  price: joi.number().integer().required(),
  categories: joi.array().items(joi.number().required().min(1)).required(),
});

const updateProduct = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().min(3).required(),
  price: joi.number().integer().required(),
  categories: joi.array().items(joi.number().required().min(1)).required(),
});

export = { user, createProduct, updateProduct };
