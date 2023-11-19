import joi from "joi";

const createUserValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  name: joi.string().required(),
});

export = createUserValidation;