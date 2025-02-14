const express = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validate"); /* */
const loginUser = require("../controllers/AuthController");

const router = express.Router();

router.post(
  "/",
  [
    check("email").not().isEmpty().withMessage("Email is required"),
    check("email").isEmail().withMessage("Must be Email"),
    check("password").not().isEmpty().withMessage("Password is required"),
    validate,
  ],
  loginUser
);

module.exports = router;
