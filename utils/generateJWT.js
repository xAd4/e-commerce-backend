const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generates a JSON Web Token (JWT) for the provided user ID.
 *
 * @param {string} uid - The user ID to include in the token's payload.
 * @returns {Promise<string>} A promise that resolves with the generated JWT.
 *
 * @example
 * generateJWT('user123')
 *   .then(token => console.log(token))
 *   .catch(err => console.error(err));
 */
const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Don't generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateJWT;
