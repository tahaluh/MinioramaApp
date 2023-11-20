import joi from "joi";

const updateCategoryValidation = joi.object({
  name: joi.string().min(3).required(),
});

export = updateCategoryValidation;
