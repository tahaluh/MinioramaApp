import joi from "joi";

const user = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  name: joi.string().required(),
});

export = { user };
