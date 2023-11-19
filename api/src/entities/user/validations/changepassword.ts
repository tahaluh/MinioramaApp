import joi from "joi";

const changepasswordValidation = joi.object({
  oldPassword: joi.string().min(6).required(),
  newPassword: joi.string().min(6).required(),
});

export = changepasswordValidation;
