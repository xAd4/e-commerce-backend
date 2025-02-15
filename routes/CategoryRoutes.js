const express = require("express");
const { checkSchema } = require("express-validator");
const validateJWT = require("../middlewares/validateJWT");
const isAdmin = require("../middlewares/isAdmin");
const hasRole = require("../middlewares/hasRole");
const { validate, nameExists } = require("../middlewares/validate");

const {
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

const router = express.Router();

// GET / - List of categories
router.get("/", getCategories);

// GET /:id - Get a category by ID
const getCategoryByIdSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.get(
  "/:id",
  [checkSchema(getCategoryByIdSchema), validate],
  getByIdCategory
);

// POST / - Create a category
const createCategorySchema = {
  name: {
    in: ["body"],
    notEmpty: { errorMessage: "Name is required." },
    custom: { options: nameExists },
  },
};

router.post(
  "/",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    checkSchema(createCategorySchema),
    validate,
  ],
  createCategory
);

// PUT /:id - Update a category
const updateCategorySchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
  name: {
    in: ["body"],
    optional: true,
    custom: { options: nameExists },
  },
};

router.put(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    checkSchema(updateCategorySchema),
    validate,
  ],
  updateCategory
);

// DELETE /:id - Delete a category
const deleteCategorySchema = {
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
    checkSchema(deleteCategorySchema),
    validate,
  ],
  deleteCategory
);

module.exports = router;
