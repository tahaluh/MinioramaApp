import joi from "joi";

const createCategoryValidation = joi.object({
  name: joi.string().min(3).required(),
});

export = createCategoryValidation;
