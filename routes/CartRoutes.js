const express = require("express");
const { check, body } = require("express-validator");
const validateJWT = require("../middlewares/validateJWT"); /* */
const hasRole = require("../middlewares/hasRole"); /* */
const { validate } = require("../middlewares/validate"); /* */

const {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/CartController");

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
    validateJWT,
    hasRole("admin", "user"),
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
  [
    validateJWT,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo DB"),
    validate,
  ],
  updateCart
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo DB"),
    validate,
  ],
  deleteCart
);

module.exports = router;
