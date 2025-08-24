import { body, validationResult } from "express-validator";

export const registrationValidation = [
  body("name")
    .notEmpty()
    .withMessage("Input field must have string")
    .isLength({ min: 3 })
    .withMessage("name should be contain at least 3 charcter"),

  body("email")
    .notEmpty()
    .withMessage("please enter email")
    .isEmail()
    .withMessage("enter valid email"),

  body("password")
    .notEmpty()
    .withMessage("please enter password")
    .matches(/[0-9]/)
    .withMessage("password should be contain number between 0-9")
    .matches(/[a-z]/)
    .withMessage("password should be contain char between a-z")
    .matches(/[A-Z]/)
    .withMessage("password should be contain char between A-Z")
    .matches(/[@#$&]/)
    .withMessage("password should be contain special"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("please enter email")
    .isEmail()
    .withMessage("enter valid email"),

  body("password")
    .notEmpty()
    .withMessage("please enter password")
    .matches(/[0-9]/)
    .withMessage("password should be contain number between 0-9")
    .matches(/[a-z]/)
    .withMessage("password should be contain char between a-z")
    .matches(/[A-Z]/)
    .withMessage("password should be contain char between A-Z")
    .matches(/[@#$&]/)
    .withMessage("password should be contain special"),
];

export const validationError = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(401).json({
      message: error.array()[0].msg,
      error: error.array(),
    });
  }
  next();
};
