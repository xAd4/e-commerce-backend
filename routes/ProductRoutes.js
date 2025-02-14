const express = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validate");
const {
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getProducts);

router.get(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo ID."), validate],
  getByIdProduct
);

router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Name is required,"),
    check("description").not().isEmpty().withMessage("Description is required"),
    check("price").not().isEmpty().withMessage("Price is required."),
    check("categoryId").not().isEmpty().withMessage("Category is required"),
    check("categoryId").isMongoId().withMessage("Must be Mongo ID"),
    validate,
  ],
  createProduct
);
router.put(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo ID"), validate],
  updateProduct
);

router.delete(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo ID"), validate],
  deleteProduct
);

module.exports = router;
