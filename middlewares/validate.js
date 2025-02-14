const { validationResult } = require("express-validator");
const User = require("../models/User");
const Category = require("../models/Category");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//! User validations

//* Email exists validator
const emailExists = async (email) => {
  const emailUser = await User.findOne({ email });
  if (emailUser) {
    throw new Error(`User with email ${emailUser.email} exists already.`);
  }
};

//! Category validations

//* Name validator
const nameExists = async (name) => {
  const nameCategory = await Category.findOne({ name });
  if (nameCategory) {
    throw new Error(`Category with name ${nameCategory.name} exists already.`);
  }
};

module.exports = {
  validate,
  emailExists,
  nameExists,
};
