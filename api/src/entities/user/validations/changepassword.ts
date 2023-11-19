import joi from "joi";

const changepasswordValidation = joi.object({
  oldPassword: joi.string().min(3).required(),
  newPassword: joi.string().min(3).required(),
});

export = changepasswordValidation;
