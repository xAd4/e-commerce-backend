const express = require("express");
const { checkSchema } = require("express-validator");
const validateJWT = require("../middlewares/validateJWT");
const hasRole = require("../middlewares/hasRole");
const { validate } = require("../middlewares/validate");

const {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/CartController");

const router = express.Router();

// GET / - List of carts
router.get("/", getCarts);

// GET /:id - Get a cart by ID
const getCartByIdSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo DB" },
  },
};

router.get("/:id", [checkSchema(getCartByIdSchema), validate], getByIdCart);

// POST / - Create a cart
const createCartSchema = {
  userId: {
    in: ["body"],
    notEmpty: { errorMessage: "User ID is required." },
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
  "products.*.productId": {
    in: ["body"],
    notEmpty: { errorMessage: "Product is required" },
    isMongoId: { errorMessage: "Must be Mongo ID" },
  },
};

router.post(
  "/",
  [
    validateJWT,
    hasRole("admin", "user"),
    checkSchema(createCartSchema),
    validate,
  ],
  createCart
);

// PUT /:id - Update a cart by ID
const idParamSchema = {
  id: {
    in: ["params"],
    isMongoId: { errorMessage: "Must be Mongo DB" },
  },
};

router.put(
  "/:id",
  [validateJWT, hasRole("admin", "user"), checkSchema(idParamSchema), validate],
  updateCart
);

// DELETE /:id - Delete a cart by ID
router.delete(
  "/:id",
  [validateJWT, hasRole("admin", "user"), checkSchema(idParamSchema), validate],
  deleteCart
);

module.exports = router;
