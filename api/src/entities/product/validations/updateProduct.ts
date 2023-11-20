import joi from "joi";

const updateProductValidation = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().min(3).required(),
  price: joi.number().integer().required(),
  categories: joi.array().items(joi.number().required().min(1)).required(),
  imageUrl: joi.string().uri(),
});

export = updateProductValidation;
