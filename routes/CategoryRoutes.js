const express = require("express");
const { check } = require("express-validator");

const {
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/index");

const { validate, nameExists } = require("../middlewares/index");

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
    check("name").not().isEmpty().withMessage("Name is required."),
    check("name").custom(nameExists),
    validate,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    check("name").custom(nameExists),
    validate,
  ],
  updateCategory
); // TODO: Allow only user-admin can do put

router.delete(
  "/:id",
  [check("id").isMongoId().withMessage("Must be Mongo ID"), validate],
  deleteCategory
); // TODO : Allow only user-admin can do delete

module.exports = router;
