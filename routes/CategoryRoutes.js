const express = require("express");
const { check } = require("express-validator");
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

//* User Endpoints
router.get("/", getCategories);

router.get(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo ID"), validate],
  getByIdCategory
);

router.post(
  "/",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    check("name").not().isEmpty().withMessage("Name is required."),
    check("name").custom(nameExists),
    validate,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    check("name").custom(nameExists),
    validate,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    validate,
  ],
  deleteCategory
);

module.exports = router;
