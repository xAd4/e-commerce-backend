const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const User = require("../models/User");

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
