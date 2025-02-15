const bcrypt = require("bcryptjs");

/**
 * Encrypts the password before saving a user document.
 *
 * This function is intended to be used as a Mongoose pre-save middleware. It checks if the password has been
 * modified and if the user is not authenticated via Google. If conditions are met, it generates a salt and hashes the password.
 *
 * @param {Function} next - Callback function to proceed to the next middleware.
 * @returns {Promise<void>} Calls next after the password is encrypted.
 *
 * @example
 * // Using encryptPassword as a pre-save middleware:
 * userSchema.pre('save', encryptPassword);
 */
const encryptPassword = async function (next) {
  if (this.google) {
    return next();
  }

  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};

module.exports = encryptPassword;
