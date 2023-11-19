import joi from "joi";

const updateUserValidation = joi.object({
  email: joi.string().email(),
  name: joi.string(),
});

export = updateUserValidation;
