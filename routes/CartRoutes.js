const express = require("express");
const { check, body } = require("express-validator");
const { validate } = require("../middlewares/validate");

const {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getCarts);

router.get(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo DB"), validate],
  getByIdCart
);

router.post(
  "/",
  [
    check("userId").isMongoId().withMessage("Must be Mongo ID"),
    check("userId").not().isEmpty().withMessage("User ID is required."),
    body("products.*.productId")
      .isMongoId()
      .withMessage("Must be Mongo ID")
      .not()
      .isEmpty()
      .withMessage("Product is required"),
    validate,
  ],
  createCart
);

router.put(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo DB"), validate],
  updateCart
);

router.delete(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo DB"), validate],
  deleteCart
);

module.exports = router;
