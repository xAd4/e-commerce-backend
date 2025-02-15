const express = require("express");
const { checkSchema } = require("express-validator");
const { validate } = require("../middlewares/validate");
const validateJWT = require("../middlewares/validateJWT");
const hasRole = require("../middlewares/hasRole");

const {
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

const router = express.Router();

// GET / - List of products
router.get("/", getProducts);

// GET /:id - Gets a product by ID
const getProductByIdSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID." },
  },
};

router.get(
  "/:id",
  [checkSchema(getProductByIdSchema), validate],
  getByIdProduct
);

// POST / - Creates a product
const createProductSchema = {
  userId: {
    in: ["body"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
  name: {
    in: ["body"],
    notEmpty: { errorMessage: "Name is required." },
  },
  description: {
    in: ["body"],
    notEmpty: { errorMessage: "Description is required" },
  },
  price: {
    in: ["body"],
    notEmpty: { errorMessage: "Price is required." },
  },
  categoryId: {
    in: ["body"],
    notEmpty: { errorMessage: "Category is required" },
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.post(
  "/",
  [
    validateJWT,
    hasRole("admin", "user"),
    checkSchema(createProductSchema),
    validate,
  ],
  createProduct
);

// PUT /:id - Updates a product
const idParamSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.put(
  "/:id",
  [validateJWT, hasRole("admin", "user"), checkSchema(idParamSchema), validate],
  updateProduct
);

// DELETE /:id - Deletes a product
router.delete(
  "/:id",
  [validateJWT, hasRole("admin", "user"), checkSchema(idParamSchema), validate],
  deleteProduct
);

module.exports = router;
