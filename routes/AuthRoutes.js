const express = require("express");
const loginUser = require("../controllers/AuthController");
const validate = require("../middlewares/validate");
const { check } = require("express-validator");

const router = express.Router();

router.post("/", loginUser);

module.exports = router;
