const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

/**
 * Middleware that validates the JSON Web Token (JWT) provided in the request header.
 *
 * It checks for the presence of a token in the "x-token" header, verifies it using the secret key,
 * and attaches the authenticated user object to the request. If the token is missing, invalid,
 * or if the user is not found or inactive, it sends an appropriate error response.
 *
 * @async
 * @function validateJWT
 * @param {import('express').Request} req - Express request object. Expects the token in the "x-token" header.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Calls the next middleware if token is valid; otherwise, sends an error response.
 *
 * @example
 * // Protecting a route with validateJWT middleware
 * app.get('/api/protected', validateJWT, (req, res) => {
 *   res.json({ msg: "Access granted", user: req.userAuthenticated });
 * });
 */
const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const user = await User.findById(uid);

    if (!user)
      return res.status(401).json({ msg: "User not found in database" });

    if (!user.state) return res.status(401).json({ msg: "User state: false" });

    req.userAuthenticated = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = validateJWT;
