const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const User = require("../models/User");

/**
 * Authenticates a user by verifying email and password, and generates a JSON Web Token (JWT) upon successful login.
 *
 * This function checks if the user exists, if the user's account is active, and if the provided password
 * matches the stored hash. If all validations pass, it generates and returns a JWT along with the user data.
 *
 * @async
 * @function loginUser
 * @param {import("express").Request} req - Express request object containing the user's email and password in req.body.
 * @param {import("express").Response} res - Express response object used to send the JSON response.
 * @returns {Promise<import("express").Response>} A JSON response containing the user object and the JWT token if authentication succeeds,
 * or an error message if authentication fails.
 *
 * @example
 * // Example request body:
 * // { "email": "user@example.com", "password": "userpassword" }
 * loginUser(req, res);
 */
const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Invalid credentials. User not found.",
      });
    }

    // Check if the user's account is active
    if (!user.state) {
      return res.status(400).json({
        ok: false,
        message: "The user account is inactive.",
      });
    }

    // Validate the password (use async to avoid blocking the event loop)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: "Invalid credentials. Incorrect password.",
      });
    }

    // Generate the JWT
    const token = await generateJWT(user.id);

    return res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error. Please contact the administrator.",
    });
  }
};

module.exports = loginUser;
