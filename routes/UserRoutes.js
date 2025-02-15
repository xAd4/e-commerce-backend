const express = require("express");
const { checkSchema } = require("express-validator");
const { validate, emailExists } = require("../middlewares/validate");
const validateJWT = require("../middlewares/validateJWT");
const isAdmin = require("../middlewares/isAdmin");
const hasRole = require("../middlewares/hasRole");

const {
  getUsers,
  getByIdUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/UserController");

const router = express.Router();

// GET / - List of users
router.get("/", getUsers);

// GET /:id - Get a user by ID
const getUserByIdSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.get("/:id", [checkSchema(getUserByIdSchema), validate], getByIdUsers);

// POST / - Create a user
const createUserSchema = {
  name: {
    in: ["body"],
    notEmpty: { errorMessage: "Name is required." },
  },
  email: {
    in: ["body"],
    notEmpty: { errorMessage: "Email is required." },
    isEmail: { errorMessage: "Must be valid email." },
    custom: { options: emailExists },
  },
  password: {
    in: ["body"],
    notEmpty: { errorMessage: "Password is required." },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must have 6 characters or more.",
    },
  },
};

router.post("/", [checkSchema(createUserSchema), validate], createUsers);

// PUT /:id - Update a user
const updateUserSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
  email: {
    in: ["body"],
    optional: true,
    custom: { options: emailExists },
  },
};

router.put(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    checkSchema(updateUserSchema),
    validate,
  ],
  updateUsers
);

// DELETE /:id - Delete a user
const deleteUserSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    checkSchema(deleteUserSchema),
    validate,
  ],
  deleteUsers
);

module.exports = router;
