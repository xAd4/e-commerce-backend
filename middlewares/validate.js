const { validationResult } = require("express-validator");
const User = require("../models/User");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//! User validations

//* User ID Validator
const idValidator = async (id) => {
  const userId = await User.findById(id);
  if (!userId) {
    throw new Error(`User with id ${userId} not found.`);
  }
};

//* Email exists validator
const emailExists = async (email) => {
  const emailUser = await User.findOne({ email });
  if (emailUser) {
    throw new Error(`User with email ${emailUser.email} exists already.`);
  }
};

module.exports = { validate, idValidator, emailExists };
