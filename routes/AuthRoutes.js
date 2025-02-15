const express = require("express");
const { checkSchema } = require("express-validator");
const { validate } = require("../middlewares/validate");
const loginUser = require("../controllers/AuthController");

const router = express.Router();

const loginSchema = {
  email: {
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Must be a valid email" },
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
  },
};

router.post("/", [checkSchema(loginSchema), validate], loginUser);

module.exports = router;
