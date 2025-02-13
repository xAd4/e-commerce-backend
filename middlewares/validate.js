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

//! Category validations

//* Category ID Validator
const idCategoryValidator = async (id) => {
  const categoryId = await Category.findById(id);
  if (!categoryId) {
    throw new Error(`User with id ${categoryId} not found.`);
  }
};

//* Name validator
const nameExists = async (name) => {
  const nameCategory = await Category.findOne({ name });
  if (nameCategory) {
    throw new Error(`Category with name ${nameCategory.name} exists already.`);
  }
};

module.exports = {
  validate,
  idValidator,
  emailExists,
  nameExists,
  idCategoryValidator,
};
