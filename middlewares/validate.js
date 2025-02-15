const { validationResult } = require("express-validator");
const User = require("../models/User");
const Category = require("../models/Category");
const Role = require("../models/Role");
const { request, response } = require("express");

/**
 * Middleware to validate request data using express-validator.
 *
 * Checks if there are validation errors in the request and, if so,
 * returns a response with status code 400 and the error details.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Function to pass to the next middleware.
 * @returns {void} Calls next() if there are no validation errors, otherwise sends a response with the errors.
 *
 * @example
 * app.post('/user', validate, (req, res) => {
 *   // Handle the request
 * });
 */
const validate = (req = request, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validates if an email already exists in the database.
 *
 * @async
 * @function emailExists
 * @param {string} email - The email to check.
 * @returns {Promise<void>} Resolves if the email does not exist.
 * @throws {Error} Throws an error if the email is already registered.
 *
 * @example
 * app.post('/user', [check("email").custom(emailExists), validate], (req, res) => {
 *   // Handle the request
 * });
 */
const emailExists = async (email) => {
  const emailUser = await User.findOne({ email });
  if (emailUser) {
    throw new Error(`User with email ${emailUser.email} exists already.`);
  }
};

/**
 * Validates if the provided role exists in the database.
 *
 * @async
 * @function roleValidator
 * @param {string} role - The role to validate.
 * @returns {Promise<void>} Resolves if the role is valid.
 * @throws {Error} Throws an error if the role does not exist in the database.
 *
 * @example
 * roleValidator('ADMIN_ROLE')
 *   .then(() => console.log('The role is valid'))
 *   .catch(error => console.error(error));
 */
const roleValidator = async (role) => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} not valid.`);
  }
};

/**
 * Validates if the category name already exists in the database.
 *
 * @async
 * @function nameExists
 * @param {string} name - The category name to check.
 * @returns {Promise<void>} Resolves if the name does not exist.
 * @throws {Error} Throws an error if a category with the provided name already exists.
 *
 * @example
 * nameExists('Electronics')
 *   .then(() => console.log('The category name is available'))
 *   .catch(error => console.error(error));
 */
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
  roleValidator,
};
