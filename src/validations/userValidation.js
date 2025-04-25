const { check } = require("express-validator");

const validateSignup = [
  check("username").notEmpty().withMessage("username is required"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length must be at least 6 characters"),
  check("name").notEmpty().withMessage("name is required"),
  check("mobile").isMobilePhone().withMessage("Invalid mobile nummber"),
  check("city").notEmpty().withMessage("city is required"),
];

const validateSignin = [
  check("username").notEmpty().withMessage("username is required"),
  check("password").notEmpty().withMessage("password is required"),
];

module.exports = {
  validateSignup,
  validateSignin,
};
